"use client";

import React from "react";
import { Bot, KeyRound, MoreVertical, Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IAgent } from "@/store/features/agent/agent.types";
import UpdateAgentDialog from "./UpdateAgentDialog";
import DeleteAgentDialog from "./DeleteAgentDialog";

interface Props {
    agent: IAgent;
}

export default function AgentCard({ agent }: Props) {
    const copyApiKey = async () => {
        await navigator.clipboard.writeText(agent.apiKeyPrefix);
        toast.success("API key prefix copied");
    };

    const activeScopes = Object.entries(agent.scopes || {})
        .filter(([_, value]) => value === true)
        .map(([key]) => key);

    return (
        <div className="group bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* Left Side: Info */}
                <div className="flex gap-4 min-w-0">
                    <div className="shrink-0 h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 text-primary flex items-center justify-center">
                        <Bot className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">
                            {agent.name}
                        </h3>
                        
                        {/* API Key */}
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">
                            <KeyRound className="size-3 text-slate-400" />
                            <span className="text-[11px] font-mono text-slate-600">
                                {agent.apiKeyPrefix}
                            </span>
                        </div>

                        {/* Scopes & Status (Mobile friendly) */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            <Badge variant="secondary" className="rounded-md text-[10px] font-medium capitalize h-5">
                                {agent.status}
                            </Badge>
                            {activeScopes.map((scope) => (
                                <Badge key={scope} variant="outline" className="rounded-md text-[10px] font-medium capitalize h-5">
                                    {scope}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md cursor-pointer">
                                <MoreVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-lg border-slate-200 p-1">
                            <DropdownMenuItem onClick={copyApiKey} className="text-sm cursor-pointer">
                                <Copy className="size-3.5" />
                                Copy API Key
                            </DropdownMenuItem>
                            <UpdateAgentDialog agent={agent} />
                            <DeleteAgentDialog agentId={agent._id} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Classes (Bottom full width) */}
            {agent.classList?.filter(c => c.allowed).length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-2">Allowed Classes</p>
                    <div className="flex flex-wrap gap-1.5">
                        {agent.classList
                            .filter((cls) => cls.allowed)
                            .slice(0, 4)
                            .map((cls) => (
                                <span key={cls._id} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                                    {cls.name}
                                </span>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}