import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class TransformExamIdNullableInOriginalExamsTable1590775630272
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'original_exams',
      'exam_id',
      new TableColumn({
        name: 'exam_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'original_exams',
      new TableColumn({
        name: 'exam_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'exam_id',
        type: 'uuid',
        isNullable: false,
      }),
    );
  }
}
