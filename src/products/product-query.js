import { nanoid } from "nanoid";
import database from "../db/index.js";
import { config } from "dotenv";

config();

const createProduct = async ({
  product_name,
  product_description,
  product_category,
  product_weight,
  product_price,
}) => {
  const product_id = "PD" + nanoid(4);
  const stock_quantity = 0;
  const stock_updated_at = new Date().toISOString();
  const query = `
        INSERT INTO
            products (product_id, product_name, product_description, product_category, product_weight, product_price, stock_quantity, stock_updated_at)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    ;`;

  const res = await database.query(query, [
    product_id,
    product_name,
    product_description,
    product_category,
    product_weight,
    +product_price,
    +stock_quantity,
    stock_updated_at,
  ]);

  return res.rows[0];
};

const findAllProducts = async () => {
  const query = `
        SELECT * FROM
            products
        ORDER BY product_name ASC 
    ;`;

  const res = await database.query(query);

  //console.log(res.rows);
  return res.rows;
};

const findProductDetail = async ({ product_id }) => {
  const query = `
          SELECT * FROM
              products
          WHERE
            product_id = $1
      ;`;

  const res = await database.query(query, [product_id]);

  //console.log(res.rows);
  return res.rows[0];
};

const updateProduct = async ({
  product_id,
  product_name,
  product_description,
  product_category,
  product_weight,
  product_price,
}) => {
  const query = `
        UPDATE
            products
        SET
            product_name = $2,
            product_description = $3,
            product_category = $4,
            product_weight = $5,
            product_price = $6
        WHERE
            product_id = $1
        RETURNING *
      ;`;

  const res = await database.query(query, [
    product_id,
    product_name,
    product_description,
    product_category,
    product_weight,
    product_price,
  ]);

  return res.rows[0];
};

const findAllProductsDropdown = async () => {
  const query = `
          SELECT product_name AS label, product_id AS value FROM
              products
          ORDER BY product_name ASC 
      ;`;

  const res = await database.query(query);

  //console.log(res.rows);
  return res.rows;
};

const updateStock = async (product_id, type, value) => {
  const stock_updated_at = new Date().toISOString();
  const query = `
          UPDATE
              products
          SET
              stock_quantity = stock_quantity ${type} ${value},
              stock_updated_at = $2
          WHERE
              product_id = $1
          RETURNING *
        ;`;

  const res = await database.query(query, [product_id, stock_updated_at]);

  //console.log(res.rows[0]);
  return res.rows[0];
};

const deleteProduct = async ({ product_id }) => {
  const query = `
            DELETE FROM
                products
            WHERE
              product_id = $1
            RETURNING *
        ;`;

  const res = await database.query(query, [product_id]);

  //console.log(res.rows);
  return res.rows[0];
};

export {
  createProduct,
  findAllProducts,
  findProductDetail,
  updateProduct,
  findAllProductsDropdown,
  updateStock,
  deleteProduct,
};
