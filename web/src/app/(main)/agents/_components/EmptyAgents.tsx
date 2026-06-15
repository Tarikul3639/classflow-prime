"use client";

import React from "react";
import { Bot } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function EmptyAgents() {
    return (
        <div className="flex items-center justify-center py-20">
            <EmptyState
                icon={Bot}
                title="No Agents Found"
                description="Create your first AI agent to automate class updates and connect external AI services."
                actionLabel="Create Agent"
            />
        </div>
    );
}