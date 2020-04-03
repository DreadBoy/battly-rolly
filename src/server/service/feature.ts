import {Feature} from '../model/feature';
import {assign, map, pick} from 'lodash';
import {getConnection} from 'typeorm';
import {getEncounter, pushEncounterOverSockets} from './encounter';
import {HttpError} from '../middlewares/error-middleware';

type Body = { features: Partial<Feature>[] };

export const addFeatures = async (encounterId: string, body: Body): Promise<void> => {
    const encounter = await getEncounter(encounterId);
    const features = body.features.map(obj => {
        const feature = new Feature();
        assign(feature, obj);
        feature.encounter = encounter;
        return feature;
    });
    await getConnection().getRepository(Feature).save(features);
    await pushEncounterOverSockets(encounterId);
};

export const removeFeatures = async (encounterId: string, body: Body): Promise<void> => {
    const ids = map(body.features, 'id') as string[];
    if(ids.length === 0)
        return;
    await getConnection().getRepository(Feature).delete(ids);
    await pushEncounterOverSockets(encounterId);
};

export const removePlayers = async (encounterId: string, playerIds: string[]): Promise<void> => {
    const encounter = await getEncounter(encounterId);
    const removedPlayers = encounter.features
        .filter(feature => playerIds.includes(feature.reference))
        .map(u => pick(u, 'id'));
    await removeFeatures(encounterId, {features: removedPlayers});
};

export const updateFeature = async (featureId: string, body: Partial<Feature>): Promise<Feature> => {
    const feature = await Feature.findOne(featureId, {relations: ['encounter']});
    if (!feature)
        throw new HttpError(404, `Feature with id ${featureId} not found`);
    assign(feature, body);
    await feature.save();
    await pushEncounterOverSockets(feature.encounter.id);
    return feature;
};

export const getFeatures = async (ids: string[]): Promise<Feature[]> => {
    return Feature.findByIds(ids);
};
