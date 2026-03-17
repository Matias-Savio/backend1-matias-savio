import Cart from "../models/Cart.js";

class CartManager {
  async getCarts() {
    try {
      return await Cart.find().populate("products.product");
    } catch (error) {
      throw new Error("Error al obtener carritos");
    }
  }

  async createCart() {
    try {
      const newCart = new Cart();
      return await newCart.save();
    } catch (error) {
      throw new Error("Error al crear el carrito");
    }
  }

  async getCartById(id) {
    try {
      return await Cart.findById(id).populate("products.product");
    } catch (error) {
      throw new Error("Error al obtener el carrito");
    }
  }

  async addProductToCart(cid, pid, quantity = 1) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) return null;

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === pid,
      );
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: pid, quantity });
      }

      return await cart.save();
    } catch (error) {
      throw new Error("Error al agregar producto al carrito");
    }
  }

  async updateCart(cid, products) {
    try {
      return await Cart.findByIdAndUpdate(cid, { products }, { new: true });
    } catch (error) {
      throw new Error("Error al actualizar el carrito");
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) return null;

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === pid,
      );
      if (productIndex === -1) return null;

      cart.products[productIndex].quantity = quantity;
      return await cart.save();
    } catch (error) {
      throw new Error("Error al actualizar cantidad del producto");
    }
  }

  async removeProductFromCart(cid, pid) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) return null;

      cart.products = cart.products.filter((p) => p.product.toString() !== pid);
      return await cart.save();
    } catch (error) {
      throw new Error("Error al eliminar producto del carrito");
    }
  }

  async clearCart(cid) {
    try {
      return await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
    } catch (error) {
      throw new Error("Error al vaciar el carrito");
    }
  }
}

export default CartManager;
