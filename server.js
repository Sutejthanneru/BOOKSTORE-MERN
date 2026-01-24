import dotenv from "dotenv";
import cors from "cors";

dotenv.config({
    path: "./.env"
});
import app from "./app.js";
import connectDB from "./db/index.js";

connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
