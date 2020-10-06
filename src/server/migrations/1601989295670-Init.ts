import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1601989295670 implements MigrationInterface {
    name = 'Init1601989295670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reactive_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c09470c5c1667db732d3934dee8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "name" character varying NOT NULL, "stage" character varying NOT NULL, "attack" integer, "nat20" boolean, "DC" integer, "stat" character varying, "success" text NOT NULL, "throw" text NOT NULL, "damageSuccess" integer, "damageFailure" integer, "damageType" character varying, "status" character varying, "confirmed" text NOT NULL, "encounterId" uuid, CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "feature" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying, "AC" integer NOT NULL, "HP" integer NOT NULL, "initialHP" integer NOT NULL, "monsterId" uuid, "playerId" uuid, "encounterId" uuid, CONSTRAINT "PK_03930932f909ca4be8e33d16a2d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "encounter" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT false, "name" character varying NOT NULL, "campaignId" uuid, CONSTRAINT "PK_1cf9e15e693ff9f0ef9b9061372" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "campaign" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "gmId" uuid, CONSTRAINT "PK_0ce34d26e7f2eb316a3a592cdc4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "displayName" character varying NOT NULL, "password" character varying NOT NULL, "confirmEmail" text, "changeEmail" text, "resetPassword" text, "invalidate" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "monster" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "HP" text NOT NULL, "AC" integer NOT NULL, "abilitySet" text NOT NULL, "savingThrows" text NOT NULL, "ownerId" uuid, CONSTRAINT "PK_9d95b6eedf1fbbea6b329b91f81" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "action" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" character varying NOT NULL, "modifier" integer, "DC" integer, "ability" character varying, "damage" text, "takeHalfOnFailure" boolean NOT NULL DEFAULT false, "status" character varying, "monsterId" uuid, CONSTRAINT "PK_2d9db9cf5edfbbae74eb56e3a39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "log_source_feature" ("logId" uuid NOT NULL, "featureId" uuid NOT NULL, CONSTRAINT "PK_2caaa448b0ff8210ae2ae4921d4" PRIMARY KEY ("logId", "featureId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_389ba8cbac01dfa4fdcb115a24" ON "log_source_feature" ("logId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ed2893f138c2027d4ec8cdec65" ON "log_source_feature" ("featureId") `);
        await queryRunner.query(`CREATE TABLE "log_target_feature" ("logId" uuid NOT NULL, "featureId" uuid NOT NULL, CONSTRAINT "PK_057e2d9e85bb2b93e2919f881bc" PRIMARY KEY ("logId", "featureId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2e182bf2bbbffa81e3c2949516" ON "log_target_feature" ("logId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f233b5028e642b331c4741a63e" ON "log_target_feature" ("featureId") `);
        await queryRunner.query(`CREATE TABLE "campaign_users_user" ("campaignId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_e431613f8ad75d5db01f3672813" PRIMARY KEY ("campaignId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ae23d87c34a64f365f4e0f33aa" ON "campaign_users_user" ("campaignId") `);
        await queryRunner.query(`CREATE INDEX "IDX_db5c30fd8fcfbcda6f2e2a167c" ON "campaign_users_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "user_subscribed_monsters_monster" ("userId" uuid NOT NULL, "monsterId" uuid NOT NULL, CONSTRAINT "PK_fce9600146e22e3d9f17802b5a5" PRIMARY KEY ("userId", "monsterId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9594b5eb7705f05ffc01996301" ON "user_subscribed_monsters_monster" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_54c93dc3f1eb3f94729bab1960" ON "user_subscribed_monsters_monster" ("monsterId") `);
        await queryRunner.query(`ALTER TABLE "log" ADD CONSTRAINT "FK_79f2dba1f4a858f0c89ae9a4526" FOREIGN KEY ("encounterId") REFERENCES "encounter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feature" ADD CONSTRAINT "FK_29be1dce4694518a8c159f0cb6d" FOREIGN KEY ("monsterId") REFERENCES "monster"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feature" ADD CONSTRAINT "FK_4aee5fcbc25be42cbed2b723bf4" FOREIGN KEY ("playerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feature" ADD CONSTRAINT "FK_d1bc4896fd217e03df693033eb3" FOREIGN KEY ("encounterId") REFERENCES "encounter"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "encounter" ADD CONSTRAINT "FK_63d566c5f8681a6b575e61ca59b" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign" ADD CONSTRAINT "FK_5b8c97c2ba1944a2fa9abe3ec7a" FOREIGN KEY ("gmId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "monster" ADD CONSTRAINT "FK_817a9f427cf563fc4acc1f5f473" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "action" ADD CONSTRAINT "FK_b49e388b3e58854b2795376c65d" FOREIGN KEY ("monsterId") REFERENCES "monster"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "log_source_feature" ADD CONSTRAINT "FK_389ba8cbac01dfa4fdcb115a24c" FOREIGN KEY ("logId") REFERENCES "log"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "log_source_feature" ADD CONSTRAINT "FK_ed2893f138c2027d4ec8cdec65a" FOREIGN KEY ("featureId") REFERENCES "feature"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "log_target_feature" ADD CONSTRAINT "FK_2e182bf2bbbffa81e3c2949516a" FOREIGN KEY ("logId") REFERENCES "log"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "log_target_feature" ADD CONSTRAINT "FK_f233b5028e642b331c4741a63eb" FOREIGN KEY ("featureId") REFERENCES "feature"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign_users_user" ADD CONSTRAINT "FK_ae23d87c34a64f365f4e0f33aa2" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "campaign_users_user" ADD CONSTRAINT "FK_db5c30fd8fcfbcda6f2e2a167cf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscribed_monsters_monster" ADD CONSTRAINT "FK_9594b5eb7705f05ffc01996301d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_subscribed_monsters_monster" ADD CONSTRAINT "FK_54c93dc3f1eb3f94729bab19607" FOREIGN KEY ("monsterId") REFERENCES "monster"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_subscribed_monsters_monster" DROP CONSTRAINT "FK_54c93dc3f1eb3f94729bab19607"`);
        await queryRunner.query(`ALTER TABLE "user_subscribed_monsters_monster" DROP CONSTRAINT "FK_9594b5eb7705f05ffc01996301d"`);
        await queryRunner.query(`ALTER TABLE "campaign_users_user" DROP CONSTRAINT "FK_db5c30fd8fcfbcda6f2e2a167cf"`);
        await queryRunner.query(`ALTER TABLE "campaign_users_user" DROP CONSTRAINT "FK_ae23d87c34a64f365f4e0f33aa2"`);
        await queryRunner.query(`ALTER TABLE "log_target_feature" DROP CONSTRAINT "FK_f233b5028e642b331c4741a63eb"`);
        await queryRunner.query(`ALTER TABLE "log_target_feature" DROP CONSTRAINT "FK_2e182bf2bbbffa81e3c2949516a"`);
        await queryRunner.query(`ALTER TABLE "log_source_feature" DROP CONSTRAINT "FK_ed2893f138c2027d4ec8cdec65a"`);
        await queryRunner.query(`ALTER TABLE "log_source_feature" DROP CONSTRAINT "FK_389ba8cbac01dfa4fdcb115a24c"`);
        await queryRunner.query(`ALTER TABLE "action" DROP CONSTRAINT "FK_b49e388b3e58854b2795376c65d"`);
        await queryRunner.query(`ALTER TABLE "monster" DROP CONSTRAINT "FK_817a9f427cf563fc4acc1f5f473"`);
        await queryRunner.query(`ALTER TABLE "campaign" DROP CONSTRAINT "FK_5b8c97c2ba1944a2fa9abe3ec7a"`);
        await queryRunner.query(`ALTER TABLE "encounter" DROP CONSTRAINT "FK_63d566c5f8681a6b575e61ca59b"`);
        await queryRunner.query(`ALTER TABLE "feature" DROP CONSTRAINT "FK_d1bc4896fd217e03df693033eb3"`);
        await queryRunner.query(`ALTER TABLE "feature" DROP CONSTRAINT "FK_4aee5fcbc25be42cbed2b723bf4"`);
        await queryRunner.query(`ALTER TABLE "feature" DROP CONSTRAINT "FK_29be1dce4694518a8c159f0cb6d"`);
        await queryRunner.query(`ALTER TABLE "log" DROP CONSTRAINT "FK_79f2dba1f4a858f0c89ae9a4526"`);
        await queryRunner.query(`DROP INDEX "IDX_54c93dc3f1eb3f94729bab1960"`);
        await queryRunner.query(`DROP INDEX "IDX_9594b5eb7705f05ffc01996301"`);
        await queryRunner.query(`DROP TABLE "user_subscribed_monsters_monster"`);
        await queryRunner.query(`DROP INDEX "IDX_db5c30fd8fcfbcda6f2e2a167c"`);
        await queryRunner.query(`DROP INDEX "IDX_ae23d87c34a64f365f4e0f33aa"`);
        await queryRunner.query(`DROP TABLE "campaign_users_user"`);
        await queryRunner.query(`DROP INDEX "IDX_f233b5028e642b331c4741a63e"`);
        await queryRunner.query(`DROP INDEX "IDX_2e182bf2bbbffa81e3c2949516"`);
        await queryRunner.query(`DROP TABLE "log_target_feature"`);
        await queryRunner.query(`DROP INDEX "IDX_ed2893f138c2027d4ec8cdec65"`);
        await queryRunner.query(`DROP INDEX "IDX_389ba8cbac01dfa4fdcb115a24"`);
        await queryRunner.query(`DROP TABLE "log_source_feature"`);
        await queryRunner.query(`DROP TABLE "action"`);
        await queryRunner.query(`DROP TABLE "monster"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "campaign"`);
        await queryRunner.query(`DROP TABLE "encounter"`);
        await queryRunner.query(`DROP TABLE "feature"`);
        await queryRunner.query(`DROP TABLE "log"`);
        await queryRunner.query(`DROP TABLE "reactive_entity"`);
    }

}
