"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bot, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { IAgent, IAgentScopes } from "@/store/features/agent/agent.types";
import { updateAgentThunk } from "@/store/features/agent/thunks/update-agent.thunk";

interface Props {
    agent: IAgent;
}

export default function UpdateAgentDialog({ agent }: Props) {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.agent.updateAgent.status);

    const rawClasses = useAppSelector((state) =>
        state.agent.fetchAgents.agents.flatMap((agent) => agent.classList || [])
    );
    const classes = useMemo(
        () => Array.from(new Map(rawClasses.map((c) => [c._id, c])).values()),
        [rawClasses]
    );

    const [open, setOpen] = useState(false);
    const [name, setName] = useState(agent.name);
    const [expiresAt, setExpiresAt] = useState(agent.expiresAt ?? "");
    const [scopes, setScopes] = useState<IAgentScopes>(agent.scopes);
    const [allowedClassIds, setAllowedClassIds] = useState<string[]>(
        agent.classList.filter((cls) => cls.allowed).map((cls) => cls._id)
    );

    useEffect(() => {
        if (open) {
            setName(agent.name);
            setExpiresAt(agent.expiresAt ?? "");
            setScopes(agent.scopes);
            setAllowedClassIds(agent.classList.filter((cls) => cls.allowed).map((cls) => cls._id));
        }
    }, [open, agent]);

    const handleUpdate = () => {
        if (!name.trim()) {
            toast.error("Agent name is required");
            return;
        }

        const promise = dispatch(
            updateAgentThunk({
                agentId: agent._id,
                body: { name, scopes, allowedClassIds, expiresAt: expiresAt || undefined },
            })
        ).unwrap();

        toast.promise(promise, {
            loading: "Updating agent...",
            success: (res) => {
                setOpen(false);
                return res.message;
            },
            error: (err) => err,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full flex justify-start text-sm text-gray-700 hover:bg-slate-100 rounded-sm cursor-pointer">
                    <Pencil className="size-3.5" />
                    Edit Settings
                </Button>
            </DialogTrigger>
            {/*  */}
            <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] flex flex-col rounded-2xl p-0 overflow-hidden border border-slate-200">
                <DialogHeader className="px-5 pt-5 pb-4 border-b border-slate-200 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Bot className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-semibold">Edit Agent</DialogTitle>
                            <DialogDescription className="text-xs">
                                Manage permissions and class access
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="px-5 py-5 space-y-5 flex-1 overflow-y-auto">
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-2 h-10 w-full rounded-sm border border-slate-300 px-3 text-sm outline-none focus:border-primary cursor-pointer"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Permissions</label>
                        <div className="flex flex-wrap gap-5 mt-3">
                            {Object.keys(scopes).map((scope) => {
                                const key = scope as keyof IAgentScopes;

                                return (
                                    <label key={scope} className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={scopes[key]}
                                            onChange={(e) =>
                                                setScopes((prev) => ({ ...prev, [key]: e.target.checked }))
                                            }
                                            className="h-4 w-4 accent-primary cursor-pointer"
                                        />
                                        <span className="capitalize">{scope}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Allowed Classes</label>
                        <ScrollArea className="h-40 mt-3 rounded-sm border border-slate-300">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-semibold text-slate-700">Class Name</th>
                                        <th className="px-3 py-2 text-right font-semibold text-slate-700">Access</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {classes.map((cls) => (
                                        <tr key={cls._id} className="hover:bg-slate-50">
                                            <td className="px-3 py-2 truncate text-slate-700">{cls.name}</td>
                                            <td className="px-3 py-2 text-right">
                                                <input
                                                    type="checkbox"
                                                    checked={allowedClassIds.includes(cls._id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setAllowedClassIds((prev) => [...prev, cls._id]);
                                                        } else {
                                                            setAllowedClassIds((prev) => prev.filter((id) => id !== cls._id));
                                                        }
                                                    }}
                                                    className="h-4 w-4 accent-primary cursor-pointer"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </ScrollArea>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Expire At</label>
                        <input
                            type="datetime-local"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="mt-2 h-10 w-full rounded-sm border border-slate-300 px-3 text-sm outline-none focus:border-primary cursor-pointer uppercase"
                        />
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="w-full flex flex-row justify-end px-5 py-4 border-t border-slate-200 shrink-0 gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="border-slate-300 hover:bg-slate-100 cursor-pointer rounded-sm"
                    >
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleUpdate} disabled={loading} className="cursor-pointer rounded-sm">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 size-3.5 animate-spin" />
                                Saving
                            </>
                        ) : (
                            "Save"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}