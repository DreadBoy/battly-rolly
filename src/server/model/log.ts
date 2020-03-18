import {BaseEntity, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Encounter} from './encounter';
import {Feature} from './feature';

@Entity()
export class Log extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToMany(() => Feature)
    @JoinTable()
    source!: Feature[];

    @ManyToMany(() => Feature)
    @JoinTable()
    target!: Feature[];


    @ManyToOne(() => Encounter, encounter => encounter.logs)
    encounter!: Encounter;
}
