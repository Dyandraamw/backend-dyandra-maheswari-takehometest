import { nanoid } from "nanoid";
import database from "../db";
import { config } from "dotenv";
import { updateStock } from "../products/product-query";

config();

const createPurchase = async ({
  supplier_name,
  supplier_address,
  discount,
  shipping_fee,
}) => {
  const purchase_id = "PC" + nanoid(4);

  const purchase_date = new Date().toISOString();
  const query = `
        INSERT INTO
            purchases (purchase_id, supplier_name, supplier_address, discount, shipping_fee,purchase_date)
        VALUES
            ($1, $2, $3, $4, $5, $6)
        RETURNING *
    ;`;

  const res = await database.query(query, [
    purchase_id,
    supplier_name,
    supplier_address,
    discount,
    shipping_fee,
    purchase_date,
  ]);

  return res.rows[0];
};

const createPurchaseItems = async ({ purchase_items, purchase_id }) => {
  let bulkInsert = "";
  const len = purchase_items.length;

  purchase_items.forEach((el, idx) => {
    const purchase_item_id = "PI" + nanoid(4);
    const current = `('${purchase_item_id}', '${purchase_id}', '${el.product_id}', '${el.item_quantity}')`;
    let connector = idx != len - 1 ? "," : " ";

    bulkInsert = bulkInsert + current + connector;

    updateStock(el.product_id, "+", el.item_quantity);
  });

  //   console.log(bulkInsert);
  const query = `
          INSERT INTO
              purchase_items (purchase_item_id, purchase_id, product_id, item_quantity)
          VALUES
              ${bulkInsert}
          RETURNING *
      ;`;

  const res = await database.query(query);

  return res.rows;
};

const findAllPurchase = async () => {
  const query = `
          SELECT * FROM
              purchases
          ORDER BY purchase_date ASC 
      ;`;

  const res = await database.query(query);

  //console.log(res.rows);
  return res.rows;
};

const findPurchaseDetail = async ({ purchase_id }) => {
  const query = `
            SELECT * FROM
                purchases
            WHERE
              purchase_id = $1
        ;`;

  const res = await database.query(query, [purchase_id]);

  //console.log(res.rows);
  return res.rows[0];
};

const findPurchaseItemsDetail = async ({ purchase_id }) => {
  const query = `
            SELECT * FROM purchase_items
                 JOIN products ON products.product_id = purchase_items.product_id
            WHERE purchase_id = $1
            ORDER BY purchase_item_id ASC 
          ;`;

  const res = await database.query(query, [purchase_id]);

  //console.log(res.rows);
  return res.rows;
};

export {
  createPurchase,
  createPurchaseItems,
  findAllPurchase,
  findPurchaseDetail,
  findPurchaseItemsDetail,
};
