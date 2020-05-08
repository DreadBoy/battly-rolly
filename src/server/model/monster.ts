import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Transformers} from './transformers';
import {Action} from './action';
import {User} from './user';
import {AbilitySet, Roll} from './action-types';


@Entity()
export class Monster extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column('text', {
        transformer: Transformers.number,
    })
    HP!: Roll;

    @Column()
    AC!: number;

    @Column('text', {
        transformer: Transformers.abilitySet,
    })
    abilitySet!: AbilitySet;

    @Column('text', {
        transformer: Transformers.abilitySet,
    })
    savingThrows!: AbilitySet;

    @OneToMany(() => Action, action => action.monster, {eager: true, cascade: true})
    actions!: Action[];

    @ManyToOne(() => User, user => user.monsters)
    owner!: User;

    @ManyToMany(() => User, user => user.subscribedMonsters)
    subscribers!: User[];
}
