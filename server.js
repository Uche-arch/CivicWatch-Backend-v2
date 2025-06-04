// backend/server.js
require("dotenv").config(); // Ensure dotenv is at the top

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const pinRoutes = require("./routes/pinRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// const forgotPasswordRoutes = require("./routes/forgotPassword");
// app.use("/api/password", forgotPasswordRoutes);

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/pins", pinRoutes);
app.use("/api/posts", postRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB Connected");
    // ⛔ Drop the unique index on the 'email' field in 'users' collection
    try {
      const db = mongoose.connection.db;
      const result = await db.collection("users").dropIndex("email_1");
      console.log("🗑️ Dropped unique index on email:", result);
    } catch (err) {
      if (err.codeName === "IndexNotFound") {
        console.log("ℹ️ No unique email index found, nothing to drop.");
      } else {
        console.error("❌ Error dropping index:", err.message);
      }
    }
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Failed to connect to MongoDB:", err));
