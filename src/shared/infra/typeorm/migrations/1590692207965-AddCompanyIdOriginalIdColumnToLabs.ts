import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddCompanyIdOriginalIdColumnToLabs1590692207965
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'labs',
      new TableColumn({
        name: 'company_id_original_id',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('labs', 'company_id_original_id');
  }
}
