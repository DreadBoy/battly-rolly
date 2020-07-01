import {Feature} from '../model/feature';
import {assign, filter, find, forEach, isArray, isEmpty, isNil, map, uniq} from 'lodash';
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

export const updateFeature = async (featureId: string, body: Partial<Feature>): Promise<Feature> => {
    body = validateObject(body, [], ['AC', 'HP', 'name']);
    let feature = await getFeature(featureId, ['encounter', 'monster', 'player']);
    assign(feature, body);
    if (isNil(body.name) ||
        isEmpty(body.name) ||
        body.name === feature?.monster?.name ||
        body.name === feature?.player?.displayName)
        feature.name = null as any;
    feature = await feature.save();
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
