import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class ModifyBirthDateColumn1603726121484
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('patients', 'birth_date');

    await queryRunner.addColumn(
      'patients',
      new TableColumn({
        name: 'birth_date',
        type: 'timestamp with time zone',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'patients',
      new TableColumn({
        name: 'birth_date',
        type: 'date',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );

    await queryRunner.dropColumn('patients', 'birth_date');
  }
}
