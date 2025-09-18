const Pin = require("../models/Pin");
const User = require("../models/User"); // 👈 import user model

exports.getPins = async (req, res) => {
  try {
    let lastVisit = null;

    if (req.user) {
      const user = await User.findById(req.user.id);

      // Save the OLD lastVisit before updating
      lastVisit = user.lastVisit ? user.lastVisit : null;

      // Update AFTER sending response
      user.lastVisit = new Date();
      user.save(); // don’t await, so response uses old one
    }

    const pins = await Pin.find().sort({ createdAt: -1 });

    res.json({ pins, lastVisit }); // send old value
  } catch (err) {
    console.error(err);
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
