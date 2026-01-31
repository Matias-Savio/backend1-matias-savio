import express from "express";
const app = express();
const PORT = 8080;

const usuarios = [
  {
    id: 1,
    nombre: "Juan",
    email: "juan@ejemplo.com",
  },
  {
    id: 2,
    nombre: "María",
    email: "maria@ejemplo.com",
  },
];

app.get("/", (request, response) => {
  response.send("Hola desde Express");
});

app.get("/bienvenido", (req, res) => {
  res.send("Bienvenido usuario/a");
});

app.get("/usuario", (req, res) => {
  const usuario = {
    nombre: "Juan",
    email: "juan@ejemplo.com",
  };
  res.json(usuario);
});

app.get("/usuario/:id", (req, res) => {
  const id = req.params.id;
  const user = usuarios.find((item) => item.id == id);
  res.json(user);
});

app.listen(PORT, () => {
  console.log(`Servidor con Express en el puerto ${PORT}`);
});
