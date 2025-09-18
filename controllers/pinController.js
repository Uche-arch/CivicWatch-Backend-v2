const Pin = require("../models/Pin");
const User = require("../models/User"); // 👈 import user model

// -------------------- GET ALL PINS --------------------
exports.getPins = async (req, res) => {
  try {
    let lastVisit = null;

    // if (req.user) {
    //   const user = await User.findById(req.user.id);

    //   if (user) {
    //     // 1️⃣ capture old lastVisit BEFORE updating
    //     lastVisit = user.lastVisit;
    //     console.log("DEBUG: User lastVisit BEFORE update:", lastVisit);

    //     // 2️⃣ update to now
    //     user.lastVisit = new Date();
    //     await user.save();
    //     console.log("DEBUG: User lastVisit AFTER update:", user.lastVisit);
    //   } else {
    //     console.log("DEBUG: No user found for id:", req.user.id);
    //   }
    // } 
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user) {
        // If lastVisit is null, set it to the account creation date
        lastVisit = user.lastVisit || user.createdAt; // fallback
        user.lastVisit = new Date();
        await user.save();
      }
    } else {
      console.log("DEBUG: Guest user, no lastVisit");
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

// -------------------- ADD PIN --------------------
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
  } catch (err) {
    console.error("ERROR in addPin:", err);
    res.status(500).json({ msg: "Failed to add pin" });
  }
};

// -------------------- REMOVE PIN --------------------
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
  } catch (err) {
    console.error("ERROR in removePin:", err);
    res.status(500).json({ msg: "Failed to remove pin" });
  }
};

// -------------------- UPDATE LAST VISIT (OPTIONAL) --------------------
exports.updateLastVisit = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const previousVisit = user.lastVisit;
    user.lastVisit = new Date();
    await user.save();

    console.log(
      "DEBUG: updateLastVisit → old:",
      previousVisit,
      "new:",
      user.lastVisit
    );

    res.json({
      msg: "Last visit updated",
      lastVisit: previousVisit || null,
    });
  } catch (err) {
    console.error("ERROR in updateLastVisit:", err);
    res.status(500).json({ msg: "Failed to update last visit" });
  }
};
