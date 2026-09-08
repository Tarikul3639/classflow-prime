"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import AdminSidebar from "@/components/layout/sidebar/AdminSidebar";
import AdminNavbar from "@/components/layout/navbar/AdminNavbar";
import AdminBottomNavbar from "@/components/layout/navbar/AdminBottomNavbar";
import { Loader } from "@/components/ui/Loader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { meThunk } from "@/store/features/profile/thunks/fetch-user.thunk";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  const { loading, isFetched } = useAppSelector(
    (state) => state.profile.fetchUser.status,
  );

  useEffect(() => {
    dispatch(meThunk())
      .unwrap()
      .catch((err) => {
        toast.error("Failed to fetch user data", {
          description: err,
          position: "top-center",
        });
      });
  }, [dispatch]);

  if (loading || !isFetched) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Navbar */}
      <AdminNavbar />

      {/* Main Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="min-w-0 flex-1 px-4 py-6 pb-24 lg:px-6 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navbar */}
      <AdminBottomNavbar />
    </div>
  );
}