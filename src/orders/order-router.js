import { Router } from "express";

import {
  createOrder,
  createOrderItems,
  findAllOrder,
  findOrderDetail,
  findOrderItemsDetail,
} from "./order-query.js";

const router = Router();

router.post("/", async (req, res) => {
  const {
    customer_name,
    customer_address,
    discount,
    shipping_fee,
    order_items,
  } = req.body;

  //create orders

  try {
    const order = await createOrder({
      customer_name,
      customer_address,
      discount,
      shipping_fee,
    });

    const getorder_items = await createOrderItems({
      order_items,
      order_id: order.order_id,
    });

    const data = {
      order,
      order_items: getorder_items,
    };

    return res.status(201).json({ message: "Sucessfully created order", data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create order: " + error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await findAllOrder();

    return res
      .status(201)
      .json({ message: "Sucessfully fetched orders", data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch orders: " + error.message });
  }
});

router.get("/detail/:order_id", async (req, res) => {
  const { order_id } = req.params;
  console.log(order_id);
  try {
    const order = await findOrderDetail({ order_id });
    const order_items = await findOrderItemsDetail({ order_id });
    let total_gross = 0.0;
    order_items.forEach((item) => {
      total_gross += parseFloat(item.total_per_item);
    });

    const total_nett = total_gross + parseFloat(order.shipping_fee) - parseFloat(order.discount);
    const data = {
      order,
      order_items: order_items,
      total_gross: total_gross,
      total_nett: total_nett,
    };
    return res.status(201).json({ message: "Sucessfully fetched order", data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch order: " + error.message });
  }
});

export default router;
