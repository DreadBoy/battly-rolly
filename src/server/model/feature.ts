import {BaseEntity, Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Encounter} from './encounter';
import {Log} from './log';

export type FeatureType = 'npc' | 'player';

@Entity()
export class Feature extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    type!: FeatureType;

    @Column()
    reference!: string;

    @ManyToOne(() => Encounter, encounter => encounter.features)
    encounter!: Encounter;

    @Column()
    AC!: number;

    @Column()
    HP!: number;

    @ManyToMany(() => Log)
    logs!: Log[];
}
