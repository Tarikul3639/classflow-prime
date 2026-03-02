"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  Edit,
  Verified,
  Code,
  Code as Function,
  BookOpen,
  Bell,
  Moon,
  Globe,
  LogOut,
  ChevronRight,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const ProfileSettings: React.FC = () => {
  const [fullName, setFullName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex.johnson@classflow.edu");
  const [bio, setBio] = useState(
    "Computer Science major with a passion for AI and machine learning. Looking forward to graduate research.",
  );
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-slate-50 pb-4 pt-4 px-4 lg:px-8 border-b border-slate-200">
        <div className="flex items-center gap-3 mx-auto">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
            <User className="size-5.5" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">
              Profile Settings
            </h1>
            <p className="text-slate-500 text-xs truncate">
              Manage your account settings and class preferences.
            </p>
          </div>
          <button className="flex bg-primary text-white px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 cursor-pointer">
            Save <span className="ml-1 hidden md:inline">Changes</span>
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">
        <div className="mx-auto px-4 lg:px-8 py-6">
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                {/* Profile Picture */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative group">
                    <div
                      className="h-28 w-28 rounded-full bg-cover bg-center border-4 border-slate-50 shadow-lg"
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfpo-xwmdOuSDI11UFt6Uo-zfOAy0Arx84Ltb0WBcuo7hd6utRBeV68VO53qJ2K_2wLk79hF5M0zFDzC_0OVL8mkdBPcvkIWi4f5DA-obHsl5ApQ9Y9n2aDJmfy-TJOvmTvNmQCSqayLMtIrc0LYIiilkEyWdjn_HnZPOSXzqB1c7x69bka7oB3xaF-RmiadEcUbY4C9MPWnu6UgasrRPBIkkbv0G9ejPS6E399yybBWRW2TtyMPZd7_-yOmvsBZ2KuGhtRJl1R7nO')",
                      }}
                    />
                    <button className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg border-4 border-white hover:scale-110 transition-transform">
                      <Edit size={14} />
                    </button>
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-slate-900">
                    Alex Johnson
                  </h2>
                  <p className="text-slate-500 font-medium text-sm">
                    Student • Sophomore Year
                  </p>
                  <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary font-medium text-xs">
                    <Verified size={14} />
                    alex.johnson@classflow.edu
                  </div>
                </div>

                {/* Personal Information */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      description="This is the name that will be displayed on your profile and to your classmates."
                      type="text"
                      className="px-3 py-2 text-sm"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <Input
                      label="Email Address"
                      description="Your registered email address. Contact support to change it."
                      type="email"
                      className="px-3 py-2 text-sm"
                      value={email}
                      disabled
                    />
                    {/* Textarea */}
                    <Textarea
                      label="Bio"
                      placeholder="Tell us about yourself..."
                      description="Maximum 500 characters"
                      value={bio}
                      rows={4}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                </div>

                {/* Logout Button */}
                <div className="mt-8">
                  <button className="w-full border-2 border-red-500/20 text-red-500 rounded-lg py-2.5 px-4 font-bold text-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 group cursor-pointer">
                    <LogOut
                      size={16}
                      className="group-hover:rotate-12 transition-transform duration-300 group-hover:text-white"
                    />
                    Log Out
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Classes & Preferences */}
            <div className="lg:col-span-7 space-y-5">
              {/* Joined Classes */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">
                    Joined Classes
                  </h3>
                  <button className="text-primary text-xs font-bold hover:underline">
                    Manage All
                  </button>
                </div>
                <div className="space-y-3">
                  {/* Class 1 */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                        <Code size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          Intro to CS 101
                        </p>
                        <p className="text-xs text-slate-500">
                          Prof. Miller • MWF 9:00 AM
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                      Active
                    </span>
                  </div>

                  {/* Class 2 */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                        <Function size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          Calculus II
                        </p>
                        <p className="text-xs text-slate-500">
                          Dr. Chen • TTh 11:00 AM
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                      Active
                    </span>
                  </div>

                  {/* Class 3 */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 opacity-70">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          World History
                        </p>
                        <p className="text-xs text-slate-500">
                          Prof. Dave • Semester End
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                      Ended
                    </span>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-base font-bold text-slate-900 mb-4">
                  Preferences
                </h3>
                <div className="divide-y divide-slate-100">
                  {/* Push Notifications */}
                  <div className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-slate-100 rounded-lg">
                        <Bell className="text-slate-600" size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          Push Notifications
                        </p>
                        <p className="text-xs text-slate-500">
                          Stay updated with class announcements
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full cursor-pointer transition-colors duration-200 ${
                        notifications ? "bg-primary" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ${
                          notifications ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Dark Mode */}
                  <div className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-slate-100 rounded-lg">
                        <Moon className="text-slate-600" size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          Dark Mode
                        </p>
                        <p className="text-xs text-slate-500">
                          Reduce eye strain in low light
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full cursor-pointer transition-colors duration-200 ${
                        darkMode ? "bg-primary" : "bg-slate-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ${
                          darkMode ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Language */}
                  <div className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-slate-100 rounded-lg">
                        <Globe className="text-slate-600" size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">
                          Language
                        </p>
                        <p className="text-xs text-slate-500">
                          System default language
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary font-semibold text-xs">
                      English (US)
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Version Info */}
              <div className="flex justify-center pt-3">
                <p className="text-slate-400 text-xs">
                  ClassFlow Desktop Version 2.8.0 • Build 1042
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
