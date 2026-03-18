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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const ProfileSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((state) => state.profile.user); // Assuming user data is stored here

  const [userForm, setUserForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "White space for bio...",
    avatar: user?.avatarUrl || "",
  });

  const [initialUserForm] = useState(userForm); // comparison purpose

  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
  });

  const isChanged = Object.keys(userForm).some(
    (key) =>
      userForm[key as keyof typeof userForm] !==
      initialUserForm[key as keyof typeof userForm],
  );

  const handleChange = (field: keyof typeof userForm, value: string) => {
    setUserForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!isChanged) return console.log("No changes to save");
    console.log("Saving changes...", { ...userForm, ...preferences });
  };

  const handleToggle = (field: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleLogout = () => {
    console.log("Logging out...");
  }

  const handleLanguageSettings = () => {
    console.log("Opening language settings...");
  }

  const handleAvatarChange = (url: string) => {
    setUserForm((prev) => ({ ...prev, avatar: url }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <ProfileHeader onSave={handleSave} isChanged={isChanged} />

      <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">
        <div className="mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <ProfilePicture
                  imageUrl={userForm.avatar}
                  name={userForm.name}
                  role="We are working on it..."
                  email={userForm.email}
                  onEdit={() => {
                    const newAvatarUrl = prompt(
                      "Enter new avatar URL",
                      userForm.avatar,
                    );
                    if (newAvatarUrl) {
                      handleAvatarChange(newAvatarUrl);
                    }
                  }}
                />

                <PersonalInformation
                  name={userForm.name}
                  email={userForm.email}
                  bio={userForm.bio}
                  onNameChange={(value) => handleChange("name", value)}
                  onBioChange={(value) => handleChange("bio", value)}
                />

                <LogoutButton onLogout={handleLogout} />
              </div>
            </div>

            {/* Right Column - Classes & Preferences */}
            <div className="lg:col-span-7 space-y-5">
              <JoinedClasses />

              <Preferences
                notifications={preferences.notifications}
                darkMode={preferences.darkMode}
                onNotificationsToggle={() => handleToggle("notifications")}
                onDarkModeToggle={() => handleToggle("darkMode")}
                onLanguageClick={handleLanguageSettings}
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
