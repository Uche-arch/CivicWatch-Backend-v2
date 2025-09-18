const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getPins,
  addPin,
  removePin,
  updateLastVisit,
} = require("../controllers/pinController");

router.get(
  "/",
  (req, res, next) => {
    auth(req, res, (err) => {
      if (err) {
        req.user = null; // guest mode
      }
      next();
    });
  },
  getPins
);
router.post("/", auth, addPin);
router.delete("/:id", auth, removePin);
router.post("/last-visit", auth, updateLastVisit);

module.exports = router;
