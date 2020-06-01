import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateOriginalExamsTable1588367800108
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'original_exams',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
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
            name: 'exam_original_id',
            type: 'varchar',
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
      'original_exams',
      new TableForeignKey({
        name: 'OfficialExam',
        columnNames: ['exam_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'exams',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'original_exams',
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
    await queryRunner.dropForeignKey('original_exams', 'CorrespondentLab');

    await queryRunner.dropForeignKey('original_exams', 'OfficialExam');

    await queryRunner.dropTable('original_exams');
  }
}
