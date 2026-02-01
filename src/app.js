import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRoutes from "./routes/carts.router.js";
const app = express();
const PORT = 8080;

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor con Express en el puerto ${PORT}`);
});
