import {BaseEntity, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Campaign} from './campaign';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToMany(() => Campaign, campaign => campaign.users)
    campaigns!: Campaign[];
}
