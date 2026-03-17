import Product from "../models/Product.js";

class ProductManager {
  async getProducts(query = {}, options = {}) {
    try {
      const { limit = 10, page = 1, sort = {} } = options;
      const skip = (page - 1) * limit;

      let filter = {};
      if (query.category) {
        filter.category = query.category;
      }
      if (query.status !== undefined) {
        filter.status = query.status;
      }

      const products = await Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Product.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);

      return {
        docs: products,
        totalDocs: total,
        limit,
        totalPages,
        page,
        pagingCounter: skip + 1,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
      };
    } catch (error) {
      throw new Error("Error al obtener productos");
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error("Error al obtener el producto");
    }
  }

  async addProduct(product) {
    try {
      const newProduct = new Product(product);
      return await newProduct.save();
    } catch (error) {
      throw new Error("Error al crear el producto");
    }
  }

  async updateProduct(id, data) {
    try {
      return await Product.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error("Error al actualizar el producto");
    }
  }

  async deleteProduct(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error al eliminar el producto");
    }
  }
}

export default ProductManager;
