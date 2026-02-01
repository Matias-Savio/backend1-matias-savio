import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const managers = new ProductManager("../data/products.json");

router.get("/", async (req, res) => {
  res.json(await managers.getProducts());
});

router.get("/producto", async (req, res) => {
  res.json(await managers.getProducts());
});

router.get("/producto/:id", async (req, res) => {
  const id = req.params.id;
  const producto = await managers
    .getProducts()
    .then((products) => products.find((item) => item.id == id));
  res.json(producto);
});

router.post("/producto", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;
  const nuevoProducto = {
    id: productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };
  productos.push(nuevoProducto);
  res.json(nuevoProducto);
});

router.put("/producto/:id", async (req, res) => {
  const id = req.params.id;
  const index = managers.getProducts().findIndex((item) => item.id == id);
  if (index !== -1) {
    const eliminado = managers.getProducts().splice(index, 1);
    managers.saveProducts();
    res.json(eliminado[0]);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

router.delete("/producto/:id", async (req, res) => {
  await managers.deleteProduct(Number(req.params.id));
  res.send("Producto eliminado");
});

export default router;
