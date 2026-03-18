# Backend API - Matias Savio

Esta es una API RESTful construida con Express.js para gestionar productos y carritos de compras. Incluye vistas renderizadas con Handlebars y funcionalidades en tiempo real con Socket.IO.

## Uso

El servidor se ejecutará en `http://localhost:8080` por defecto.

## Endpoints de la API

### Productos

#### GET /api/products

Obtiene una lista paginada de productos.

**Parámetros de consulta:**

- `limit` (opcional): Número de productos por página (por defecto: 10)
- `page` (opcional): Página actual (por defecto: 1)
- `sort` (opcional): Ordenar por precio ("asc" o "desc")
- `query` (opcional): Filtrar por categoría o estado (ej: "category:electronics" o "status:true")

**Respuesta:**

```json
{
  "status": "success",
  "payload": [...productos],
  "totalPages": 5,
  "prevPage": null,
  "nextPage": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "http://localhost:8080/api/products?page=2"
}
```

#### GET /api/products/:pid

Obtiene un producto específico por su ID.

**Respuesta:**

```json
{
  "_id": "product_id",
  "title": "Producto",
  "description": "Descripción",
  "code": "CODE123",
  "price": 100,
  "status": true,
  "stock": 50,
  "category": "Categoría",
  "thumbnails": ["url1", "url2"]
}
```

#### POST /api/products

Crea un nuevo producto.

**Cuerpo de la solicitud:**

```json
{
  "title": "Nuevo Producto",
  "description": "Descripción del producto",
  "code": "NP001",
  "price": 150,
  "status": true,
  "stock": 20,
  "category": "Electrónicos",
  "thumbnails": ["url_imagen"]
}
```

**Campos requeridos:** title, description, code, price, status, stock, category

#### PUT /api/products/:pid

Actualiza un producto existente.

**Cuerpo de la solicitud:** Cualquier campo a actualizar (excepto \_id).

#### DELETE /api/products/:pid

Elimina un producto por su ID.

### Carritos

#### POST /api/carts

Crea un nuevo carrito vacío.

**Respuesta:**

```json
{
  "_id": "cart_id",
  "products": []
}
```

#### GET /api/carts/:cid

Obtiene un carrito específico por su ID.

**Respuesta:**

```json
{
  "_id": "cart_id",
  "products": [
    {
      "product": "product_id",
      "quantity": 2
    }
  ]
}
```

#### POST /api/carts/:cid/product/:pid

Agrega un producto a un carrito.

**Cuerpo de la solicitud:**

```json
{
  "quantity": 1
}
```

#### PUT /api/carts/:cid

Actualiza el carrito completo reemplazando la lista de productos.

**Cuerpo de la solicitud:**

```json
{
  "products": [
    {
      "product": "product_id",
      "quantity": 3
    }
  ]
}
```

#### PUT /api/carts/:cid/products/:pid

Actualiza la cantidad de un producto específico en el carrito.

**Cuerpo de la solicitud:**

```json
{
  "quantity": 5
}
```

#### DELETE /api/carts/:cid/products/:pid

Elimina un producto específico del carrito.

#### DELETE /api/carts/:cid

Vacía completamente el carrito.

## Vistas

Las siguientes rutas renderizan vistas HTML usando Handlebars:

- `GET /` - Página de inicio
- `GET /home` - Página de inicio con productos
- `GET /products` - Lista de productos con paginación
- `GET /products/:pid` - Detalle de un producto
- `GET /carts/:cid` - Vista del carrito
- `GET /realtimeproducts` - Productos en tiempo real

## Funcionalidades en Tiempo Real

El servidor utiliza Socket.IO para actualizaciones en tiempo real:

- Cuando se crea, actualiza o elimina un producto, se emite el evento `updateProducts` con la lista actualizada de productos.
- Hay un chat básico implementado con eventos `newMessage` y `messaList`.

## Estructura del Proyecto

```
src/
├── app.js                 # Archivo principal del servidor
├── routes/
│   ├── products.router.js # Rutas de productos
│   ├── carts.router.js    # Rutas de carritos
│   └── vistas.js          # Rutas de vistas
├── managers/
│   ├── ProductManager.js  # Lógica de productos
│   └── CartManager.js     # Lógica de carritos
├── models/
│   ├── Product.js         # Modelo de Producto
│   └── Cart.js            # Modelo de Carrito
├── views/                 # Plantillas Handlebars
├── public/                # Archivos estáticos
└── data/                  # Archivos JSON (si se usan)
```

## Tecnologías Utilizadas

- **Express.js**: Framework web
- **MongoDB con Mongoose**: Base de datos
- **Handlebars**: Motor de plantillas
- **Socket.IO**: Comunicación en tiempo real
- **Node.js**: Entorno de ejecución
