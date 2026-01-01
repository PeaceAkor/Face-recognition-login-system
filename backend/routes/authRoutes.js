import express from "express";
import User from "../models/User.js";
import * as faceapi from "face-api.js";

const router = express.Router();

// REGISTER
router.post("/register-face", async (req, res) => {
  const { name, matricNumber, faceDescriptor } = req.body;

  if (!name || !matricNumber || !faceDescriptor) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const existingUser = await User.findOne({ matricNumber });
  if (existingUser) {
    return res.status(400).json({ message: "Matric already exists" });
  }

  const user = await User.create({ name, matricNumber, faceDescriptor });
  res.status(201).json({ message: "Registered successfully" });
});

router.post("/login-face", async (req, res) => {
  try {
    const { matric, faceDescriptor } = req.body;

    if (!matric || !faceDescriptor) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findOne({ matricNumber: matric });

    if (!user) {
      return res.status(401).json({ message: "User not registered" });
    }

    // Compare face descriptors
    const storedDescriptor = new Float32Array(user.faceDescriptor);
    const inputDescriptor = new Float32Array(faceDescriptor);

    const distance = faceapi.euclideanDistance(
      storedDescriptor,
      inputDescriptor
    );

    console.log("Face distance:", distance);

    if (distance > 0.6) {
      return res.status(401).json({ message: "Face not recognized" });
    }

    res.json({
      success: true,
      message: "Face login successful",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
