import {Log} from '../model/log';

export const getLogs = async (ids: string[]): Promise<Log[]> => {
    return Log.findByIds(ids);
};
