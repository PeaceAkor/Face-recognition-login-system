import React from "react";
import { Link } from "react-router-dom";
import img1 from "../assets/Images/img1.png";
import img2 from "../assets/Images/img2.jpg";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">School Portal</h1>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-5 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="grid items-center gap-10 px-8 py-20 md:grid-cols-2">
        <div>
          <h2 className="text-4xl font-extrabold leading-tight text-gray-800">
            Face-Login <span className="text-blue-600">Biometric System</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600">
            Most school portals still rely on password-based authentication
            systems <span className="font-semibold">Internationally</span>. A
            modern and secure login system help school portal platforms stand
            out instantly.
          </p>

          <ul className="mt-6 space-y-3">
            <li className="flex items-center gap-2 text-gray-700">
              ✅ 90% of secure login experience
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              ✅ Secure authentication system
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              ✅ Responsive & fast UI
            </li>
          </ul>

          <div className="mt-8 space-x-4">
            <Link
              to="/register"
              className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative flex justify-center items-center">
          <img
            src={img1}
            alt="Homepage Design"
            className="rounded-2xl shadow-xl w-64 md:w-80"
          />
          <img
            src={img2}
            alt="Homepage Design"
            className="absolute top-10 left-20 rounded-2xl shadow-2xl w-56 md:w-72"
          />
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-16 bg-white">
        <h3 className="mb-10 text-3xl font-bold text-center text-gray-800">
          Key Features
        </h3>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="p-6 text-center rounded-xl shadow hover:shadow-lg">
            <h4 className="mb-2 text-xl font-semibold">Secure Login</h4>
            <p className="text-gray-600">
              Face biometric features with encrypted credentials.
            </p>
          </div>
          <div className="p-6 text-center rounded-xl shadow hover:shadow-lg">
            <h4 className="mb-2 text-xl font-semibold">Fast Performance</h4>
            <p className="text-gray-600">
              Optimized UI for speed and smooth experience.
            </p>
          </div>
          <div className="p-6 text-center rounded-xl shadow hover:shadow-lg">
            <h4 className="mb-2 text-xl font-semibold">Responsive Design</h4>
            <p className="text-gray-600">
              Looks great on mobile, tablet, and desktop.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-600 bg-gray-100">
        © {new Date().getFullYear()} Schoolportal. All rights reserved.
      </footer>
    </div>
  );
}
