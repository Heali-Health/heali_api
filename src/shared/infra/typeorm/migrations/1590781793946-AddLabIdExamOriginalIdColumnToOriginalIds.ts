import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddLabIdExamOriginalIdColumnToOriginalIds1590781793946
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'original_exams',
      new TableColumn({
        name: 'lab_id_exam_original_id',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('original_exams', 'lab_id_exam_original_id');
  }
}
