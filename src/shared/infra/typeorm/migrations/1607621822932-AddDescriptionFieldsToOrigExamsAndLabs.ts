import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddDescriptionFieldsToOrigExamsAndLabs1607621822932
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'labs',
      new TableColumn({
        name: 'how_to_get',
        type: 'varchar',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );

    await queryRunner.addColumn(
      'labs',
      new TableColumn({
        name: 'technician_responsible',
        type: 'varchar',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );

    await queryRunner.addColumn(
      'labs',
      new TableColumn({
        name: 'is_open',
        type: 'boolean',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );

    await queryRunner.addColumn(
      'original_exams',
      new TableColumn({
        name: 'description',
        type: 'varchar',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );

    await queryRunner.addColumn(
      'original_exams',
      new TableColumn({
        name: 'preparation',
        type: 'varchar',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );

    await queryRunner.addColumn(
      'original_exams',
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
      'original_exams',
      new TableColumn({
        name: 'min_age',
        type: 'smallint',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );

    await queryRunner.addColumn(
      'original_exams',
      new TableColumn({
        name: 'max_age',
        type: 'smallint',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );

    await queryRunner.addColumn(
      'original_exams',
      new TableColumn({
        name: 'days_to_results',
        type: 'smallint',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );

    await queryRunner.addColumn(
      'original_exams',
      new TableColumn({
        name: 'lab_min_price',
        type: 'real',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );

    await queryRunner.addColumn(
      'original_exams',
      new TableColumn({
        name: 'lab_min_price_max_installments',
        type: 'real',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );

    await queryRunner.addColumn(
      'original_exams',
      new TableColumn({
        name: 'lab_max_price',
        type: 'real',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );

    await queryRunner.addColumn(
      'original_exams',
      new TableColumn({
        name: 'lab_max_price_max_installments',
        type: 'real',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'original_exams',
      'lab_max_price_max_installments',
    );
    await queryRunner.dropColumn('original_exams', 'lab_max_price');
    await queryRunner.dropColumn(
      'original_exams',
      'lab_min_price_max_installments',
    );
    await queryRunner.dropColumn('original_exams', 'lab_min_price');
    await queryRunner.dropColumn('original_exams', 'days_to_results');
    await queryRunner.dropColumn('original_exams', 'max_age');
    await queryRunner.dropColumn('original_exams', 'min_age');
    await queryRunner.dropColumn('original_exams', 'sex');
    await queryRunner.dropColumn('original_exams', 'preparation');
    await queryRunner.dropColumn('original_exams', 'description');

    await queryRunner.dropColumn('labs', 'is_open');
    await queryRunner.dropColumn('labs', 'technician_responsible');
    await queryRunner.dropColumn('labs', 'how_to_get');
  }
}
