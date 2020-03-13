import {BaseEntity, Column, Entity as TOEntity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Campaign} from './campaign';

@TOEntity()
export class Encounter extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Campaign, campaign => campaign.encounters)
    campaign!: Campaign;

    @Column()
    data!: string;

    @Column()
    active!: boolean;
}
