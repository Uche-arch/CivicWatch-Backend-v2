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

// app.use(cors());

const allowedOrigins = [
  "http://127.0.0.1:5500", // adjust to your local dev port
  "http://127.0.0.1:5501",
  "http://127.0.0.1:5502",
  "http://127.0.0.1:5503",
  "http://localhost:3000", // if you test React locally
  "https://civicwatch-frontend.onrender.com", // your deployed frontend (change to real URL)
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "CORS blocked: This origin is not allowed.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // allow cookies/headers like Authorization
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/pins", pinRoutes);
app.use("/api/posts", postRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
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
  })
  .catch((err) =>
    console.error("❌ Failed to connect to MongoDB:", err.message)
  );