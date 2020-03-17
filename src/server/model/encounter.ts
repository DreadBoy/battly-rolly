import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Campaign} from './campaign';
import {Feature} from './feature';
import {Log} from './log';

@Entity()
export class Encounter extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Campaign, campaign => campaign.encounters)
    campaign!: Campaign;

    @Column()
    active: boolean;

    @OneToMany(() => Feature, feature => feature.encounter, {cascade: true, eager: true})
    features!: Feature[];

    @OneToMany(() => Log, log => log.encounter, {cascade: true, eager: true})
    logs!: Log[];

    constructor() {
        super();
        this.active = false;
    }
}
