import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddLabIdExamOriginalIdColumnToPrices1591056682444
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'prices',
      new TableColumn({
        name: 'lab_id_exam_original_id',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('prices', 'lab_id_exam_original_id');
  }
}
