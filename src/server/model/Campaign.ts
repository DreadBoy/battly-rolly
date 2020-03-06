import {BaseEntity, Entity, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Encounter} from './Encounter';

@Entity()
export class Campaign extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => Encounter, encounter => encounter.campaign, {eager: true})
    encounter!: Encounter;
}
