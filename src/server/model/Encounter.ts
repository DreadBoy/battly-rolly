import {BaseEntity, Column, Entity as TOEntity, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Campaign} from './Campaign';

@TOEntity()
export class Encounter extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => Campaign, campaign => campaign.encounter)
    campaign!: Campaign;

    @Column()
    data!: string;

    @Column()
    active!: boolean;
}
