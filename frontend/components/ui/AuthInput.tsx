import type { InputHTMLAttributes, ReactNode } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  errorText?: string;
  rightAdornment?: ReactNode;
  onRightAdornmentClick?: () => void;
}

export default function AuthInput({
  label,
  helperText,
  errorText,
  rightAdornment,
  onRightAdornmentClick,
  className,
  ...props
}: AuthInputProps) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </span>
      <span className="relative block">
        <input
          {...props}
          aria-invalid={Boolean(errorText)}
          className={[
            "h-12 w-full rounded-xl border bg-slate-800/70 px-4 pr-11 text-base text-slate-100 placeholder:text-slate-500 outline-none transition focus:ring-2",
            errorText
              ? "border-rose-500/70 focus:border-rose-500/80 focus:ring-rose-500/20"
              : "border-slate-700 focus:border-indigo-400/70 focus:ring-indigo-400/20",
            className ?? "",
          ].join(" ")}
        />
        {rightAdornment ? (
          onRightAdornmentClick ? (
            <button
              type="button"
              onClick={onRightAdornmentClick}
              className="absolute inset-y-0 right-2 inline-flex items-center rounded-md px-1 text-slate-500 transition hover:text-slate-300"
              aria-label="toggle input visibility"
            >
              {rightAdornment}
            </button>
          ) : (
            <span className="pointer-events-none absolute inset-y-0 right-3 inline-flex items-center text-slate-500">
              {rightAdornment}
            </span>
          )
        ) : null}
      </span>
      {errorText ? (
        <span className="text-sm text-rose-400">{errorText}</span>
      ) : helperText ? (
        <span className="text-sm text-emerald-400">{helperText}</span>
      ) : null}
    </label>
  );
}
