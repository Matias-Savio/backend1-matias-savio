import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRoutes from "./routes/carts.router.js";
import vistasRouter from "./routes/vistas.js";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "src", "public")));

app.engine("handlebars", (await import("express-handlebars")).engine());
app.set("view engine", "handlebars");
app.set("views", path.join(process.cwd(), "src", "views"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRoutes);
app.use("/", vistasRouter);

let messages = [];

// Configuracion de socket.io (creacion de un chat con wedsockets)

io.on("connection", (socket) => {
  socket.emit("messaList", messages);
  console.log("Nuevo cliente conectado");

  socket.on("newMessage", (message) => {
    messages.push(message);
    io.emit("newMessage", {
      socketID: socket.id,
      message: message,
    });
  });
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Conexion a MongoDB

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((error) => {
    console.log("Error al conectar a MongoDB", error);
  });
