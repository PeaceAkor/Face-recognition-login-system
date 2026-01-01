import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FaceLogin() {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [matricNumber, setMatricNumber] = useState("");
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
        setStatus("Face camera ready");
      } catch (err) {
        console.error(err);
        setStatus("Failed to load camera or models");
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!matricNumber) {
      alert("Please enter matric number");
      return;
    }

    setLoading(true);
    setStatus("Scanning face...");

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
      const res = await axios.post("http://localhost:4000/api/login-face", {
        matric: matricNumber,
        faceDescriptor: Array.from(detection.descriptor),
      });

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        setStatus("Face not recognized");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setStatus("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        <p className="text-sm text-center text-gray-500 mt-2">
          Look into the camera to authenticate
        </p>

        {/* Status */}
        <div className="mt-4 text-center text-sm font-medium text-blue-600">
          {status}
        </div>

        {/* Input */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matric Number
          </label>
          <input
            type="text"
            placeholder="e.g. BHU/23/05/001"
            value={matricNumber}
            onChange={(e) => setMatricNumber(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Camera */}
        <div className="mt-6 flex justify-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="rounded-xl border-4 border-blue-500 shadow-md w-full max-w-xs"
          />
        </div>

        {/* Button */}
        <button
          onClick={login}
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Login with Face"}
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400 mt-4">
          Secure biometric authentication system
        </p>
      </div>
    </div>
  );
}
