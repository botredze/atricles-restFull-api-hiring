import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class CreateArticleAndUserTables1612345678901 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "article",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "title", type: "varchar" },
                { name: "description", type: "varchar", isNullable: true },
                { name: "content", type: "text" },
                { name: "publicationDate", type: "timestamp", default: "CURRENT_TIMESTAMP" }
            ]
        }), true);

        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "email", type: "varchar" },
                { name: "password", type: "varchar" }
            ]
        }), true);

        await queryRunner.addColumn("article", new TableColumn({
            name: "authorId",
            type: "int"
        }));

        await queryRunner.createForeignKey("article", new TableForeignKey({
            columnNames: ["authorId"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const articleTable = await queryRunner.getTable("article");
        const foreignKey = articleTable.foreignKeys.find(fk => fk.columnNames.indexOf("authorId") !== -1);
        await queryRunner.dropForeignKey("article", foreignKey);

        await queryRunner.dropTable("article");

        await queryRunner.dropTable("user");
    }

}
