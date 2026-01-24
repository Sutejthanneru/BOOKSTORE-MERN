import Review from "../models/review.model.js";
import Book from "../models/note.model.js";

export const addOrUpdateReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    const userId = req.userId;

    if (!bookId || !rating) {
      return res.status(400).json({
        message: "Book ID and rating are required"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    let review = await Review.findOne({
      book: bookId,
      user: userId
    });

    let message = "";

    if (review) {

      review.rating = rating;
      review.comment = comment;
      await review.save();
      message = "Review updated successfully";
    } else {
      await Review.create({
        book: bookId,
        user: userId,
        rating,
        comment
      });
      message = "Review added successfully";
    }


    const reviews = await Review.find({ book: bookId });

    const totalReviews = reviews.length;
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    book.rating = Math.round(avgRating * 10) / 10; 
    book.numReviews = totalReviews;
    await book.save();

    res.status(200).json({
      message,
      rating: book.rating,
      numReviews: book.numReviews
    });

  } catch (error) {
    console.error("Error adding/updating review:", error);

    res.status(500).json({
      message: "Failed to add or update review"
    });
  }
};


export const getReviewsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    const reviews = await Review.find({ book: bookId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: reviews.length,
      reviews
    });

  } catch (error) {
    console.error("Get reviews error:", error);

    res.status(500).json({
      message: "Failed to fetch the reviews"
    });
  }
};

export const deleteMyReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.userId;

   
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    
    const review = await Review.findOne({
      book: bookId,
      user: userId
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

 
    await review.deleteOne();


    const reviews = await Review.find({ book: bookId });

    const totalReviews = reviews.length;

    if (totalReviews === 0) {
      book.rating = 0;
      book.numReviews = 0;
    } else {
      const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

      book.rating = Math.round(avgRating * 10) / 10;
      book.numReviews = totalReviews;
    }

    await book.save();

    res.status(200).json({
      message: "Review deleted successfully",
      rating: book.rating,
      numReviews: book.numReviews
    });

  } catch (error) {
    console.error("Review deletion failed:", error);

    res.status(500).json({
      message: "Review deletion failed"
    });
  }
};
