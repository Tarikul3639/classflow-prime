"use client";

import React, { useState } from "react";
// Import form ./_components
import ProfileHeader from "./_components/ProfileHeader";
import ProfilePicture from "./_components/ProfilePicture";
import PersonalInformation from "./_components/PersonalInformation";
import LogoutButton from "./_components/LogoutButton";
import JoinedClasses from "./_components/JoinedClasses";
import Preferences from "./_components/Preferences";
import VersionInfo from "./_components/VersionInfo";

const ProfileSettings: React.FC = () => {
  const [fullName, setFullName] = useState("Alex Johnson");
  const [email, setEmail] = useState("alex.johnson@classflow.edu");
  const [bio, setBio] = useState(
    "Computer Science major with a passion for AI and machine learning. Looking forward to graduate research.",
  );
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    console.log("Saving changes...", {
      fullName,
      bio,
      notifications,
      darkMode,
    });
  };

  const handleEditPicture = () => {
    console.log("Edit picture clicked");
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleManageClasses = () => {
    console.log("Manage all classes clicked");
  };

  const handleLanguageClick = () => {
    console.log("Language settings clicked");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <ProfileHeader onSave={handleSave} />

      <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">
        <div className="mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <ProfilePicture
                  imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBfpo-xwmdOuSDI11UFt6Uo-zfOAy0Arx84Ltb0WBcuo7hd6utRBeV68VO53qJ2K_2wLk79hF5M0zFDzC_0OVL8mkdBPcvkIWi4f5DA-obHsl5ApQ9Y9n2aDJmfy-TJOvmTvNmQCSqayLMtIrc0LYIiilkEyWdjn_HnZPOSXzqB1c7x69bka7oB3xaF-RmiadEcUbY4C9MPWnu6UgasrRPBIkkbv0G9ejPS6E399yybBWRW2TtyMPZd7_-yOmvsBZ2KuGhtRJl1R7nO"
                  name="Alex Johnson"
                  role="Student • Sophomore Year"
                  email={email}
                  onEdit={handleEditPicture}
                />

                <PersonalInformation
                  fullName={fullName}
                  email={email}
                  bio={bio}
                  onFullNameChange={setFullName}
                  onBioChange={setBio}
                />

                <LogoutButton onLogout={handleLogout} />
              </div>
            </div>

            {/* Right Column - Classes & Preferences */}
            <div className="lg:col-span-7 space-y-5">
              <JoinedClasses onManageAll={handleManageClasses} />

              <Preferences
                notifications={notifications}
                darkMode={darkMode}
                onNotificationsToggle={() => setNotifications(!notifications)}
                onDarkModeToggle={() => setDarkMode(!darkMode)}
                onLanguageClick={handleLanguageClick}
              />

              <VersionInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
