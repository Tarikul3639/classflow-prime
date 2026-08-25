"use client";

import React from "react";
import {
    MessageCircle,
    Send,
    ChevronDown,
    Trash2,
    EllipsisVertical,
} from "lucide-react";

import { formatRelativeDate } from "@/utils/date.utils";
import type { Comments } from "@/types/update.types";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UpdateCommentsProps {
    updateId: string;
    comments?: Comments[];
    currentUserName?: string;
    onAddComment?: (updateId: string, message: string) => void;
    onDeleteComment?: (updateId: string, commentId: string) => void;
}

export default function UpdateComments({
    updateId,
    comments = [],
    onAddComment,
    onDeleteComment,
}: UpdateCommentsProps) {
    const [showComments, setShowComments] = React.useState(false);
    const [commentText, setCommentText] = React.useState("");

    const handleSubmit = () => {
        const message = commentText.trim();

        if (!message) return;

        onAddComment?.(updateId, message);
        setCommentText("");
    };

    return (
        <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/50">
            {/* Toggle */}
            <button
                type="button"
                onClick={() => setShowComments((prev) => !prev)}
                className="flex items-center gap-1.5 pl-1 pr-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 bg-white shadow-sm hover:text-primary transition-colors cursor-pointer"
            >
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <MessageCircle className="size-3.5" />
                </span>

                {comments.length > 0 ? (
                    <span className="text-slate-400">
                        {comments.length} comments
                    </span>
                ) : (
                    <span className="text-slate-400">Add a comment</span>
                )}

                <ChevronDown
                    className={`size-3.5 text-slate-400 transition-transform duration-200 ${showComments ? "rotate-180" : ""
                        }`}
                />
            </button>

            {showComments && (
                <div className="mt-3 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    {/* Comment List */}
                    {comments.length > 0 && (
                        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                            {comments.map((comment) => (
                                <div
                                    key={comment._id}
                                    className="flex items-start gap-2.5"
                                >
                                    <Avatar className="w-8 h-8 shrink-0 ring-1 ring-white">
                                        <AvatarImage
                                            src={comment.avatarUrl}
                                            alt={comment.name}
                                        />

                                        <AvatarFallback className="text-[11px] font-bold text-slate-500">
                                            {comment.name
                                                .split(" ")
                                                .map((name) => name[0])
                                                .join("")
                                                .slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                                                    <p className="text-xs font-bold text-slate-800">
                                                        {comment.name}
                                                    </p>

                                                    <p className="text-sm text-slate-600 break-words leading-snug mt-0.5">
                                                        {comment.message}
                                                    </p>
                                                </div>

                                                <span className="text-[10px] text-slate-400 ml-2 mt-1 inline-block">
                                                    {formatRelativeDate(comment.createdAt, {
                                                        showTime: false,
                                                        showYear: false,
                                                        relativeDaysLimit: 3,
                                                        showTimeAfterLimit: false,
                                                    })}
                                                </span>
                                            </div>

                                            {/* Owner Actions */}
                                            {comment.isOwner && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button
                                                            type="button"
                                                            className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                                                            aria-label="Comment actions"
                                                        >
                                                            <EllipsisVertical className="size-4" />
                                                        </button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-36 rounded-lg border border-slate-200 bg-white shadow-md p-1.5"
                                                    >
                                                        <DropdownMenuLabel className="text-xs text-slate-400">
                                                            Comment Actions
                                                        </DropdownMenuLabel>

                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                onDeleteComment?.(updateId, comment._id)
                                                            }
                                                            className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                            <span>Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Comment */}
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full pl-4 pr-1.5 py-1.5 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSubmit();
                                }
                            }}
                            placeholder="Write a comment..."
                            className="flex-1 h-8 bg-transparent text-sm outline-none placeholder:text-slate-400"
                        />

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!commentText.trim()}
                            className="w-8 h-8 shrink-0 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all"
                            aria-label="Post comment"
                        >
                            <Send className="size-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}