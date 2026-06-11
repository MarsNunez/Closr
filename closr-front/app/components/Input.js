import { cn } from "../lib/cn";

export function Field({ label, hint, error, children }) {
  return (
    <label className="flex flex-col gap-2">
      {label ? (
        <span className="text-sm font-medium text-foreground">{label}</span>
      ) : null}
      {children}
      {error ? (
        <span className="text-xs text-red-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input({ className, ...rest }) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-[color:var(--border)] bg-background px-4 text-sm",
        "placeholder:text-muted-foreground/70",
        "focus:border-foreground focus:outline-none",
        "disabled:opacity-60",
        className,
      )}
      {...rest}
    />
  );
}

export function Textarea({ className, rows = 4, ...rest }) {
  return (
    <textarea
      rows={rows}
      className={cn(
        "w-full rounded-xl border border-[color:var(--border)] bg-background px-4 py-3 text-sm leading-relaxed",
        "placeholder:text-muted-foreground/70",
        "focus:border-foreground focus:outline-none",
        "resize-none",
        className,
      )}
      {...rest}
    />
  );
}
