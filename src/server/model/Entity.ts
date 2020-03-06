import {BaseEntity, Column, Entity as TOEntity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Encounter} from './Encounter';

export type EntityType = 'Player' | 'Monster' | 'Unknown' ;


@TOEntity()
export class Entity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    type!: EntityType;

    /**
     * Hold reference to entity source and its meaning depends on entity's type.
     * It will usually be either monster's name or player's id.
     */
    @Column()
    reference!: string;

    @ManyToOne(() => Encounter, encounter => encounter.entities)
    encounter!: Encounter
}
