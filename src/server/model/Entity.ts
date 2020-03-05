import {BaseEntity, Entity as TOEntity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Encounter} from './Encounter';

@TOEntity()
export class Entity extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Encounter, encounter => encounter.entities)
    encounter!: Encounter
}
