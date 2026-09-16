import { motion, useReducedMotion } from "framer-motion";
import { navItems } from "../lib/nav";
import type { NavKey } from "../lib/nav";
import { spring } from "../lib/motion";

interface BottomNavigationProps {
  active: NavKey;
  onChange: (key: NavKey) => void;
  className?: string;
}

/**
 * The phone dock, in the same burgundy as the desktop rail. Five equal
 * targets; the current one sits on a gold plate with a gold thread above it,
 * so the app is anchored by the house colour at whatever size it is opened.
 */
export default function BottomNavigation({
  active,
  onChange,
  className = "",
}: BottomNavigationProps) {
  const reduced = useReducedMotion();

  return (
    <nav
      aria-label="Primary"
      className={`absolute inset-x-0 bottom-0 z-30 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+9px)] ${className}`}
      style={{
        background: "linear-gradient(180deg, rgba(102,31,38,0.94) 0%, rgba(56,12,18,0.96) 100%)",
        borderTop: "1px solid rgba(212,175,55,0.35)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: "0 -14px 34px -22px rgba(30,6,10,0.9)",
      }}
    >
      {/* Gold thread along the top edge of the dock */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(229,199,107,0.7) 50%, rgba(212,175,55,0) 100%)",
        }}
      />

      <div className="mx-auto flex max-w-[520px] items-stretch">
        {navItems.map(({ key, short, icon: Icon, label }) => {
          const isActive = key === active;

          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
              whileTap={reduced ? undefined : { scale: 0.93 }}
              transition={spring.press}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-1 pt-2.5 pb-1.5"
            >
              {isActive && (
                <motion.span
                  layoutId="dock-indicator"
                  aria-hidden
                  className="gold-fill absolute inset-x-1.5 inset-y-0 -z-10 rounded-2xl"
                  style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)" }}
                  transition={spring.soft}
                />
              )}

              <Icon
                size={20}
                strokeWidth={isActive ? 2 : 1.6}
                className={`transition-colors duration-400 ${
                  isActive ? "text-wine-900" : "text-gold-300/75"
                }`}
              />
              <span
                className={`text-[11px] leading-none font-medium transition-colors duration-400 ${
                  isActive ? "text-wine-900" : "text-gold-200/75"
                }`}
              >
                {short}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
