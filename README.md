# 📚 Book Store Backend API

A scalable backend API for a Book Store application built with **Node.js, Express, and MongoDB**.
This project supports authentication, user profiles, books management, cart, orders, wishlist, reviews, and addresses.

---

## 🚀 Features

* 🔐 User Authentication (JWT-based)
* 👤 User Profile Management
* 📚 Book Management (CRUD)
* 🛒 Shopping Cart
* 📦 Order Management
* ❤️ Wishlist
* 📝 Reviews & Ratings
* 📍 Address Management
* 📧 Email support (via Nodemailer)

---

## 🏗️ Tech Stack

* **Backend:** Node.js, Express
* **Database:** MongoDB (Mongoose)
* **Authentication:** JSON Web Tokens (JWT)
* **Security:** bcryptjs
* **Email Service:** Nodemailer
* **Environment Management:** dotenv

---

## 📂 Project Structure

```
book-store-backend/
│
├── db/
│   └── index.js          # MongoDB connection
│
├── routes/
│   ├── auth.routes.js
│   ├── note.routes.js    # Book routes
│   ├── profile.routes.js
│   ├── cart.routes.js
│   ├── order.routes.js
│   ├── address.routes.js
│   ├── wishlist.routes.js
│   └── review.routes.js
│
├── app.js                # Express app setup
├── server.js             # Server entry point
├── package.json
└── .env
```

---

## ⚙️ Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd book-store-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root:

```env
PORT=8000
DATABASE_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

## ▶️ Running the Server

```bash
npm start
```

Or with nodemon:

```bash
npx nodemon server.js
```

Server will run on:

```
http://localhost:8000
```

---

## 📡 API Endpoints

### 🔐 Auth Routes

```
POST   /api/auth/register
POST   /api/auth/login
```

### 📚 Books (Notes)

```
GET    /api/note/
POST   /api/note/
PUT    /api/note/:id
DELETE /api/note/:id
```

### 👤 Profile

```
GET    /api/profile/
PUT    /api/profile/
```

### 🛒 Cart

```
GET    /api/cart/
POST   /api/cart/
DELETE /api/cart/:id
```

### 📦 Orders

```
POST   /api/order/
GET    /api/order/
```

### ❤️ Wishlist

```
GET    /api/wishlist/
POST   /api/wishlist/
DELETE /api/wishlist/:id
```

### 📝 Reviews

```
POST   /api/reviews/
GET    /api/reviews/:bookId
```

### 📍 Address

```
POST   /api/address/
GET    /api/address/
PUT    /api/address/:id
DELETE /api/address/:id
```

---

## 🔌 Database Connection

MongoDB is connected using Mongoose:

```js
await mongoose.connect(process.env.DATABASE_URI);
```

---

## 🧪 Testing

Currently no test scripts are configured.

---

## 📌 Future Improvements

* Add unit & integration tests
* Role-based access control (Admin/User)
* Payment gateway integration
* API documentation (Swagger)
* Rate limiting & advanced security

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

ISC License

---

## 💡 Author

Developed as a backend system for a full-featured Book Store application.
