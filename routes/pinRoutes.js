const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getPins,
  addPin,
  removePin,
  updateLastVisit,
} = require("../controllers/pinController");

// Allow guests for GET / (pins)
// router.get(
//   "/",
//   (req, res, next) => {
//     auth(req, res, (err) => {
//       if (err) {
//         req.user = null; // guest mode
//       }
//       next();
//     });
//   },
//   getPins
// );

// Guest + Auth friendly GET /pins
router.get("/", (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // logged-in user
    } catch (err) {
      console.log("DEBUG: Invalid token in GET /pins");
      req.user = null;
    }
  } else {
    req.user = null; // guest mode
  }

  next();
}, getPins);

router.post("/", auth, addPin);
router.delete("/:id", auth, removePin);

// optional endpoint
router.post("/last-visit", auth, updateLastVisit);

module.exports = router;
