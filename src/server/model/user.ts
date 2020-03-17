import {BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Campaign} from './campaign';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({nullable: true, default: ''})
    name!: string;

    @ManyToMany(() => Campaign, campaign => campaign.users)
    campaigns!: Campaign[];
}
