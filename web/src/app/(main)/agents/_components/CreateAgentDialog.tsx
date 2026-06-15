"use client";

import React, { useState, useMemo } from "react";
import { Bot, Shield, Calendar, Loader2, Plus, GraduationCap } from "lucide-react";
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
import { IAgentScopes } from "@/store/features/agent/agent.types";
import { createAgentThunk } from "@/store/features/agent/thunks/create-agent.thunk";

export default function CreateAgentDialog() {
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.agent.createAgent.status);
    
    const rawClasses = useAppSelector((state) => 
        state.agent.fetchAgents.agents.flatMap((agent) => agent.classList || [])
    );
    const classes = useMemo(() => {
        return Array.from(new Map(rawClasses.map(c => [c._id, c])).values());
    }, [rawClasses]);

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [scopes, setScopes] = useState<IAgentScopes>({
        create: false,
        update: false,
        delete: false,
    });
    const [allowedClassIds, setAllowedClassIds] = useState<string[]>([]);

    const handleCreate = async () => {
        if (!name.trim()) {
            toast.error("Agent name is required");
            return;
        }

        const promise = dispatch(
            createAgentThunk({
                name,
                scopes,
                allowedClassIds,
                expiresAt: expiresAt || undefined,
            })
        ).unwrap();

        toast.promise(promise, {
            loading: "Creating agent...",
            success: (res) => {
                setOpen(false);
                setName("");
                setExpiresAt("");
                setScopes({ create: false, update: false, delete: false });
                setAllowedClassIds([]);
                return `${res.data.agent.name} created`;
            },
            error: (err) => err,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-sm cursor-pointer">
                    <Plus className="size-4" />
                    New <span className="-ml-1 hidden sm:inline">Agent</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] flex flex-col rounded-2xl p-0 overflow-hidden border border-slate-200">
                <DialogHeader className="px-5 pt-5 pb-4 border-b border-slate-200 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Bot className="size-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-semibold">Create Agent</DialogTitle>
                            <DialogDescription className="text-xs">
                                Configure a new AI agent access.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="px-5 py-5 space-y-5 flex-1 overflow-y-auto">
                    {/* Name */}
                    <div>
                        <label className="text-sm font-medium">Agent Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Hermes"
                            className="mt-2 h-10 w-full rounded-sm border border-slate-300 px-3 text-sm outline-none focus:border-primary"
                        />
                    </div>

                    {/* Scopes */}
                    <div>
                        <label className="text-sm font-medium">Permissions</label>
                        <div className="flex flex-wrap gap-5 mt-3">
                            {(["create", "update", "delete"] as const).map((s) => (
                                <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={scopes[s]}
                                        onChange={(e) => setScopes((prev) => ({ ...prev, [s]: e.target.checked }))}
                                        className="h-4 w-4 accent-primary cursor-pointer"
                                    />
                                    <span className="capitalize">{s}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Classes Table */}
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
                                                        if (e.target.checked) setAllowedClassIds((prev) => [...prev, cls._id]);
                                                        else setAllowedClassIds((prev) => prev.filter((id) => id !== cls._id));
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

                    {/* Expire */}
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

                <DialogFooter className="w-full flex flex-row justify-end px-5 py-4 border-t border-slate-200 shrink-0 gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} className="border-slate-300 hover:bg-slate-100 cursor-pointer rounded-sm">
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={loading} className="cursor-pointer rounded-sm">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 size-3.5 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Agent"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}