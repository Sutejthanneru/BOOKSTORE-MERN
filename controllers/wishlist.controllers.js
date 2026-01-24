import Wishlist from "../models/wishlist.model.js";
import Book from "../models/note.model.js";
export const getMyWishlist = async(req,res) => {
    try {
        const mywishlist= await Wishlist.findOne({user:req.userId}).populate("books")
        if(!mywishlist){
            res.status(200).json(
                {
                   books: []
                }
            )
        }
        res.status(200).json(
            {
                books:mywishlist.books
            }
        )
        
    } catch (error) {
        console.error("Unable to fetch the wishlist",error);
        res.status(401).json({
            message:"Failed to fetch the wishlist"
        })
        
    }
}

export const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({
        message: "Book ID is required"
      });
    }

    // Validate book exists
    const bookExists = await Book.findById(bookId);
    if (!bookExists) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.userId });

    // Create wishlist if not exists
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.userId,
        books: [bookId]
      });

      return res.status(201).json({
        message: "Book added to wishlist",
        wishlist
      });
    }

    // Prevent duplicates
    if (wishlist.books.includes(bookId)) {
      return res.status(200).json({
        message: "Book already in wishlist",
        wishlist
      });
    }

    wishlist.books.push(bookId);
    await wishlist.save();

    res.status(200).json({
      message: "Book added to wishlist",
      wishlist
    });

  } catch (error) {
    console.error("Error adding to wishlist:", error);

    res.status(500).json({
      message: "Failed to add book to wishlist"
    });
  }
};


export const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({
        message: "Book ID is required"
      });
    }

    const wishlist = await Wishlist.findOne({ user: req.userId });

    // If wishlist does not exist, nothing to remove
    if (!wishlist) {
      return res.status(200).json({
        message: "Wishlist is already empty",
        books: []
      });
    }

    // Remove book if exists
    wishlist.books = wishlist.books.filter(
      (id) => id.toString() !== bookId
    );

    await wishlist.save();

    res.status(200).json({
      message: "Book removed from wishlist",
      wishlist
    });

  } catch (error) {
    console.error("Error removing from wishlist:", error);

    res.status(500).json({
      message: "Failed to remove book from wishlist"
    });
  }
};
