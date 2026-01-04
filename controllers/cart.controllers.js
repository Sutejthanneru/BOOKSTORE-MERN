import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Book from "../models/note.model.js"; // ✅ FIXED import


// ================= GET MY CART =================
export const getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId })
      .populate("items.book", "title author price stock");

    if (!cart) {
      return res.status(200).json({
        items: [],
        totalItems: 0,
        totalAmount: 0
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cart",
      error: error.message
    });
  }
};


// ================= ADD ITEM TO CART =================
export const addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(bookId) ||
      !quantity ||
      quantity < 1
    ) {
      return res.status(400).json({
        message: "Valid bookId and quantity are required"
      });
    }

    const book = await Book.findById(bookId);

    if (!book || book.isActive === false) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    if (quantity > book.stock) {
      return res.status(400).json({
        message: "Requested quantity exceeds stock"
      });
    }

    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        items: [],
        totalItems: 0,
        totalAmount: 0
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.book.toString() === bookId
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + quantity;

      if (newQty > book.stock) {
        return res.status(400).json({
          message: "Total quantity exceeds stock"
        });
      }

      cart.items[itemIndex].quantity = newQty;
    } else {
      cart.items.push({
        book: bookId,
        quantity,
        price: book.price // ✅ server-side price
      });
    }

    // 🔢 Recalculate totals
    cart.totalItems = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add item to cart",
      error: error.message
    });
  }
};


// ================= UPDATE CART ITEM =================
export const updateCartItem = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(bookId) ||
      quantity < 1
    ) {
      return res.status(400).json({
        message: "Valid bookId and quantity required"
      });
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    if (quantity > book.stock) {
      return res.status(400).json({
        message: "Quantity exceeds stock"
      });
    }

    const item = cart.items.find(
      (item) => item.book.toString() === bookId
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found in cart"
      });
    }

    item.quantity = quantity;

    cart.totalItems = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update cart",
      error: error.message
    });
  }
};


// ================= REMOVE ITEM =================
export const removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        message: "Valid bookId required"
      });
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      (item) => item.book.toString() !== bookId
    );

    cart.totalItems = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove item",
      error: error.message
    });
  }
};


// ================= CLEAR CART =================
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(200).json({
        message: "Cart already empty"
      });
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalAmount = 0;

    await cart.save();

    res.status(200).json({
      message: "Cart cleared successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to clear cart",
      error: error.message
    });
  }
};
