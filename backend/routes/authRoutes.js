import express from "express";
import User from "../models/User.js";
import { encrypt, decrypt } from "../utils/encryption.js";

const router = express.Router();

// Simple euclidean distance — no face-api.js needed on the server
function euclideanDistance(arr1, arr2) {
  if (arr1.length !== arr2.length)
    throw new Error("Descriptor length mismatch");
  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    const diff = arr1[i] - arr2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

/* =========================
   REGISTER FACE
========================= */
router.post("/register-face", async (req, res) => {
  try {
    const { name, matricNumber, faceDescriptor } = req.body;

    if (!name || !matricNumber || !faceDescriptor) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check if matric number already registered
    const existing = await User.findOne({ matricNumber });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Matric number already registered" });
    }

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
    console.error("Register error:", error);
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

    // Decrypt stored descriptor
    const decryptedDescriptor = decrypt(user.faceDescriptor);

    const storedDescriptor = Array.from(decryptedDescriptor);
    const inputDescriptor = Array.from(faceDescriptor);

    const distance = euclideanDistance(storedDescriptor, inputDescriptor);
    console.log("Face distance:", distance);

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
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
