import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const manager = new CartManager();

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
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const cart = await manager.addProductToCart(
      req.params.cid,
      req.params.pid,
      quantity,
    );
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: "Productos requeridos como array" });
    }

    const cart = await manager.updateCart(req.params.cid, products);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity === undefined || quantity < 1) {
      return res
        .status(400)
        .json({ error: "Cantidad requerida y debe ser mayor a 0" });
    }

    const cart = await manager.updateProductQuantity(
      req.params.cid,
      req.params.pid,
      quantity,
    );
    if (!cart) {
      return res
        .status(404)
        .json({ error: "Carrito o producto no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar cantidad del producto" });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await manager.removeProductFromCart(
      req.params.cid,
      req.params.pid,
    );
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar producto del carrito" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cart = await manager.clearCart(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
});

export default router;
