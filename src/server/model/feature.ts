import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Encounter} from './encounter';
import {Log} from './log';
import {Monster} from './monster';
import {User} from './user';
import {isNil} from 'lodash';

export type FeatureType = 'npc' | 'player';

@Entity()
export class Feature extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Monster, {eager: true})
    monster?: Monster;

    @ManyToOne(() => User, {eager: true})
    player?: User;

    @ManyToOne(() => Encounter, encounter => encounter.features)
    encounter!: Encounter;

    @Column()
    AC!: number;

    @Column()
    HP!: number;

    @Column()
    initialHP!: number;

    @ManyToMany(() => Log)
    logs!: Log[];

    get type(): FeatureType {
        if (!isNil(this.player))
            return 'player'
        return 'npc';
    }
}
