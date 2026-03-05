import clsx from "clsx";
import { AlertCircle } from "lucide-react";

export const Input = ({
  label,
  description,
  error,
  className,
  icon: Icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
  error?: string;
  className?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] md:text-[11px] font-bold text-[#617789] uppercase tracking-wider">
        {label}
      </label>

      {/* Input Wrapper */}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="size-4 md:size-4.5" />
          </div>
        )}

        <input
          {...props}
          className={clsx(
            "w-full h-10 sm:h-11 rounded-lg border bg-[#f8fafc] outline-none transition-all duration-200 text-[13px] md:text-sm focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            Icon ? "pl-10 pr-4 lg:pr-5" : "px-4 lg:px-5",
            error
              ? "border-red-500 bg-red-50/30 focus:border-red-600 ring-1 ring-red-100 focus:ring-red-400/30"
              : "border-[#dbe1e6] focus:border-primary focus:ring-primary/30",
            className,
          )}
        />
      </div>

      {/* Error & Description */}
      <div className="min-h-0">
        {error ? (
          <div className="flex items-center gap-1 mt-1 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={12} className="text-red-500 shrink-0" />
            <p className="text-red-500 font-medium text-[11px] md:text-xs">
              {error}
            </p>
          </div>
        ) : description ? (
          <p className="text-[#617789] text-[11px] md:text-xs mt-1 italic opacity-80">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
};
