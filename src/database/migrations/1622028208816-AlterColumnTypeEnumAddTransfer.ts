import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterColumnTypeEnumAddTransfer1622028208816 implements MigrationInterface {
  private newTypeEnum: TableColumn;
  private oldTypeEnum: TableColumn;

  constructor(){
    this.newTypeEnum = new TableColumn({
      name: 'type',
      type: 'enum',
      enum: ['deposit', 'withdraw', 'transfers']
    });
    this.oldTypeEnum = new TableColumn({
      name: 'type',
      type: 'enum',
      enum: ['deposit', 'withdraw']
    })
  }

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.changeColumn("statements","type",this.newTypeEnum);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.changeColumn("statements", "type", this.oldTypeEnum);
    }

}
