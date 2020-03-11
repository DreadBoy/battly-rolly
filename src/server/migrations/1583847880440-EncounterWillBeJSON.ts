import {MigrationInterface, QueryRunner} from "typeorm";

export class EncounterWillBeJSON1583847880440 implements MigrationInterface {
    name = 'EncounterWillBeJSON1583847880440'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "encounter" ADD "data" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "encounter" ADD "active" boolean NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "encounter" DROP COLUMN "active"`, undefined);
        await queryRunner.query(`ALTER TABLE "encounter" DROP COLUMN "data"`, undefined);
    }

}
