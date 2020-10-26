import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddRelationshipColumnToPatients1603745839109
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'patients',
      new TableColumn({
        name: 'relationship',
        type: 'varchar',
        isNullable: true,
        isGenerated: false,
        isUnique: false,
        isPrimary: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('patients', 'relationship');
  }
}
