import {ActionLog} from '../../client/common/encounter';

export type Entity = {
    id: string;
    entityType: 'player' | 'NPC';
    reference: string;
}

export type Encounter = {
    version: number,
    entities: Entity[],
    log: ActionLog[],
}
