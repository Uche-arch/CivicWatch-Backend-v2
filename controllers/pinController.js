const Pin = require("../models/Pin");

exports.getPins = async (req, res) => {
  try {
    // If user is logged in, include lastVisit
    let lastVisit = null;
    if (req.user) {
      lastVisit = req.user.lastVisit;
    }

    const pins = await Pin.find().sort({ createdAt: -1 });

    res.json({ pins, lastVisit });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch pins" });
  }
};

exports.updateLastVisit = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { lastVisit: new Date() });
    res.json({ msg: "Last visit updated" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update last visit" });
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
