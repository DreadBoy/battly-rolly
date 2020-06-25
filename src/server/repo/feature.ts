import {Feature, FeatureType} from '../model/feature';
import {assign, find, groupBy, map, pick, uniq} from 'lodash';
import {getConnection, In} from 'typeorm';
import {getEncounter} from './encounter';
import {Monster} from '../model/monster';
import {User} from '../model/user';

export type AddFeature = Pick<Feature, 'AC' | 'HP' | 'initialHP'> &
    {
        reference: string,
        type: FeatureType,
    };

export async function addFeatures(encounterId: string, features: AddFeature[]): Promise<void> {
    const encounter = await getEncounter(encounterId);
    const groups = groupBy(map(features, o => pick(o, ['reference', 'type'])), 'type');
    const references = {
        npc: await Monster.findByIds(uniq(map(groups['npc'], 'reference'))),
        player: await User.findByIds(uniq(map(groups['player'], 'reference'))),
    }
    const added = features.map(obj => {
        const feature = new Feature();
        assign(feature, obj);
        feature.encounter = encounter;
        if (obj.type === 'npc')
            feature.monster = find(references.npc, ['id', obj.reference]);
        if (obj.type === 'player')
            feature.player = find(references.player, ['id', obj.reference]);
        return feature;
    });
    await getConnection().getRepository(Feature).save(added);
}

export async function removeFeatures(features: Feature[]): Promise<void> {
    const ids = map(features, 'id') as string[];
    if (ids.length === 0)
        return;
    await getConnection().getRepository(Feature).delete(ids);
}

export async function removePlayers(playerIds: string[]): Promise<void> {
    const removedPlayers: Feature[] = await Feature.find({where: {player: {id: In(playerIds)}}});
    await removeFeatures(removedPlayers);
}
