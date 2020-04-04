import {BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Encounter} from './encounter';
import {Feature} from './feature';
import {Ability, Status} from '../../client/common/encounter';

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

    @Column({nullable: true})
    success!: boolean;

    // If type === direct
    @Column({nullable: true})
    AC!: number;
    // If type === aoe
    @Column({nullable: true})
    throw!: number;

    @Column({nullable: true})
    damage!: number;
    @Column({nullable: true})
    status!: Status;

    @ManyToOne(() => Encounter, encounter => encounter.logs)
    encounter!: Encounter;
}
