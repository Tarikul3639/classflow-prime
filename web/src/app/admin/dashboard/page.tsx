"use client";

import DashboardHeader from "./components/dashboard-header";
import DashboardStatCard from "./components/dashboard-stat-card";
import UserGrowthChart from "./components/user-growth-chart";
import UserVerificationCard from "./components/user-verification-card";
import RecentUsers from "./components/recent-users";
import RecentClasses from "./components/recent-classes";

import { useGetAdminDashboardQuery } from "@/store/services/admin-dashboard.api";

export default function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
  } = useGetAdminDashboardQuery({
    recentUsersLimit: 6,
    recentClassesLimit: 5,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500">
          Failed to load dashboard data. Please try again later.
        </p>
      </div>
    );
  }

  // console.log("Admin Dashboard Data:", data); // DEBUG: Log the fetched dashboard data

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Statistics */}
      <section className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-4 lg:grid-cols-5">
        <DashboardStatCard
          title="Total Users"
          value={data?.stats?.totalUsers ?? "0"}
          description="All registered users"
        />

        <DashboardStatCard
          title="Total Classes"
          value={data?.stats?.totalClasses ?? "0"}
          description="All available classes"
        />

        <DashboardStatCard
          title="Total Faculty"
          value={data?.stats?.totalFaculty ?? "0"}
          description="Verified accounts"
        />

        <DashboardStatCard
          title="Total Agents"
          value={data?.stats?.totalAgents ?? "0"}
          description="Awaiting verification"
        />

        <DashboardStatCard
          title="Active Classes"
          value={data?.stats?.activeClasses ?? "0"}
          description="Currently running classes"
        />

        <DashboardStatCard
          title="Active Agents"
          value={data?.stats?.activeAgents ?? "0"}
          description="Agents currently active"
        />

        <DashboardStatCard
          title="Total Enrollments"
          value={data?.stats?.totalEnrollments ?? "0"}
          description="All enrollments in classes"
        />
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UserGrowthChart data={data?.userStatistics}/>
        </div>

        <UserVerificationCard
          verified={data?.userVerification?.verified ?? 0}
          unverified={data?.userVerification?.unverified ?? 0}
        />
      </section>

      {/* Recent Data */}
      <section className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <RecentUsers
          users={data?.recentUsers ?? []}
        />

        <RecentClasses
          classes={data?.recentClasses ?? []}
        />
      </section>
    </div>
  );
}