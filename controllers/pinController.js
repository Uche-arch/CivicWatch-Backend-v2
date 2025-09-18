const Pin = require("../models/Pin");
const User = require("../models/User");

// -------------------- GET ALL PINS --------------------
// exports.getPins = async (req, res) => {
//   try {
//     let lastVisit = null;

//     if (req.user) {
//       const user = await User.findById(req.user.id);

//       if (user) {
//         // Use lastVisit if exists; fallback to account creation or epoch
//         lastVisit = user.lastVisit || user.createdAt || new Date(0);
//         console.log("DEBUG: User lastVisit BEFORE update:", lastVisit);

//         // Update lastVisit to now
//         user.lastVisit = new Date();
//         await user.save();
//         console.log("DEBUG: User lastVisit AFTER update:", user.lastVisit);
//       } else {
//         console.log("DEBUG: No user found for id:", req.user.id);
//       }
//     } else {
//       console.log("DEBUG: Guest user, no lastVisit");
//     }

//     const pins = await Pin.find().sort({ createdAt: -1 });

//     pins.forEach((pin) => {
//       console.log(
//         `DEBUG: Pin by ${pin.username} at ${pin.createdAt} (pinTime=${new Date(
//           pin.createdAt
//         ).getTime()})`
//       );
//     });

//     res.json({ pins, lastVisit });
//   } catch (err) {
//     console.error("ERROR in getPins:", err);
//     res.status(500).json({ msg: "Failed to fetch pins" });
//   }
// };


exports.getPins = async (req, res) => {
  try {
    let lastVisit = null;
    let isFirstLogin = false; // NEW FLAG

    if (req.user) {
      const user = await User.findById(req.user.id);

      if (user) {
        // Determine if this is the first login ever
        if (!user.lastVisit) {
          isFirstLogin = true;
          lastVisit = user.createdAt || new Date(0);
        } else {
          lastVisit = user.lastVisit;
        }

        // Update lastVisit to now
        user.lastVisit = new Date();
        await user.save();
      }
    }

    const pins = await Pin.find().sort({ createdAt: -1 });

    res.json({ pins, lastVisit, isFirstLogin }); // SEND FLAG TO FRONTEND
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

// -------------------- UPDATE LAST VISIT --------------------
exports.updateLastVisit = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const previousVisit = user.lastVisit;
    user.lastVisit = new Date();
    await user.save();

    res.json({ msg: "Last visit updated", lastVisit: previousVisit || null });
  } catch (err) {
    console.error("ERROR in updateLastVisit:", err);
    res.status(500).json({ msg: "Failed to update last visit" });
  }
};
