const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getPins, addPin, removePin } = require("../controllers/pinController");

router.get("/", getPins);
router.post("/", auth, addPin);
router.delete("/:id", auth, removePin);

module.exports = router;
