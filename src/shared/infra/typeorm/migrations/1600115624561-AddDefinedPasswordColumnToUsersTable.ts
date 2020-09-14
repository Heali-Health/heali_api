import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddDefinedPasswordColumnToUsersTable1600115624561 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'defined_password',
          type: 'boolean',
          isNullable: false,
          isUnique: false,
          default: true,
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn('users', 'defined_password');
    }

}
