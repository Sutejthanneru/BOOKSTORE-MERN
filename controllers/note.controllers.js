import Book from "../models/note.model.js";

// ================= CREATE BOOK =================
export const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      price,
      stock,
      category,
      images
    } = req.body;

    // 🔴 Basic validation
    if (!title || !author || price === undefined || stock === undefined) {
      return res.status(400).json({
        message: "Title, author, price and stock are required"
      });
    }

    const book = await Book.create({
      title,
      author,
      description,
      price,
      stock,
      category,
      images
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create book",
      error: error.message
    });
  }
};

// ================= GET ALL BOOKS =================
export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ isActive: true });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch books",
      error: error.message
    });
  }
};

// ================= GET SINGLE BOOK =================


export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Get book by id error:", error);

    res.status(500).json({
      message: "Failed to fetch book"
    });
  }
};


// ================= UPDATE BOOK =================
export const updateBook = async (req, res) => {
  try {
    const {
      id,
      title,
      author,
      description,
      price,
      stock,
      category,
      images,
      isActive
    } = req.body;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (description !== undefined) book.description = description;
    if (price !== undefined) book.price = price;
    if (stock !== undefined) book.stock = stock;
    if (category !== undefined) book.category = category;
    if (images !== undefined) book.images = images;
    if (isActive !== undefined) book.isActive = isActive;

    await book.save();

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update book",
      error: error.message
    });
  }
};

// ================= DELETE BOOK (SOFT DELETE) =================
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.body;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    // 🔕 Soft delete (recommended for stores)
    book.isActive = false;
    await book.save();

    res.status(200).json({
      message: "Book removed successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete book",
      error: error.message
    });
  }
};
