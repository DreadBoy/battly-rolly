import {
    BaseEntity,
    Column,
    Entity,
    getManager,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {Encounter} from './encounter';
import {User} from './user';
import {map} from 'lodash';

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

    static async affectedUsers(campaignId: string): Promise<string[]> {
        const users = await getManager().createQueryBuilder(User, 'user')
            .leftJoin('user.campaigns', 'campaign')
            .where('campaign.id = :campaignId', {campaignId})
            .select('user.id')
            .getMany();
        return map(users, 'id');
    }
}
