import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    author: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    // 💰 Price of the book
    price: {
      type: Number,
      required: true,
      min: 0
    },

    // 📦 Stock available
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    // 🏷 Category (e.g. Fiction, Tech, Self-help)
    category: {
      type: String,
      trim: true,
      index: true
    },
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Book", bookSchema);
