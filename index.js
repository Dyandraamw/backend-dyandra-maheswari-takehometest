// const express = require("express");
import express, { json } from "express";
import { config } from "dotenv";
import { MigrateDB } from "./src/db/migrations/index.js";
import userRouter from "./src/users/user-router.js";
import productRouter from "./src/products/product-router.js";
import purchaseRouter from "./src/purchases/purchase-router.js";
import orderRouter from "./src/orders/order-router.js";
import authToken from "./src/middlewares/authToken.js";
// import migrateDB from "./src/db/migrations/index.js";

const app = express();
config();
const PORT = 4000;

async function runServer() {
  await MigrateDB();
  app.use(json());
  app.use("/", userRouter);
  app.use("/products", authToken, productRouter);
  app.use("/purchases", authToken, purchaseRouter);
  app.use("/orders", authToken, orderRouter);

  app.get("/test", async (req, res) => {
    
      return res
        .status(201)
        .json({ message: "test run app" });
  
    
  });

  app.listen(PORT, (error) => {
    if (!error) {
      console.log(
        "Server is Successfully Running,  and App is listening on port " + PORT
      );
    } else {
      console.log("Error occurred, server can't start", error);
    }
  });
}

runServer();
