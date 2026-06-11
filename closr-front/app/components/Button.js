import Link from "next/link";
import { cn } from "../lib/cn";

const variants = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 shadow-sm",
  secondary:
    "bg-muted text-foreground hover:bg-[color:var(--border)]",
  outline:
    "bg-transparent text-foreground border border-[color:var(--border)] hover:bg-muted",
  ghost:
    "bg-transparent text-foreground hover:bg-muted",
  brand:
    "bg-transparent text-brand-600 border border-brand-200 hover:bg-brand-50 dark:text-brand-400 dark:border-brand-800 dark:hover:bg-brand-900/30",
  danger:
    "bg-transparent text-red-600 border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30",
};

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

function classes({ variant = "primary", size = "md", full, className }) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    full && "w-full",
    className,
  );
}

export function Button({ children, variant, size, full, className, type = "button", ...rest }) {
  return (
    <button type={type} className={classes({ variant, size, full, className })} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({ children, href, variant, size, full, className, ...rest }) {
  return (
    <Link href={href} className={classes({ variant, size, full, className })} {...rest}>
      {children}
    </Link>
  );
}
