// components/ui/RichTextContent.tsx
import { cn } from "@/utils/clsx";

export const RICH_TEXT_STLYES = cn(
    // Base Styles (Max font set to 14px)
    "w-full outline-none text-slate-900 text-[12px] md:text-[13px] leading-relaxed",

    // Responsive Breaking & Wrapping
    "break-words overflow-wrap-anywhere whitespace-pre-wrap",

    // Headings (Scaled down to match 14px base)
    "[&_h1]:text-[13px] [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:my-2",
    "[&_h2]:text-[12px] [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:my-2",
    "[&_h3]:text-[11px] [&_h3]:font-semibold [&_h3]:text-slate-700 [&_h3]:my-1",

    // Text Formatting
    "[&_strong]:font-bold [&_b]:font-bold [&_em]:italic [&_i]:italic [&_u]:underline [&_s]:line-through",

    // Lists (Mobile optimized margins)
    "[&_ul]:list-disc [&_ul]:ml-4 md:[&_ul]:ml-5 [&_ul]:my-2",
    "[&_ol]:list-decimal [&_ol]:ml-4 md:[&_ol]:ml-5 [&_ol]:my-2",
    "[&_li]:my-0.5",

    // Blockquote & Code
    "[&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-3 [&_blockquote]:text-slate-500 [&_blockquote]:italic [&_blockquote]:my-2",
    "[&_code]:bg-slate-100 [&_code]:text-rose-500 [&_code]:text-[12px] [&_code]:font-mono [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded",

    // Links & Others
    "[&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-700 [&_a]:break-all",
    "[&_hr]:border-slate-100 [&_hr]:my-4",
    "[&_p]:mb-2 last:[&_p]:mb-0"
);

export function RichTextContent({ html, className = "" }: { html: string; className?: string }) {
    return (
        <div
            className={cn(RICH_TEXT_STLYES, className)}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}