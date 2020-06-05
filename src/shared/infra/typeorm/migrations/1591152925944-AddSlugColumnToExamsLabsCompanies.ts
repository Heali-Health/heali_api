import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddSlugColumnToExamsLabsCompanies1591152925944
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'exams',
      new TableColumn({
        name: 'slug',
        type: 'varchar',
        isNullable: true,
        isUnique: true,
      }),
    );

    await queryRunner.addColumn(
      'labs',
      new TableColumn({
        name: 'slug',
        type: 'varchar',
        isNullable: true,
        isUnique: true,
      }),
    );

    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'slug',
        type: 'varchar',
        isNullable: true,
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('companies', 'slug');

    await queryRunner.dropColumn('labs', 'slug');

    await queryRunner.dropColumn('exams', 'slug');
  }
}
