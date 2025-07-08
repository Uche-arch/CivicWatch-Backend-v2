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


// ✅ Keep-alive ping route
app.get("/ping", (req, res) => {
  res.send("pong");
});



// ✅ Start server after connecting to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );

    // ✅ Keep backend awake with node-cron
    cron.schedule("*/4 * * * *", async () => {
      try {
        const res = await fetch("https://civicwatch-backend.onrender.com/ping");
        const text = await res.text();
        console.log(`[Self-Ping] ✅ ${text} at ${new Date().toLocaleTimeString()}`);
      } catch (err) {
        console.error(`[Self-Ping] ❌ Failed: ${err.message}`);
      }
    });
  })
  .catch((err) =>
    console.error("❌ Failed to connect to MongoDB:", err.message)
  );