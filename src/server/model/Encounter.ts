import {BaseEntity, Entity as TOEntity, OneToMany, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Entity} from './Entity';
import {Campaign} from './Campaign';

@TOEntity()
export class Encounter extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => Campaign, campaign => campaign.encounter)
    campaign!: Campaign;

    @OneToMany(() => Entity, entity => entity.encounter)
    entities!: Entity[];
}
