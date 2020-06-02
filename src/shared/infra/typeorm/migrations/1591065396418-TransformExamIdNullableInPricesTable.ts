import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class TransformExamIdNullableInPricesTable1591065396418
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'prices',
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
      'prices',
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
