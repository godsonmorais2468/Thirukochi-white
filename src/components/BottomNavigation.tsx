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
 * The phone dock, as a piece of the house's own jewellery.
 *
 * It no longer spans the screen as a bar welded to the bottom edge: it is a
 * burgundy card floating clear of all three edges, with the current
 * destination raised out of it on a gold coin that breaks the card's top rule
 * — the way a stone sits proud of the band that holds it. The coin is a single
 * shared element, so moving between tabs slides it along the rail while each
 * icon rises to meet it.
 *
 * The old bar carried a `backdrop-filter`, which made the phone re-composite
 * everything behind it on every frame of every scroll. The card is opaque, and
 * scrolling underneath it now costs nothing.
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
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] ${className}`}
    >
      <div
        className="pointer-events-auto relative mx-auto flex max-w-[460px] items-end rounded-[28px] px-1.5 pb-2 pt-[18px]"
        style={{
          background: "linear-gradient(168deg, #71222A 0%, #55151C 56%, #3D0E14 100%)",
          border: "1px solid rgba(212,175,55,0.38)",
          boxShadow:
            "0 22px 44px -20px rgba(30,6,10,0.75), 0 4px 12px -6px rgba(30,6,10,0.5), inset 0 1px 0 rgba(255,246,224,0.14)",
        }}
      >
        {/* Gold thread along the card's top rule, under the coin */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-0 h-px rounded-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(229,199,107,0.75) 50%, rgba(212,175,55,0) 100%)",
          }}
        />

        {navItems.map(({ key, short, icon: Icon, label }) => {
          const isActive = key === active;

          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
              whileTap={reduced ? undefined : { scale: 0.94 }}
              transition={spring.press}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-0.5 pb-0.5"
            >
              {/*
                The coin. It is drawn once and moved between tabs by layout,
                so there is never a second one fading in behind the first.
              */}
              {isActive && (
                <motion.span
                  layoutId="dock-coin"
                  aria-hidden
                  className="gold-fill absolute left-1/2 h-12 w-12 rounded-full"
                  /*
                    Inline transform, not `-translate-x-1/2`: Tailwind writes
                    the `translate` property, which stacks with the transform
                    the layout animation drives and throws the coin off centre.
                  */
                  style={{
                    top: -34,
                    marginLeft: -24,
                    boxShadow:
                      "0 10px 20px -8px rgba(30,6,10,0.8), inset 0 1px 0 rgba(255,255,255,0.6), 0 0 0 4px rgba(61,14,20,0.95), 0 0 0 5px rgba(212,175,55,0.5)",
                  }}
                  transition={spring.soft}
                />
              )}

              <motion.span
                aria-hidden
                className="relative z-10 flex h-5 items-center justify-center"
                /* Not gated on reduced motion: this is where the icon lives
                   when selected, not an embellishment. Framer jumps it there
                   without the spring when the user has asked for less. */
                animate={{ y: isActive ? -20 : 0 }}
                transition={spring.soft}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2 : 1.6}
                  className={`transition-colors duration-300 ${
                    isActive ? "text-wine-900" : "text-gold-200/70"
                  }`}
                />
              </motion.span>

              <span
                className={`relative z-10 text-[10.5px] leading-none font-medium transition-colors duration-300 ${
                  isActive ? "text-gold-300" : "text-gold-200/60"
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
