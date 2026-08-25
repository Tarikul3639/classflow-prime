"use client";

import { type LucideIcon, CalendarClock, Paperclip } from "lucide-react";
import UpdateActionMenu from "./UpdateActionMenu";
import UpdateMaterial from "./UpdateMaterials";
import UpdateComments from "./UpdateComments";
import type {
  Material,
  PostedBy,
  UpdateEngagement,
  Comments,
} from "@/types/update.types";
import { formatRelativeDate } from "@/utils/date.utils";
import { RichTextContent } from "@/components/ui/RichTextContent";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UpdateCardProps {
  updateId: string;
  isAdmin?: boolean;
  isPast?: boolean;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  title: string;
  description: string;
  eventAt?: string;
  materials?: Material[];
  engagement?: UpdateEngagement;
  postedBy?: PostedBy;
  comments?: Comments[];
  isPinned?: boolean;
  createdAt: string;
  updatedAt?: string;
  onTogglePin?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;

  // Comments handlers
  onAddComment?: (updateId: string, message: string) => void;
  onDeleteComment?: (updateId: string, commentId: string) => void;
}

export default function UpdateCard({
  isAdmin = false,
  updateId,
  isPast = false,
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  eventAt,
  materials,
  postedBy,
  comments,
  isPinned,
  createdAt,
  updatedAt,
  onCopy,
  onTogglePin,
  onEdit,
  onDelete,

  // Comments handlers
  onAddComment,
  onDeleteComment,
}: UpdateCardProps) {
  return (
    <article
      id={updateId}
      className={`bg-white rounded-xl shadow-sm border border-slate-100 transition-all overflow-hidden ${isPast ? "opacity-100 hover:opacity-90" : "hover:shadow-md"
        }`}
    >
      {/* ── Header: who + when + actions ───────────────────────── */}
      <div className="flex justify-between items-start gap-2 p-4 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            className={`w-10 h-10 shrink-0 rounded-full ${iconBg} flex items-center justify-center ${iconColor}`}
          >
            <AvatarImage
              src={postedBy?.avatarUrl ?? "/default-avatar.png"}
              alt="icon"
            />
            <AvatarFallback className="text-xs font-bold text-slate-500">
              {postedBy?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {postedBy?.name}
              </h4>
              {isPinned && (
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                  Pinned
                </span>
              )}
            </div>

            <div className="text-slate-400 text-xs">
              {updatedAt && updatedAt !== createdAt ? (
                <span>
                  Updated{" "}
                  {formatRelativeDate(updatedAt, {
                    showTime: true,
                    showYear: false,
                    relativeDaysLimit: 3,
                    showTimeAfterLimit: false,
                  })}
                </span>
              ) : (
                <span>
                  {formatRelativeDate(createdAt, {
                    showTime: true,
                    showYear: false,
                    relativeDaysLimit: 3,
                    showTimeAfterLimit: false,
                  })}
                </span>
              )}
            </div>
          </div>
        </div>

        <UpdateActionMenu
          isAdmin={isAdmin}
          isPinned={isPinned}
          onTogglePin={onTogglePin}
          onEdit={onEdit}
          onDelete={onDelete}
          onCopy={onCopy}
        />
      </div>

      <div className="px-4 pb-4 flex flex-col gap-3">
        {/* ── Title + Event time — grouped together ─────────────── */}
        {(title || eventAt) && (
          <div className="flex flex-col gap-1.5">
            {title && (
              <h3 className="text-lg font-bold text-slate-900 leading-snug">
                {title}
              </h3>
            )}
            {eventAt && (
              <div className="flex items-center gap-1.5 text-blue-600 text-[13px] md:text-sm font-semibold bg-blue-50 w-fit px-2.5 py-1 rounded-md capitalize">
                <CalendarClock className="size-4 md:size-4.5 mt-[0.5px]" />
                <span>
                  {formatRelativeDate(eventAt, {
                    showTime: true,
                    showYear: false,
                    relativeDaysLimit: 0,
                  })}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Description — its own box ─────────────────────────── */}
        {description && (
          <div className="bg-slate-50 border border-slate-100 rounded-lg px-3.5 py-3 text-slate-600">
            <RichTextContent html={description} />
          </div>
        )}

        {/* ── Attachments — its own box ──────────────────────────── */}
        {materials && materials.length > 0 && (
          <div className="border border-slate-100 rounded-lg px-3.5 py-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              <Paperclip className="size-3" />
              <span>
                {materials.length}{" "}
                {materials.length === 1 ? "Attachment" : "Attachments"}
              </span>
            </div>
            <div className="space-y-2">
              {materials.map((att) => (
                <UpdateMaterial key={att._id} material={att} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Comments — extracted component ─────────────────────── */}
      <UpdateComments
        updateId={updateId}
        comments={comments}
        onAddComment={onAddComment}
        onDeleteComment={onDeleteComment}
      />
    </article>
  );
}
