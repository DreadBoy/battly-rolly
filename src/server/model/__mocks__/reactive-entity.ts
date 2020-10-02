import {BaseEntity, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export abstract class ReactiveEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({type: 'datetime'}) // supported by sqlite
    createdAt!: Date;

    @UpdateDateColumn({type: 'datetime'}) // supported by sqlite
    updatedAt!: Date;
}
