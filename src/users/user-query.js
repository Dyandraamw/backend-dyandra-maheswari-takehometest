import { nanoid } from "nanoid";
import database from "../db";
import { hashSync } from "bcrypt";
import { config } from "dotenv";

config();

const createUser = async ({ name, email, password, user_type }) => {
  const user_id = "US" + nanoid(4);
  const hashedPassword = hashSync(password, parseInt(process.env.SALT));
  const query = `
        INSERT INTO
            users (user_id, name, email, password, user_type)
        VALUES
            ($1, $2, $3, $4, $5)
        RETURNING *
    ;`;

  const res = await database.query(query, [
    user_id,
    name,
    email,
    hashedPassword,
    user_type,
  ]);

  return res.rows[0];
};

const findUser = async ({ email }) => {
  const query = `
        SELECT * FROM
            users
        WHERE
            email = $1
    ;`;

  const res = await database.query(query, [email]);

  return res.rows[0];
};

export { createUser,findUser };
