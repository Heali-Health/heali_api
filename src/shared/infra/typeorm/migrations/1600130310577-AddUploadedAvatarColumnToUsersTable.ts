import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddUploadedAvatarColumnToUsersTable1600130310577 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'uploaded_avatar',
          type: 'boolean',
          isUnique: false,
          isNullable: true,
          default: false,
        }),
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn('users', 'uploaded_avatar');
    }

}
