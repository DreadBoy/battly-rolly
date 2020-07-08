import {Column, Entity, ManyToMany, ManyToOne} from 'typeorm';
import {ReactiveEntity} from './reactive-entity';
import {Encounter} from './encounter';
import {Log} from './log';
import {Monster} from './monster';
import {User} from './user';

export type FeatureType = 'npc' | 'player';

@Entity()
export class Feature extends ReactiveEntity {

    @Column({nullable: true})
    name?: string;

    @ManyToOne(() => Monster, {eager: true})
    monster?: Monster;

    @ManyToOne(() => User, {eager: true})
    player?: User;

    @ManyToOne(() => Encounter, encounter => encounter.features, {onDelete: 'CASCADE'})
    encounter!: Encounter;

    @Column()
    AC!: number;

    @Column()
    HP!: number;

    @Column()
    initialHP!: number;

    @ManyToMany(() => Log)
    logs!: Log[];
}
