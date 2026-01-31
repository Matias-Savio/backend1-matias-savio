const http = require("http");

const server = http.createServer((req, res) => {
  res.end("Servidor Wed");
});

server.liesten(8080, () => {
  console.log(`Servidor Wed en el puerto ${8080}`);
});
