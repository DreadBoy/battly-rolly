import {MigrationInterface, QueryRunner} from "typeorm";

export class InitSetup1583481379727 implements MigrationInterface {
    name = 'InitSetup1583481379727'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "reference" character varying NOT NULL, "encounterId" uuid, CONSTRAINT "PK_50a7741b415bc585fcf9c984332" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "encounter" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_1cf9e15e693ff9f0ef9b9061372" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "campaign" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_0ce34d26e7f2eb316a3a592cdc4" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "entity" ADD CONSTRAINT "FK_d7c2dd2ca5cd4e6498ddd63d8b4" FOREIGN KEY ("encounterId") REFERENCES "encounter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "entity" DROP CONSTRAINT "FK_d7c2dd2ca5cd4e6498ddd63d8b4"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "campaign"`, undefined);
        await queryRunner.query(`DROP TABLE "encounter"`, undefined);
        await queryRunner.query(`DROP TABLE "entity"`, undefined);
    }

}
