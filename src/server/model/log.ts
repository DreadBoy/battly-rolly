import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {Encounter} from './encounter';
import {Feature} from './feature';
import {Ability, Status} from '../encounter';
import {Transformers} from './transformers';
import {DamageType} from './action-types';

export type LogType = 'direct' | 'aoe';
export type LogStage = 'WaitingOnResult' | 'WaitingOnDamage' | 'WaitingOnConfirmed' | 'Confirmed';

/***
 Flow of direct attack:
 | ATT           |                      | DEF            |
 |---------------|----------------------|----------------|
 | [attack]      |                      |                |
 |               | -- startLog -->      |                |
 |               |                      | [check AC]     |
 |               | <-- resolveResult -- |                |
 | [roll damage] |                      |                |
 |               | -- dealDamage -->    |                |
 |               |                      | [apply damage] |
 |               | <-- confirmDamage -- |                |
 | [done]        |                      |                |
 */

/***
 Flow of aoe attack:
 | ATT           |                      | DEF            |
 |---------------|----------------------|----------------|
 | [attack]      |                      |                |
 |               | -- startLog -->      |                |
 |               |                      | [throw stat]   |
 |               | <-- resolveResult -- |                |
 | [roll damage] |                      |                |
 |               | -- dealDamage -->    |                |
 |               |                      | [apply damage] |
 |               | <-- confirmDamage -- |                |
 | [done]        |                      |                |
 */

@Entity()
export class Log extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    type!: LogType;

    @Column()
    name!: string;

    @ManyToMany(() => Feature)
    @JoinTable()
    source!: Feature[];

    @ManyToMany(() => Feature)
    @JoinTable()
    target!: Feature[];

    @Column()
    stage!: LogStage;

    // If type === direct
    @Column({nullable: true})
    attack!: number;
    // If type === aoe
    @Column({nullable: true})
    DC!: number;
    @Column({nullable: true})
    stat!: Ability;

    @Column('text', {
        transformer: Transformers.boolean,
    })
    success!: (boolean | null)[];

    // If type === aoe
    @Column('text', {
        transformer: Transformers.number,
    })
    throw!: (number | null)[];

    // If type === direct, this is simply damage
    // If type === aoe, this is damage if player failed to save and took full damage
    @Column({nullable: true})
    damageSuccess!: number;
    // If type === aoe, this is damage if player saved but still took same damage (doesn't happen always)
    @Column({nullable: true})
    damageFailure!: number;
    @Column({nullable: true})
    damageType!: DamageType;
    @Column({nullable: true})
    status!: Status;

    @Column('text', {
        transformer: Transformers.boolean,
    })
    confirmed!: (boolean | null)[];

    @ManyToOne(() => Encounter, encounter => encounter.logs)
    encounter!: Encounter;

    @CreateDateColumn()
    createdAt!: Date;
}
