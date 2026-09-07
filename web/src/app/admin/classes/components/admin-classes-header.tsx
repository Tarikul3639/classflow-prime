import { BookOpen } from "lucide-react";

export function AdminClassesHeader() {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
            {" "}
            <div className="flex items-start gap-3">
                {" "}
                <div className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-border bg-muted">
                    {" "}
                    <BookOpen className="size-5 text-muted-foreground" />{" "}
                </div>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Classes Management
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage and monitor all classes, members, enrollment, and class
                        status.
                    </p>
                </div>
            </div>
        </div>
    );
}
