import {Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Monster {

    @PrimaryGeneratedColumn('uuid')
    id!: string;
}
