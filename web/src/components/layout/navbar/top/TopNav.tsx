import React from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Plus,
  Calendar,
  User,
} from "lucide-react";

interface TopNavbarProps {
  activeTab?: "dashboard" | "classes" | "add" | "schedule" | "profile";
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab = "profile",
}) => {
  return (
    <nav className="px-6 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ClassFlow</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <a
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "dashboard"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              href="/dashboard"
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </a>
            <a
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "classes"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              href="/classes"
            >
              <GraduationCap size={20} />
              <span className="font-medium">Classes</span>
            </a>
            <a
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "schedule"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              href="/schedule"
            >
              <Calendar size={20} />
              <span className="font-medium">Schedule</span>
            </a>
            <a
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "profile"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              href="/profile"
            >
              <User size={20} />
              <span className="font-medium">Profile</span>
            </a>
          </div>

          {/* Add Button */}
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <Plus size={20} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </nav>
  );
};