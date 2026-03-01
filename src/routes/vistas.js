import express from "express";
import ProductManager from "../managers/ProductManager.js";

const router = express.Router();
const manager = new ProductManager("./src/data/products.json");

router.get("/producto", (req, res) => {
  res.render("producto", { mensaje: "Listado de productos" });
});

router.get("/home", async (req, res) => {
  const products = await manager.getProducts();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await manager.getProducts();
  res.render("realTimeProducts", { products });
});

export default router;
