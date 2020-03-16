import {BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Encounter} from './encounter';
import {User} from './user';

@Entity()
export class Campaign extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @ManyToMany(() => User, user => user.campaigns, {eager: true})
    @JoinTable()
    users!: User[];

    @OneToMany(() => Encounter, encounter => encounter.campaign, {eager: true, cascade: true})
    encounters!: Encounter[];

    @ManyToOne(() => User, {eager: true})
    gm!: User;
}
