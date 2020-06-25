import {Encounter} from '../model/encounter';
import {HttpError} from '../middlewares/error-middleware';

export async function getEncounter(encounterId: string, relations: string[] = []): Promise<Encounter> {
    const encounter = await Encounter.findOne(encounterId, {relations});
    if (!encounter)
        throw new HttpError(404, `Encounter with id ${encounterId} not found`);
    return encounter;
}
