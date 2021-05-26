import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterStatementsTableAddSender1622023788944 implements MigrationInterface {
  private senderIdColumn: TableColumn;

  constructor(){
    this.senderIdColumn = new TableColumn({
      name: "sender_id",
      type: "uuid",
      isNullable: true
    });
  }

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn("statements", this.senderIdColumn);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn("statements", this.senderIdColumn);
    }

}
