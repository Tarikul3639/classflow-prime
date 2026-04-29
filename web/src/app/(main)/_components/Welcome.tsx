import Link from "next/link";
import { User, Star } from "lucide-react";
import { useState } from "react";
import { APP_CONFIG } from "@/config/app-config";


// Helper function - time based greeting
function getGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= 4 && hour < 6) {
        return "Sunrise";
    } else if (hour >= 6 && hour < 12) {
        return "Good morning";
    } else if (hour >= 12 && hour < 14) {
        return "Good noon";
    } else if (hour >= 14 && hour < 16) {
        return "Good evening";
    }
    else if (hour >= 16 && hour < 18) {
        return "Good evening";
    } else if (hour >= 18 && hour < 20) {
        return "Sunset";
    } else if (hour >= 20 && hour < 24) {
        return "Good night";
    } else {
        return "Midnight";
    }
}

// Helper function - emoji based on time
function getGreetingEmoji(): string {
    const hour = new Date().getHours();

    if (hour >= 4 && hour < 6) {
        return "🌅"; // Sunrise
    } else if (hour >= 6 && hour < 12) {
        return "☀️"; // Morning
    } else if (hour >= 12 && hour < 15) {
        return "🌤️"; // Afternoon
    } else if (hour >= 15 && hour < 18) {
        return "🌇"; // Evening
    } else if (hour >= 18 && hour < 20) {
        return "🌆"; // Sunset
    } else if (hour >= 20 && hour < 24) {
        return "🌙"; // Night
    } else {
        return "🌌"; // Midnight
    }
}
import { WhatsNewDialog } from "@/components/ui/WhatsNewDialog";

const STORAGE_KEY = "classflow_whats_new_seen";

export default function Welcome({ user }: { user: any }) {
    const greeting = getGreeting();
    const emoji = getGreetingEmoji();

    const [showDialog, setShowDialog] = useState(false);

    // Check localStorage for unread updates -> Red dot showing on badge
    const hasUnread = typeof window !== "undefined"
        && localStorage.getItem(STORAGE_KEY) !== APP_CONFIG.version;

    return (
        <>
            <div className="px-4 sm:px-6 pt-5 pb-1">
                <div className="bg-primary rounded-2xl px-5 py-5 relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-5 -right-5 size-24 bg-white/5 rounded-full" />
                    <div className="absolute -bottom-8 right-8 size-20 bg-white/5 rounded-full" />

                    <div className="w-full flex items-center justify-between mb-1">
                        <p className="text-[11px] text-white/60 font-medium uppercase tracking-widest">
                            {greeting}
                        </p>

                        {/* ✅ What's New badge */}
                        <button
                            onClick={() => setShowDialog(true)}
                            className="relative inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/20 border border-white/20 rounded-full px-2 py-0.5 transition-colors cursor-pointer"
                        >
                            {/* Ping animation — always running */}
                            <span className="absolute inset-0 rounded-full animate-ping bg-white/10" />

                            <Star size={9} className="text-white relative z-10" fill="white" />
                            <span className="text-[10px] font-semibold text-white relative z-10">What's new</span>
                            {hasUnread && (
                                <span className="relative z-10 flex shrink-0">
                                    <span className="absolute inline-flex w-full h-full rounded-full bg-red-400 opacity-75 animate-ping" />
                                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                                </span>
                            )}
                        </button>
                    </div>

                    <h1 className="text-[22px] font-extrabold text-white leading-tight mb-2">
                        {user?.name} {emoji}
                    </h1>
                    <p className="text-[12px] text-white/70 leading-relaxed max-w-xs">
                        Stay on top of your classes, updates, and upcoming events today.
                    </p>

                    <Link href="profile" className="mt-4 inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/20 transition-colors text-white text-[11px] font-semibold px-3 py-1.5 rounded-full">
                        <User size={14} />
                        View Profile
                    </Link>
                </div>
            </div>

            <WhatsNewDialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
            />
        </>
    );
}