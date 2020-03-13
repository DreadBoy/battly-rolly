import {BaseEntity, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinTable} from 'typeorm';
import {Encounter} from './encounter';
import {User} from './user';

@Entity()
export class Campaign extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToMany(() => User, user => user.campaigns, {eager: true})
    @JoinTable()
    users!: User[];

    @OneToMany(() => Encounter, encounter => encounter.campaign, {eager: true})
    encounters!: Encounter[];

    @ManyToOne(() => User, {eager: true})
    gm!: User;
}
