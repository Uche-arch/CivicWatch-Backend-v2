const Pin = require("../models/Pin");
const User = require("../models/User"); // 👈 import user model




exports.getPins = async (req, res) => {
  try {
    let lastVisit = null;

    if (req.user) {
      const user = await User.findById(req.user.id);

      // 1️⃣ capture old lastVisit BEFORE updating
      lastVisit = user.lastVisit;
      console.log("DEBUG: User lastVisit BEFORE update:", lastVisit);

      // 2️⃣ update to now
      user.lastVisit = new Date();
      await user.save();
      console.log("DEBUG: User lastVisit AFTER update:", user.lastVisit);
    }

    const pins = await Pin.find().sort({ createdAt: -1 });

    // 3️⃣ debug each pin
    pins.forEach((pin) => {
      console.log(
        `DEBUG: Pin by ${pin.username} at ${pin.createdAt} (pinTime=${new Date(
          pin.createdAt
        ).getTime()})`
      );
    });

    // 4️⃣ send old lastVisit back to frontend
    res.json({ pins, lastVisit });
  } catch (err) {
    console.error("ERROR in getPins:", err);
    res.status(500).json({ msg: "Failed to fetch pins" });
  }
};

exports.addPin = async (req, res) => {
  const { lat, lng } = req.body;
  try {
    const newPin = new Pin({
      userId: req.user.id,
      username: req.user.username,
      lat,
      lng,
    });
    await newPin.save();
    res.status(201).json(newPin);
  } catch {
    res.status(500).json({ msg: "Failed to add pin" });
  }
};

exports.removePin = async (req, res) => {
  const pinId = req.params.id;
  try {
    const pin = await Pin.findById(pinId);
    if (!pin) return res.status(404).json({ msg: "Pin not found" });

    if (pin.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await Pin.findByIdAndDelete(pinId);
    res.json({ msg: "Pin removed" });
  } catch {
    res.status(500).json({ msg: "Failed to remove pin" });
  }
};
