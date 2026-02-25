import express from "express";
import User from "../models/User.js";
import * as faceapi from "face-api.js";
import { encrypt, decrypt } from "../utils/encryption.js";

const router = express.Router();

/* =========================
   REGISTER FACE
========================= */
router.post("/register-face", async (req, res) => {
  try {
    const { name, matricNumber, faceDescriptor } = req.body;

    if (!name || !matricNumber || !faceDescriptor) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 🔐 Encrypt descriptor before saving
    const encryptedDescriptor = encrypt(faceDescriptor);

    await User.create({
      name,
      matricNumber,
      faceDescriptor: encryptedDescriptor,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   LOGIN FACE
========================= */
router.post("/login-face", async (req, res) => {
  try {
    const { matricNumber, faceDescriptor } = req.body;

    if (!matricNumber || !faceDescriptor) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findOne({ matricNumber });

    if (!user) {
      return res.status(401).json({ message: "User not registered" });
    }

    // 🔓 Decrypt stored descriptor
    const decryptedDescriptor = decrypt(user.faceDescriptor);

    const storedDescriptor = new Float32Array(decryptedDescriptor);
    const inputDescriptor = new Float32Array(faceDescriptor);

    const distance = faceapi.euclideanDistance(
      storedDescriptor,
      inputDescriptor,
    );

    console.log("Face distance:", distance);

    // Threshold (can adjust 0.5 - 0.6)
    if (distance > 0.6) {
      return res.status(401).json({
        success: false,
        message: "Face not recognized",
      });
    }

    res.json({
      success: true,
      message: "Face login successful",
      user: {
        id: user._id,
        name: user.name,
        matricNumber: user.matricNumber,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
