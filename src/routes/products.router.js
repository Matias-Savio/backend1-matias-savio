import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    let sortOptions = {};
    if (sort === "asc") {
      sortOptions.price = 1;
    } else if (sort === "desc") {
      sortOptions.price = -1;
    }

    let queryOptions = {};
    if (query) {
      if (query.startsWith("category:")) {
        queryOptions.category = query.split(":")[1];
      } else if (query.startsWith("status:")) {
        queryOptions.status = query.split(":")[1] === "true";
      }
    }

    const result = await manager.getProducts(queryOptions, {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOptions,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
    const buildLink = (pageNum) => {
      const params = new URLSearchParams(req.query);
      params.set("page", pageNum);
      return `${baseUrl}?${params.toString()}`;
    };

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await manager.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

router.post("/", async (req, res) => {
  try {
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

    if (
      !title ||
      !description ||
      !code ||
      price === undefined ||
      status === undefined ||
      stock === undefined ||
      !category
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const newProduct = await manager.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails: thumbnails || [],
    });

    const io = req.app.get("io");
    if (io) {
      const result = await manager.getProducts({}, { limit: 100 });
      io.emit("updateProducts", result.docs);
    }

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updateData = req.body;
    delete updateData._id;

    const updatedProduct = await manager.updateProduct(
      req.params.pid,
      updateData,
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const io = req.app.get("io");
    if (io) {
      const result = await manager.getProducts({}, { limit: 100 });
      io.emit("updateProducts", result.docs);
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const product = await manager.getProductById(req.params.pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await manager.deleteProduct(req.params.pid);

    const io = req.app.get("io");
    if (io) {
      const result = await manager.getProducts({}, { limit: 100 });
      io.emit("updateProducts", result.docs);
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
