import Link from "next/link";
import { cn } from "../lib/cn";

const variants = {
  primary:
    "bg-foreground text-background hover:opacity-90 disabled:hover:opacity-100",
  secondary:
    "bg-muted text-foreground hover:bg-[color:var(--border)]",
  outline:
    "bg-transparent text-foreground border border-[color:var(--border)] hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
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
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    full && "w-full",
    className,
  );
}

export function Button({
  children,
  variant,
  size,
  full,
  className,
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      className={classes({ variant, size, full, className })}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({ children, href, variant, size, full, className, ...rest }) {
  return (
    <Link
      href={href}
      className={classes({ variant, size, full, className })}
      {...rest}
    >
      {children}
    </Link>
  );
}
