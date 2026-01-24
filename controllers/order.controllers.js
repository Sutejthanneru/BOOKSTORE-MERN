import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Book from "../models/note.model.js"; // ✅ FIXED
import Address from "../models/address.model.js";


// ================= CREATE ORDER (CHECKOUT) =================
export const createOrder = async (req, res) => {
  try {
    const addressId = req.body?.addressId;

    let address;

   
    if (!addressId) {
      address = await Address.findOne({
        user: req.userId,
        isDefault: true
      });

      if (!address) {
        return res.status(400).json({
          message: "No default address found. Please add or select an address."
        });
      }
    } else {
      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        return res.status(400).json({
          message: "Invalid addressId"
        });
      }

      address = await Address.findOne({
        _id: addressId,
        user: req.userId
      });

      if (!address) {
        return res.status(400).json({
          message: "Invalid address"
        });
      }
    }

    // 2️⃣ Fetch cart
    const cart = await Cart.findOne({ user: req.userId }).populate(
      "items.book",
      "title stock price"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty"
      });
    }

    // 3️⃣ Validate stock
    for (const item of cart.items) {
      if (item.quantity > item.book.stock) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.book.title}`
        });
      }
    }

    // 4️⃣ Prepare order items snapshot
    const orderItems = cart.items.map(item => ({
      book: item.book._id,
      title: item.book.title,
      quantity: item.quantity,
      price: item.book.price
    }));

    // 5️⃣ Create order
    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount,
      address: {
        name: address.name,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country
      },
      status: "placed"
    });

    // 6️⃣ Reduce stock
    for (const item of cart.items) {
      item.book.stock -= item.quantity;
      await item.book.save();
    }

    // 7️⃣ Clear cart
    cart.items = [];
    cart.totalItems = 0;
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message
    });
  }
};


// ================= GET MY ORDERS =================
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({
      createdAt: -1
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};


// ================= GET SINGLE ORDER =================
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order id"
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: req.userId
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json({
      order,
      message:"order fetched successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message
    });
  }
};


// ================= CANCEL ORDER =================
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order id"
      });
    }

    const order = await Order.findOne({
      _id: id,
      user: req.userId
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (order.status === "shipped" || order.status === "delivered") {
      return res.status(400).json({
        message: "Order cannot be cancelled at this stage"
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        message: "Order is already cancelled"
      });
    }

    // Restore stock
    for (const item of order.items) {
      const book = await Book.findById(item.book);
      if (book) {
        book.stock += item.quantity;
        await book.save();
      }
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel order",
      error: error.message
    });
  }
};
