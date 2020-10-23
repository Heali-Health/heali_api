import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddSexAndBirthDateColumnsToPatients1603488040470
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'patients',
      new TableColumn({
        name: 'sex',
        type: 'varchar',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );

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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('patients', 'birth_date');

    await queryRunner.dropColumn('patients', 'date');
  }
}
