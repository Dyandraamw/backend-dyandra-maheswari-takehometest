import database from "..";
import { addForeignKeys, createOrderItemsTable, createOrdersTable, createProductsTable, createPurchaseItemsTable, createPurchasesTable, createUsersTable } from "./create_tables";

const MigrateDB = async () => {
  const connection = await database.connect();

  try {
    await connection.query("BEGIN");
    await connection.query(createUsersTable);
    await connection.query(createProductsTable);
    await connection.query(createOrderItemsTable);
    await connection.query(createOrdersTable);
    await connection.query(createPurchaseItemsTable);
    await connection.query(createPurchasesTable);
    await connection.query(addForeignKeys);

    await connection.query("COMMIT");
  } catch (error) {
    await connection.query("ROLLBACK");
    console.log(error);
  }
};

export { MigrateDB };
