import {Column, Entity, getManager, ManyToMany, ManyToOne, OneToMany} from 'typeorm';
import {ReactiveEntity} from './reactive-entity';
import {Transformers} from './transformers';
import {Action} from './action';
import {User} from './user';
import {AbilitySet, Roll} from './action-types';
import {map} from 'lodash';


@Entity()
export class Monster extends ReactiveEntity {

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

    static async affectedUsers(monsterId: string): Promise<string[]> {
        const users = await getManager().createQueryBuilder(User, 'user')
            .leftJoin('user.monsters', 'monster')
            .leftJoin('user.subscribedMonsters', 'subscribedMonster')
            .where('monster.id = :monsterId', {monsterId})
            .orWhere('subscribedMonster.id = :monsterId', {monsterId})
            .select('user.id')
            .getMany();
        return map(users, 'id');
    }
}
