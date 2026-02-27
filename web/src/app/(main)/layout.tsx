import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import { BottomNavbar } from "@/components/layout/navbar/bottom/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Mobile Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}