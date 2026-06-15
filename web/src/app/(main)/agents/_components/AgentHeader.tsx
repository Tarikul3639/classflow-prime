"use client";

import React from "react";
import { Bot } from "lucide-react";

interface Props {
    children?: React.ReactNode;
}

export default function AgentHeader({ children }: Props) {
    return (
        <header className="sticky top-0 bg-slate-50 pb-4 pt-4 px-4 lg:px-8 border-b border-slate-200 z-50">
            <div className="flex items-center gap-3 mx-auto">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Bot className="size-5.5" />
                </div>

                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">
                        Agent Settings
                    </h1>
                    <p className="text-slate-500 text-xs truncate">
                        Manage AI agents and API keys.
                    </p>
                </div>

                {children && (
                    <div className="ml-auto shrink-0">
                        {children}
                    </div>
                )}
            </div>
        </header>
    );
}