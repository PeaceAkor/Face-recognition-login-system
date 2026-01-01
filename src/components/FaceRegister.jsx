import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

export default function FaceRegister() {
  const videoRef = useRef(null);

  const [matricNumber, setMatricNumber] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Loading face models...");

  useEffect(() => {
    const init = async () => {
      try {
        const MODEL_URL = "/models";

        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });

        videoRef.current.srcObject = stream;
        setStatus("Camera ready — position your face");
      } catch (err) {
        console.error(err);
        setStatus("Failed to load camera or models");
      }
    };

    init();
  }, []);

  const registerFace = async () => {
    if (!name || !matricNumber) {
      alert("Name and matric number are required");
      return;
    }

    setLoading(true);
    setStatus("Scanning and saving face...");

    const detection = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setLoading(false);
      setStatus("Face not detected");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/register-face", {
        name,
        matricNumber,
        faceDescriptor: Array.from(detection.descriptor),
      });

      setStatus("Face registered successfully 🎉");
      setName("");
      setMatricNumber("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setStatus(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Face Registration
        </h2>

        <p className="text-sm text-center text-gray-500 mt-2">
          Register your face for biometric authentication
        </p>

        {/* Status */}
        <div className="mt-4 text-center text-sm font-medium text-indigo-600">
          {status}
        </div>

        {/* Inputs */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matric Number
            </label>
            <input
              type="text"
              placeholder="e.g. BHU/23/05/001"
              value={matricNumber}
              onChange={(e) => setMatricNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Rose"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Camera */}
        <div className="mt-6 flex justify-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="rounded-xl border-4 border-indigo-500 shadow-md w-full max-w-xs"
          />
        </div>

        {/* Button */}
        <button
          onClick={registerFace}
          disabled={loading}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Registering Face..." : "Register Face"}
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400 mt-4">
          Your biometric data is securely stored
        </p>
      </div>
    </div>
  );
}
