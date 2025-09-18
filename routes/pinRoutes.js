const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getPins,
  addPin,
  removePin,
  updateLastVisit,
} = require("../controllers/pinController");

exports.getPins = async (req, res) => {
  try {
    const pins = await Pin.find().sort({ createdAt: -1 });

    let lastVisit = null;

    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user) {
        lastVisit = user.lastVisit;
        user.lastVisit = new Date();
        await user.save();
      }
    }

    res.json({ pins, lastVisit });
  } catch (err) {
    console.error("Error in getPins:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

router.post("/", auth, addPin);
router.delete("/:id", auth, removePin);

// optional endpoint
router.post("/last-visit", auth, updateLastVisit);

module.exports = router;
