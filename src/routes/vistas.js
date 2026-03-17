import express from "express";
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
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

    const result = await productManager.getProducts(queryOptions, {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOptions,
    });

    res.render("index", {
      products: result.docs,
      pagination: {
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
          : null,
        nextLink: result.hasNextPage
          ? `/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
          : null,
      },
    });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) {
      return res
        .status(404)
        .render("error", { error: "Producto no encontrado" });
    }
    res.render("productDetail", { product });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) {
      return res
        .status(404)
        .render("error", { error: "Carrito no encontrado" });
    }
    res.render("cart", { cart });
  } catch (error) {
    res.status(500).render("error", { error: error.message });
  }
});

router.get("/home", async (req, res) => {
  const result = await productManager.getProducts({}, { limit: 10, page: 1 });
  res.render("home", { products: result.docs });
});

router.get("/realtimeproducts", async (req, res) => {
  const result = await productManager.getProducts({}, { limit: 10, page: 1 });
  res.render("realTimeProducts", { products: result.docs });
});

export default router;
