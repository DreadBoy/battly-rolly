import {BaseEntity, Column, Entity as TOEntity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Campaign} from './campaign';
import {reducer} from '../../client/common/reducer';

@TOEntity()
export class Encounter extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Campaign, campaign => campaign.encounters)
    campaign!: Campaign;

    @Column()
    data: string;

    @Column()
    active: boolean;

    constructor() {
        super();
        this.data = reducer(undefined, {type: 'INIT'});
        this.active = false;
    }
}
