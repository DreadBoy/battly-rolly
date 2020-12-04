import {HttpError} from '../middlewares/error-middleware';
import {Monster} from '../model/monster';
import {User} from '../model/user';
import {assign, includes, map, remove} from 'lodash';
import {validateObject} from '../middlewares/validators';
import {getManager, SelectQueryBuilder} from 'typeorm';
import {getUser} from './user';
import {broadcastObject} from './socket';

export async function getMonster(id: string, relations: string[] = ['actions', 'owner', 'subscribers']): Promise<Monster> {
    const monster = await Monster.findOne(id, {relations});
    if (!monster)
        throw new HttpError(404, `Monster with id ${id} not found`);
    return monster;
}

export async function createMonster(user: User, body: Partial<Monster>): Promise<Monster> {
    const monster = new Monster();
    body = validateObject(body, ['name', 'HP', 'AC', 'abilitySet', 'savingThrows'], ['actions']);
    assign(monster, body);
    monster.owner = user;
    return monster.save();
}

export async function updateMonster(id: string, user: User, body: Partial<Monster>): Promise<Monster> {
    let monster = await getMonster(id);
    if (monster.owner.id !== user.id)
        throw new HttpError(403, 'You are not author of this monster, you can\'t change it!');
    body = validateObject(body, [], ['name', 'HP', 'AC', 'abilitySet', 'savingThrows', 'actions']);
    assign(monster, body);
    monster = await monster.save();
    await pushMonsterOverSockets(id);
    return monster;
}

export async function deleteMonster(id: string, user: User): Promise<void> {
    const monster = await getMonster(id);
    if (monster.owner.id !== user.id)
        throw new HttpError(403, 'You are not author of this monster, you can\'t change it!');
    await monster.remove();
}

function availableMonsters(user: User): SelectQueryBuilder<Monster> {
    return getManager().createQueryBuilder(Monster, 'monster')
        .leftJoin('monster.subscribers', 'subscriber')
        .leftJoin('monster.owner', 'owner')
        .leftJoin('monster.actions', 'action')
        .addSelect('action')
        .addSelect('owner')
        .where('subscriber.id = :userId', {userId: user.id})
        .orWhere('owner.id = :userId', {userId: user.id})
}

function byName(builder: SelectQueryBuilder<Monster>, term: string): SelectQueryBuilder<Monster> {
    return builder
        .where('LOWER(monster.name) LIKE :name', {name: `%${term.toLowerCase()}%`});
}

export async function searchAvailableMonsters(term: string, user: User): Promise<Monster[]> {
    return byName(availableMonsters(user), term)
        .getMany();
}

export async function getAvailableMonsters(user: User): Promise<Monster[]> {
    return availableMonsters(user)
        .getMany();
}

export async function searchSubscribableMonsters(term: string, user: User): Promise<Monster[]> {
    return byName(getManager().createQueryBuilder(Monster, 'monster'), term)
        .leftJoin('monster.owner', 'owner')
        .where('owner.id != :userId', {userId: user.id})
        .getMany();
}

export async function subscribe(monsterId: string, user: User): Promise<void> {
    user = await getUser(user.id, ['subscribedMonsters', 'monsters'])
    if (includes(map(user.subscribedMonsters, 'id'), monsterId))
        return;
    if (includes(map(user.monsters, 'id'), monsterId))
        throw new HttpError(400, 'You are author of this monster, you can\'t subscribe to it!');
    const monster = await getMonster(monsterId);
    user.subscribedMonsters.push(monster)
    await user.save();
    await pushMonsterOverSockets(monsterId);
}

export async function unsubscribe(monsterId: string, user: User): Promise<void> {
    user = await getUser(user.id, ['subscribedMonsters', 'monsters'])
    if (!includes(map(user.subscribedMonsters, 'id'), monsterId))
        return;
    if (includes(map(user.monsters, 'id'), monsterId))
        throw new HttpError(400, 'You are author of this monster, you can\'t unsubscribe to it!');
    const monster = await getMonster(monsterId);
    remove(user.subscribedMonsters, ['id', monsterId]);
    await user.save();
    await pushMonsterOverSockets(monsterId, map(monster.subscribers, 'id').concat(monster.owner.id));
}

export async function pushMonsterOverSockets(monsterId: string, users?: string[]) {
    const monster = await getMonster(monsterId);
    users = users ?? await Monster.affectedUsers(monsterId)
    broadcastObject(
        Monster.name,
        monster,
        users,
    );
}

