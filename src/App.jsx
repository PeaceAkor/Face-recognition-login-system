import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FaceRegister from "./components/FaceRegister";
import FaceLogin from "./components/FaceLogin";
import Dashboard from "./components/Dashboard";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<FaceLogin />} />
        <Route path="/register" element={<FaceRegister />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
