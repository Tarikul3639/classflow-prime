"use client";

import React from "react";

export function AgentCardSkeleton() {
    return (
        <article className="overflow-hidden rounded-sm border border-slate-200 bg-white">
            <div className="p-4 sm:p-5 animate-pulse">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3 min-w-0">
                        <div className="h-11 w-11 shrink-0 rounded-sm border border-slate-200 bg-slate-200" />

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="h-4 w-32 rounded bg-slate-200" />
                                <div className="h-5 w-16 rounded-sm bg-slate-200" />
                                <div className="h-5 w-14 rounded-sm bg-slate-200" />
                                <div className="h-5 w-14 rounded-sm bg-slate-200" />
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                <div className="h-6 w-56 rounded-sm bg-slate-200" />
                                <div className="h-6 w-44 rounded-sm bg-slate-200" />
                                <div className="h-6 w-36 rounded-sm bg-slate-200" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <div className="h-8 w-20 rounded-sm bg-slate-200" />
                        <div className="h-8 w-8 rounded-sm bg-slate-200" />
                    </div>
                </div>

                {/* Hidden Details */}
                <div className="hidden mt-4 gap-3 rounded-sm border border-slate-200 bg-slate-50 p-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-sm border border-slate-200 bg-white p-3">
                            <div className="h-3 w-12 rounded bg-slate-200" />
                            <div className="mt-2 h-4 w-36 rounded bg-slate-200" />
                            <div className="mt-2 h-3 w-28 rounded bg-slate-200" />
                        </div>

                        <div className="rounded-sm border border-slate-200 bg-white p-3">
                            <div className="h-3 w-24 rounded bg-slate-200" />
                            <div className="mt-2 flex flex-wrap gap-2">
                                <div className="h-5 w-16 rounded-sm bg-slate-200" />
                                <div className="h-5 w-20 rounded-sm bg-slate-200" />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-3">
                        <div className="rounded-sm border border-slate-200 bg-white p-3">
                            <div className="h-3 w-14 rounded bg-slate-200" />
                            <div className="mt-2 flex items-center justify-between gap-3">
                                <div className="h-4 w-24 rounded bg-slate-200" />
                                <div className="h-8 w-8 rounded-sm bg-slate-200" />
                            </div>
                        </div>

                        <div className="rounded-sm border border-slate-200 bg-white p-3">
                            <div className="h-3 w-16 rounded bg-slate-200" />
                            <div className="mt-2 h-4 w-28 rounded bg-slate-200" />
                        </div>

                        <div className="rounded-sm border border-slate-200 bg-white p-3">
                            <div className="h-3 w-16 rounded bg-slate-200" />
                            <div className="mt-2 h-4 w-28 rounded bg-slate-200" />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function AgentListSkeleton() {
    return (
        <section className="rounded-sm border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div className="animate-pulse">
                    <div className="h-4 w-24 rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-56 rounded bg-slate-200" />
                </div>

                <div className="hidden sm:flex items-center gap-2 rounded-sm border border-slate-200 bg-slate-50 px-3 py-1">
                    <div className="h-3 w-8 rounded bg-slate-200" />
                    <div className="h-3 w-10 rounded bg-slate-200" />
                </div>
            </div>

            <div className="p-4 sm:p-5 grid gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <AgentCardSkeleton key={i} />
                ))}
            </div>
        </section>
    );
}