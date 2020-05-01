import {BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Campaign} from './campaign';
import {Monster} from './monster';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    email!: string;

    @Column()
    displayName!: string;

    @Column()
    password!: string;

    @Column({default: false})
    invalidate!: boolean;

    @ManyToMany(() => Campaign, campaign => campaign.users)
    campaigns!: Campaign[];

    @OneToMany(() => Monster, monster => monster.owner)
    monsters!: Monster[];

    @ManyToMany(() => Monster, monster => monster.subscribers, {cascade: true})
    @JoinTable()
    subscribedMonsters!: Monster[];
}
