import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">School Portal</h1>

          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.fullName || "Student"}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.fullName}
          </h2>
          <p className="text-gray-500 mt-1">
            Matric Number: {user?.matricNumber}
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Course Registration"
            description="Register and manage your courses"
            icon="📚"
          />

          <DashboardCard
            title="Check Results"
            description="View semester results"
            icon="📊"
          />

          <DashboardCard
            title="Pay Fees"
            description="Pay school and hostel fees"
            icon="💳"
          />

          <DashboardCard
            title="View Notices"
            description="Read official announcements"
            icon="📢"
          />
        </div>

        {/* Activity Section */}
        <div className="mt-10 bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>

          <ul className="space-y-3 text-sm text-gray-600">
            <li>✔ Face authentication login successful</li>
            <li>✔ Profile verified</li>
            <li>✔ Access granted to student dashboard</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({ title, description, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition cursor-pointer">
      <div className="text-4xl">{icon}</div>
      <h4 className="mt-4 font-semibold text-lg text-gray-800">{title}</h4>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );
}
