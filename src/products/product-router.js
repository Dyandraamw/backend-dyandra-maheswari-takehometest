import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  findAllProducts,
  findAllProductsDropdown,
  findProductDetail,
  updateProduct,
} from "./product-query";

const router = Router();

router.post("/", async (req, res) => {
  const {
    product_name,
    product_description,
    product_category,
    product_weight,
    product_price,
  } = req.body;

  try {
    const data = await createProduct({
      product_name,
      product_description,
      product_category,
      product_weight,
      product_price,
    });
    return res
      .status(201)
      .json({ message: "Sucessfully created product", data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create product: " + error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await findAllProducts();
    return res
      .status(201)
      .json({ message: "Sucessfully fetched products", data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch products: " + error.message });
  }
});

router.get("/detail/:product_id", async (req, res) => {
  const { product_id } = req.params;
  try {
    const data = await findProductDetail({ product_id });
    return res
      .status(201)
      .json({ message: "Sucessfully fetched product", data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch product: " + error.message });
  }
});

router.put("/detail/:product_id", async (req, res) => {
  const { user_type } = req.userData;

  if (user_type != "admin") {
    return res.status(401).json({ message: "Only admin is allowed to edit!" });
  }

  const { product_id } = req.params;
  const {
    product_name,
    product_description,
    product_category,
    product_weight,
    product_price,
  } = req.body;
  try {
    const data = await updateProduct({
      product_id,
      product_name,
      product_description,
      product_category,
      product_weight,
      product_price,
    });
    return res
      .status(201)
      .json({ message: "Sucessfully updated product", data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update product: " + error.message });
  }
});

router.get("/dropdown", async (req, res) => {
  try {
    const data = await findAllProductsDropdown();
    return res
      .status(201)
      .json({ message: "Sucessfully fetched products dropdown", data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch products dropdown: " + error.message });
  }
});

router.delete("/detail/:product_id", async (req, res) => {
  const { user_type } = req.userData;

  if (user_type != "admin") {
    return res
      .status(401)
      .json({ message: "Only admin is allowed to delete!" });
  }

  const { product_id } = req.params;
  try {
    const data = await deleteProduct({ product_id });
    return res
      .status(201)
      .json({ message: "Sucessfully deleted product", data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete product: " + error.message });
  }
});

export default router;
