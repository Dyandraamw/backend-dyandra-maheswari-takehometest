import { Router } from "express";

import {
  createPurchase,
  createPurchaseItems,
  findAllPurchase,
  findPurchaseDetail,
  findPurchaseItemsDetail,
} from "./purchase-query";

const router = Router();

router.post("/", async (req, res) => {
  const {
    supplier_name,
    supplier_address,
    discount,
    shipping_fee,
    purchase_items,
  } = req.body;

  //create purchases

  try {
    const purchase = await createPurchase({
      supplier_name,
      supplier_address,
      discount,
      shipping_fee,
    });

    const getpurchase_items = await createPurchaseItems({
      purchase_items,
      purchase_id: purchase.purchase_id,
    });

    const data = {
      purchase,
      purchase_items: getpurchase_items,
    };

    return res
      .status(201)
      .json({ message: "Sucessfully created purchase", data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create purchase: " + error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await findAllPurchase();

    return res
      .status(201)
      .json({ message: "Sucessfully fetched purchases", data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch purchases: " + error.message });
  }
});

router.get("/detail/:purchase_id", async (req, res) => {
  const { purchase_id } = req.params;
  console.log(purchase_id);
  try {
    const purchase = await findPurchaseDetail({ purchase_id });
    const purchase_items = await findPurchaseItemsDetail({ purchase_id });
    const data = {
      purchase,
      purchase_items: purchase_items,
    };
    return res
      .status(201)
      .json({ message: "Sucessfully fetched purchase", data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch purchase: " + error.message });
  }
});

export default router;
