import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const manager = new CartManager("./src/data/carts.json");

router.post("/", async (req, res) => {
  try {
    const cart = await manager.createCart();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await manager.getCartById(Number(req.params.cid));
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = Number(req.params.cid);
    const pid = Number(req.params.pid);

    const cart = await manager.addProductToCart(cid, pid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

export default router;
