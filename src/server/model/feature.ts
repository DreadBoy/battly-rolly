import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Encounter} from './encounter';
import {Log} from './log';
import {Monster} from './monster';
import {User} from './user';

export type FeatureType = 'npc' | 'player';

@Entity()
export class Feature extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

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
