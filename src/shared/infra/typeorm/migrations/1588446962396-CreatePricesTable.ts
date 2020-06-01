import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreatePricesTable1588446962396
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'prices',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'exam_id',
            type: 'uuid',
          },
          {
            name: 'lab_id',
            type: 'uuid',
          },
          {
            name: 'price',
            type: 'real',
          },
          {
            name: 'created_date',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_date',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'prices',
      new TableForeignKey({
        name: 'CorrespondentExam',
        columnNames: ['exam_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'exams',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'prices',
      new TableForeignKey({
        name: 'CorrespondentLab',
        columnNames: ['lab_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'labs',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('prices', 'CorrespondentLab');

    await queryRunner.dropForeignKey('prices', 'CorrespondentExam');

    await queryRunner.dropTable('prices');
  }
}
