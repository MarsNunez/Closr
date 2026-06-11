import Link from "next/link";
import { cn } from "../lib/cn";

function ClosrIcon({ className, size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* C arc */}
      <path
        d="M82 22C72 10 56 4 40 8C20 13 6 32 6 52C6 72 20 89 40 94C56 98 72 92 82 80"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      {/* Main person — head */}
      <circle cx="45" cy="38" r="10" fill="currentColor" />
      {/* Main person — body */}
      <path
        d="M25 72C25 58 35 50 45 50C55 50 65 58 65 72"
        fill="currentColor"
      />
      {/* Second person — head (smaller, behind) */}
      <circle cx="62" cy="43" r="7.5" fill="currentColor" opacity="0.75" />
      {/* Second person — body (behind) */}
      <path
        d="M47 72C47 62 54 55 62 55C70 55 77 62 77 72"
        fill="currentColor"
        opacity="0.75"
      />
    </svg>
  );
}

export function Logo({ className, showText = true }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 focus-visible:outline-none", className)}
      aria-label="Closr — inicio"
    >
      <ClosrIcon className="text-brand-500 shrink-0" size={32} />
      {showText && (
        <span className="text-[17px] font-semibold tracking-tight text-foreground">
          closr
        </span>
      )}
    </Link>
  );
}
