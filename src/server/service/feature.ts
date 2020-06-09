import {Feature} from '../model/feature';
import {assign, filter, find, forEach, isArray, isEmpty, map, uniq} from 'lodash';
import {pushEncounterOverSockets} from './encounter';
import {HttpError} from '../middlewares/error-middleware';
import * as repo from '../repo/feature';
import {validateObject} from '../middlewares/validators';

export type AddFeatures = {
    features: repo.AddFeature[],
};

export const addFeatures = async (encounterId: string, body: AddFeatures): Promise<void> => {
    const {features} = validateObject(body, ['features']);
    await repo.addFeatures(encounterId, features);
    await pushEncounterOverSockets(encounterId);
};

type RemoveFeatures = {
    features: Feature[]
};

export const removeFeatures = async (encounterId: string, body: RemoveFeatures): Promise<void> => {
    await repo.removeFeatures(encounterId, body.features);
    await pushEncounterOverSockets(encounterId);
};

export const removePlayers = async (encounterId: string, playerIds: string[]): Promise<void> => {
    await repo.removePlayers(encounterId, playerIds);
    await pushEncounterOverSockets(encounterId);
};

export const updateFeature = async (featureId: string, body: Partial<Feature>): Promise<Feature> => {
    const feature = await getFeature(featureId, ['encounter']);
    assign(feature, body);
    await feature.save();
    await pushEncounterOverSockets(feature.encounter.id);
    return feature;
};

export const updateFeatures = async (body: [Partial<Feature>]): Promise<Feature[]> => {
    if (!isArray(body))
        throw new HttpError(400, 'Request body expected to be array!');
    const ids = filter(map(body, 'id')) as string[];
    const features = await Feature.findByIds(ids, {relations: ['encounter']});
    if (isEmpty(features))
        throw new HttpError(400, 'Didn\'t find any feature matching ids in body!');
    forEach(features, f => assign(f, find(body, ['id', f.id])));
    await Feature.save(features);
    await Promise.all(map(uniq(map(features, 'encounter.id')),
        pushEncounterOverSockets));
    return features;
};

export const getFeature = async (id: string, relations: string[] = ['monster', 'player']): Promise<Feature> => {
    const feature = await Feature.findOne(id, {relations});
    if (!feature)
        throw new HttpError(404, `Feature with id ${id} not found`);
    return feature;
};
