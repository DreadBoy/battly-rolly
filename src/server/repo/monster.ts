import {HttpError} from '../middlewares/error-middleware';
import {Monster} from '../model/monster';

export async function getMonster(id: string, relations: string[] = ['actions', 'owner', 'subscribers']): Promise<Monster> {
    const monster = await Monster.findOne(id, {relations});
    if (!monster)
        throw new HttpError(404, `Monster with id ${id} not found`);
    return monster;
}
