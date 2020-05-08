import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Transformers} from './transformers';
import {Monster} from './monster';
import {Ability, ActionType, Damage, Status} from './action-types';

@Entity()
export class Action extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    type!: ActionType;

    @Column()
    name!: string;

    @Column({nullable: true})
    modifier?: number;

    @Column({nullable: true})
    DC?: number;

    @Column({nullable: true})
    ability?: Ability;

    @Column('text', {
        transformer: Transformers.damage,
    })
    damage!: Damage;

    @Column({default: false})
    takeHalfOnFailure?: boolean;

    @Column({nullable: true})
    status?: Status;

    @ManyToOne(() => Monster, monster => monster.actions)
    monster!: Monster;
}

