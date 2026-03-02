import clsx from "clsx";
import { AlertCircle } from "lucide-react";

export const Input = ({
  label,
  description,
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
  error?: string;
  className?: string;
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] md:text-[11px] font-bold text-[#617789] uppercase tracking-wider">
        {label}
      </label>

      <input
        {...props}
        className={clsx(
          "w-full h-10 sm:h-11 px-4 lg:px-5 rounded-lg border bg-[#f8fafc] outline-none transition-all duration-200 text-[13px] md:text-sm focus:ring-2 focus:ring-offset-0 focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-red-500 bg-red-50/30 focus:border-red-600 ring-1 ring-red-100 focus:ring-red-400/30 focus-visible:ring-red-400/30"
            : "border-[#dbe1e6] focus:border-primary focus:ring-primary/30 focus-visible:ring-primary/30",
          className,
        )}
      />

      {/* Error & Description Section */}
      <div className="min-h-4">
        {" "}
        {/* Prevents layout jumping */}
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
