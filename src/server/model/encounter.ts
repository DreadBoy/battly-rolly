import {BaseEntity, Column, Entity, getManager, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Campaign} from './campaign';
import {Feature} from './feature';
import {Log} from './log';
import {User} from './user';
import { map } from 'lodash';


@Entity()
export class Encounter extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({default: false})
    active: boolean;

    @Column()
    name!: string;

    @ManyToOne(() => Campaign, campaign => campaign.encounters)
    campaign!: Campaign;

    @OneToMany(() => Feature, feature => feature.encounter)
    features!: Feature[];

    @OneToMany(() => Log, log => log.encounter)
    logs!: Log[];

    constructor() {
        super();
        this.active = false;
    }

    static async affectedUsers(encounterId: string): Promise<string[]> {
        const users = await getManager().createQueryBuilder(User, 'user')
            .leftJoin('user.campaigns', 'campaign')
            .leftJoin('campaign.encounters', 'encounter')
            .where('encounter.id = :encounterId', {encounterId})
            .select('user.id')
            .getMany();
        return map(users, 'id');
    }
}
