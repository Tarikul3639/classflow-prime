import { CalendarDays } from 'lucide-react';

export default function DashboardHeader() {
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString(
        'en-US',
        {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        },
    );

    return (
        <div className="mb-7 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Left */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Overview of your ClassFlow Prime platform.
                </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="size-4" />

                <span>{formattedDate}</span>
            </div>
        </div>
    );
}