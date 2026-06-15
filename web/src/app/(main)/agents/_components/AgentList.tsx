"use client";

import React from "react";
import type { IAgent } from "@/store/features/agent/agent.types";
import AgentCard from "./AgentCard";

interface Props {
    agents: IAgent[];
}

export default function AgentList({ agents }: Props) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-base font-bold text-slate-900 mb-5">
                Agents
            </h3>
            <div className="space-y-4">
                {agents.map((agent) => (
                    <AgentCard key={agent._id} agent={agent} />
                ))}
            </div>
        </div>
    );
}