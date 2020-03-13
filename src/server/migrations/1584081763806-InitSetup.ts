import {MigrationInterface, QueryRunner} from "typeorm";

export class InitSetup1584081763806 implements MigrationInterface {
    name = 'InitSetup1584081763806'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "encounter" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data" character varying NOT NULL, "active" boolean NOT NULL, "campaignId" uuid, CONSTRAINT "PK_1cf9e15e693ff9f0ef9b9061372" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "campaign" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gmId" uuid, CONSTRAINT "PK_0ce34d26e7f2eb316a3a592cdc4" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "campaign_users_user" ("campaignId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_e431613f8ad75d5db01f3672813" PRIMARY KEY ("campaignId", "userId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_ae23d87c34a64f365f4e0f33aa" ON "campaign_users_user" ("campaignId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_db5c30fd8fcfbcda6f2e2a167c" ON "campaign_users_user" ("userId") `, undefined);
        await queryRunner.query(`ALTER TABLE "encounter" ADD CONSTRAINT "FK_63d566c5f8681a6b575e61ca59b" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "FK_5b8c97c2ba1944a2fa9abe3ec7a" FOREIGN KEY ("gmId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "campaign_users_user" ADD CONSTRAINT "FK_ae23d87c34a64f365f4e0f33aa2" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "campaign_users_user" ADD CONSTRAINT "FK_db5c30fd8fcfbcda6f2e2a167cf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "campaign_users_user" DROP CONSTRAINT "FK_db5c30fd8fcfbcda6f2e2a167cf"`, undefined);
        await queryRunner.query(`ALTER TABLE "campaign_users_user" DROP CONSTRAINT "FK_ae23d87c34a64f365f4e0f33aa2"`, undefined);
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_5b8c97c2ba1944a2fa9abe3ec7a"`, undefined);
        await queryRunner.query(`ALTER TABLE "encounter" DROP CONSTRAINT "FK_63d566c5f8681a6b575e61ca59b"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_db5c30fd8fcfbcda6f2e2a167c"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_ae23d87c34a64f365f4e0f33aa"`, undefined);
        await queryRunner.query(`DROP TABLE "campaign_users_user"`, undefined);
        await queryRunner.query(`DROP TABLE "campaign"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "encounter"`, undefined);
    }

}
