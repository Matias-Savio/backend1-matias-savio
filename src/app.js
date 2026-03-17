import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRoutes from "./routes/carts.router.js";
import path from "path";
import { error } from "console";
const express = require("express");
const handlbars = require("express-handlebars");
const http = require("http");
const io = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.engine("handlebars", handlbars.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRoutes);

let messages = [];

// Configuracion de socket.io (creacion de un chat con wedsockets)

io.on(`connection`, (socket) => {
  socket.emit("messaList", messages);
  console.log("Nuevo cliente  conectado");

  socket.on(`newMessage`, (message) => {
    messages.push(message);
    io.emit(`newMessage`, {
      socketID: socket.id,
      message: message,
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor con Express en el puerto ${PORT}`);
});

// Conexion a MongoDB

mongoose
  .connect()
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .cath((error) => {
    console.log("Error al conectar a MongoDB", error);
  });
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
