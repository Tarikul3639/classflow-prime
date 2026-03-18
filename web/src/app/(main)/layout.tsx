"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import { BottomNavbar } from "@/components/layout/navbar/BottomNav";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { meThunk } from "@/redux/slices/profile/thunks/user.thunk";
import { Loader } from "@/components/ui/Loader";
import { toast } from "sonner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.profile.user.status);

  // On mount, fetch current user if not already authenticated
  useEffect(() => {
    dispatch(meThunk())
      .unwrap()
      .then(() => {})
      .catch((err) => {
        toast.error("Failed to fetch user data", {
          description: err,
          position: "top-center",
        }); // DEBUG: Show error message if fetch fails
      });
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Mobile Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}
