import bookRoutes from "./routes/note.routes.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js"
import express from "express";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import addressRoutes from "./routes/address.routes.js";
const app=express()
app.use(express.json());
app.get("/",(eq,res)=>{
  res.send("Hello");
})
app.use("/api/auth", authRoutes);
app.use("/api/note", bookRoutes);
app.use("/api/profile",profileRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/address",addressRoutes);

export default app;