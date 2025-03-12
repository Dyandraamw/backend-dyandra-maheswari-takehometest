import { nanoid } from "nanoid";
import database from "../db";
import { config } from "dotenv";
import { updateStock } from "../products/product-query";

config();

const createOrder = async ({
  customer_name,
  customer_address,
  discount,
  shipping_fee,
}) => {
  const order_id = "OD" + nanoid(4);

  const order_date = new Date().toISOString();
  const query = `
        INSERT INTO
            orders (order_id, customer_name, customer_address, discount, shipping_fee,order_date)
        VALUES
            ($1, $2, $3, $4, $5, $6)
        RETURNING *
    ;`;

  const res = await database.query(query, [
    order_id,
    customer_name,
    customer_address,
    discount,
    shipping_fee,
    order_date,
  ]);

  return res.rows[0];
};

const createOrderItems = async ({ order_items, order_id }) => {
  let bulkInsert = "";
  const len = order_items.length;

  order_items.forEach((el, idx) => {
    const order_item_id = "PI" + nanoid(4);
    const current = `('${order_item_id}', '${order_id}', '${el.product_id}', '${el.item_quantity}')`;
    let connector = idx != len - 1 ? "," : " ";

    bulkInsert = bulkInsert + current + connector;

    updateStock(el.product_id, "-", el.item_quantity);
  });

  //   console.log(bulkInsert);
  const query = `
          INSERT INTO
              order_items (order_item_id, order_id, product_id, item_quantity)
          VALUES
              ${bulkInsert}
          RETURNING *
      ;`;

  const res = await database.query(query);

  return res.rows;
};

const findAllOrder = async () => {
  const query = `
          SELECT * FROM
              orders
          ORDER BY order_date ASC 
      ;`;

  const res = await database.query(query);

  //console.log(res.rows);
  return res.rows;
};

const findOrderDetail = async ({ order_id }) => {
  const query = `
            SELECT * FROM
                orders
            WHERE
              order_id = $1
        ;`;

  const res = await database.query(query, [order_id]);

  //console.log(res.rows);
  return res.rows[0];
};

const findOrderItemsDetail = async ({ order_id }) => {
  const query = `
            SELECT * FROM order_items
                 JOIN products ON products.product_id = order_items.product_id
            WHERE order_id = $1
            ORDER BY order_item_id ASC 
          ;`;

  const res = await database.query(query, [order_id]);

  //console.log(res.rows);
  return res.rows;
};

export {
  createOrder,
  createOrderItems,
  findAllOrder,
  findOrderDetail,
  findOrderItemsDetail,
};
