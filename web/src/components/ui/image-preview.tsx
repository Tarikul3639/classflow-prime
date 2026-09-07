"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImagePreviewProps {
    src: string;
    alt: string;

    width?: number;
    height?: number;

    className?: string;
    previewClassName?: string;
}

export function ImagePreview({
    src,
    alt,

    width = 56,
    height = 56,

    className = "",
    previewClassName = "",
}: ImagePreviewProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Thumbnail */}
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                unoptimized
                onClick={() => setIsOpen(true)}
                className={`cursor-pointer transition-opacity hover:opacity-80 ${className}`}
            />

            {/* Image Preview Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative h-[85vh] w-[90vw]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="absolute -right-2 -top-2 z-10 flex su size-8 sm:size-9 items-center justify-center rounded-full bg-white text-black shadow-md transition hover:bg-gray-100 cursor-pointer"
                            aria-label="Close image preview"
                        >
                            <X className="size-4 sm:size-5" />
                        </button>

                        {/* Preview Image */}
                        <Image
                            src={src}
                            alt={alt}
                            unoptimized
                            fill
                            sizes="90vw"
                            className={`object-contain ${previewClassName}`}
                        />
                    </div>
                </div>
            )}
        </>
    );
}