import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { gesture, slideIn, spring } from "../lib/motion";

interface QuickActionProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  /** Fills the disc with gold — for the single most-used action in a rail. */
  primary?: boolean;
  className?: string;
}

/**
 * One tile in the quick-action cluster: a gold-rimmed disc over a short label.
 * On phones these sit in a horizontally scrolling rail; on desktop they line up
 * as a row of tiles.
 */
export default function QuickAction({
  label,
  icon,
  onClick,
  primary = false,
  className = "",
}: QuickActionProps) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      variants={slideIn}
      onClick={onClick}
      whileHover={reduced ? undefined : gesture.tile.whileHover}
      whileTap={reduced ? undefined : gesture.tile.whileTap}
      transition={spring.hover}
      className={`group surface flex h-full min-w-0 flex-col items-center justify-start gap-1.5 rounded-[var(--radius-tile)] px-2 py-3 text-center transition-shadow duration-400 hover:lift-soft sm:gap-2.5 sm:px-3 sm:py-4 ${className}`}
    >
      <span
        aria-hidden
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-400 group-hover:scale-105 sm:h-11 sm:w-11 ${
          primary ? "gold-fill text-wine-900" : "bg-gold-50 text-wine-700"
        }`}
        style={{
          border: primary ? "none" : "1px solid rgba(212,175,55,0.38)",
          boxShadow: primary
            ? "0 10px 22px -12px rgba(140,105,35,0.7), inset 0 1px 0 rgba(255,255,255,0.5)"
            : "inset 0 1px 0 rgba(255,255,255,0.8)",
        }}
      >
        {icon}
      </span>
      <span className="w-full text-[11.5px] leading-tight font-medium break-words hyphens-auto text-ink-soft sm:text-[12px]">
        {label}
      </span>
    </motion.button>
  );
}
