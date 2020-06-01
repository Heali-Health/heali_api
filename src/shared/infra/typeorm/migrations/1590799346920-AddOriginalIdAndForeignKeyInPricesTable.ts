import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddOriginalIdAndForeignKeyInPricesTable1590799346920
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'prices',
      new TableColumn({
        name: 'original_exam_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'prices',
      new TableForeignKey({
        name: 'PriceOriginalId',
        columnNames: ['original_exam_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'prices',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('prices', 'PriceOriginalId');

    await queryRunner.dropColumn('prices', 'original_exam_id');
  }
}
