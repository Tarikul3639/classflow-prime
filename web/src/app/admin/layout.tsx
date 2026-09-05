"use client";

import AdminSidebar from "@/components/layout/sidebar/AdminSidebar";
import { Loader } from "@/components/ui/Loader";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usePushNotification } from "@/hooks/usePushNotification";
import { meThunk } from "@/store/features/profile/thunks/fetch-user.thunk";

function BottomNavbar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      {/* Bottom navbar content */}
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const dispatch = useAppDispatch();
  const { loading, isFetched } = useAppSelector((state) => state.profile.fetchUser.status);
  const userId = useAppSelector((state) => state.profile.fetchUser.user?._id);

  // ── Push notification subscription ──────────────────────
  usePushNotification(userId ?? null);

  // On mount, fetch current user if not already authenticated
  useEffect(() => {
    dispatch(meThunk())
      .unwrap()
      .then((res) => {
        // if (res?.name) {
        //   toast.success(`Welcome back, ${res.name}!`, {
        //     position: "top-center",
        //   });
        // }
      })
      .catch((err) => {
        toast.error("Failed to fetch user data", {
          description: err,
          position: "top-center",
        }); // DEBUG: Show error message if fetch fails
      });
  }, [dispatch]);

  if (loading || !isFetched) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Mobile Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}