import {Feature} from '../model/feature';

export const getFeatures = async (ids: string[]): Promise<Feature[]> => {
    return Feature.findByIds(ids);
};
