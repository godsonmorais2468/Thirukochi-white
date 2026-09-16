import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import BrandLogo from "./BrandLogo";
import ScreenTransition from "./ScreenTransition";
import { ease, rise, stagger } from "../lib/motion";

interface AuthLayoutProps {
  eyebrow: string;
  /** Editorial headline inside the card. */
  title: ReactNode;
  body?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  children: ReactNode;
  /** Small print under the card. */
  footnote?: ReactNode;
}

const BG_PORTRAIT = "/brand/login-bg-mobile.jpg";
const BG_LANDSCAPE = "/brand/login-bg-desktop.jpg";

/** Gold leaf sprig, tucked into a corner of the card. */
function LeafOrnament({ corner }: { corner: "tr" | "bl" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 120"
      fill="none"
      className={`pointer-events-none absolute h-24 w-24 opacity-[0.55] sm:h-28 sm:w-28 ${
        corner === "tr" ? "-right-1 -top-1 rotate-180" : "-bottom-1 -left-1"
      }`}
    >
      <path
        d="M14 108 C 44 104, 78 88, 100 58"
        stroke="rgba(176,141,40,0.45)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {[
        [34, 102, -8, -20],
        [54, 94, -6, -22],
        [72, 82, -4, -22],
        [88, 68, -2, -20],
      ].map(([x, y, dx, dy], i) => (
        <path
          key={i}
          d={`M${x} ${y} C ${x + dx - 6} ${y + dy + 6}, ${x + dx} ${y + dy}, ${x + dx + 8} ${y + dy - 2} C ${x + dx + 6} ${y + dy + 10}, ${x + dx / 2} ${y + 2}, ${x} ${y} Z`}
          fill="rgba(212,175,55,0.16)"
          stroke="rgba(176,141,40,0.35)"
          strokeWidth="0.8"
        />
      ))}
    </svg>
  );
}

/**
 * The sign-in furniture. A photographic set dresses the page — portrait on
 * phones, landscape from `sm` up — with the brand standing on it and a single
 * frosted card beneath. One column at every width, sized to the viewport so
 * the screen never scrolls.
 */
export default function AuthLayout({
  eyebrow,
  title,
  body,
  onBack,
  backLabel = "Back",
  children,
  footnote,
}: AuthLayoutProps) {
  const reduced = useReducedMotion();

  // No `relative` in this className: ScreenTransition is already
  // `absolute inset-0`, and the later class would win and collapse it to
  // content height.
  return (
    <ScreenTransition className="isolate overflow-hidden">
      {/* The set */}
      <div aria-hidden className="absolute inset-0 -z-20">
        <motion.div
          className="absolute inset-0 bg-cover bg-center will-change-transform sm:hidden"
          style={{ backgroundImage: `url(${BG_PORTRAIT})` }}
          initial={reduced ? false : { scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: ease.silk }}
        />
        <motion.div
          className="absolute inset-0 hidden bg-cover bg-center will-change-transform sm:block"
          style={{ backgroundImage: `url(${BG_LANDSCAPE})` }}
          initial={reduced ? false : { scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: ease.silk }}
        />
        {/* Lifts the card off the photograph without dulling it */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 62%, rgba(255,252,246,0.62) 0%, rgba(255,252,246,0.18) 55%, rgba(255,252,246,0) 100%)",
          }}
        />
      </div>

      <div className="no-scrollbar flex h-full w-full flex-col overflow-y-auto px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,calc(env(safe-area-inset-top)+0.5rem))] sm:px-8">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mx-auto flex min-h-0 w-full max-w-[520px] flex-1 flex-col items-center justify-center gap-[clamp(10px,1.8vh,24px)]"
        >
          {/* Brand, standing on the set above the card */}
          <motion.div variants={rise} className="flex shrink-0 flex-col items-center">
            <BrandLogo
              variant="lockup"
              width={220}
              sizeClass="w-[clamp(132px,36vw,204px)]"
              shared
            />

            <div className="mt-2.5 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-[rgba(176,141,40,0.55)] sm:w-10" />
              <span className="text-[11px] font-medium tracking-luxe uppercase text-gold-700 sm:text-[11px]">
                Est. Kochi
              </span>
              <span aria-hidden className="h-px w-8 bg-[rgba(176,141,40,0.55)] sm:w-10" />
            </div>
          </motion.div>

          {onBack && (
            <motion.button
              variants={rise}
              type="button"
              onClick={onBack}
              aria-label={backLabel}
              whileHover={reduced ? undefined : { scale: 1.06 }}
              whileTap={reduced ? undefined : { scale: 0.94 }}
              className="flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-full border border-[rgba(212,175,55,0.45)] bg-[rgba(255,253,248,0.82)] text-wine-700 backdrop-blur-sm"
            >
              <ArrowLeft size={15} strokeWidth={1.7} />
            </motion.button>
          )}

          {/* The card */}
          <motion.div
            variants={rise}
            className="relative isolate w-full overflow-hidden rounded-[26px] px-5 py-5 sm:px-8 sm:py-7"
            style={{
              background:
                "linear-gradient(158deg, rgba(255,253,249,0.94) 0%, rgba(253,248,238,0.9) 100%)",
              border: "1px solid rgba(212,175,55,0.45)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow:
                "0 28px 60px -30px rgba(92,62,30,0.45), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            <LeafOrnament corner="tr" />
            <LeafOrnament corner="bl" />

            <div className="relative">
              <p className="text-[11px] font-medium tracking-luxe uppercase text-gold-700">{eyebrow}</p>
              <h1 className="mt-2 font-display text-[clamp(23px,5.6vw,30px)] leading-[1.12] text-wine-800">
                {title}
              </h1>
              {body && (
                <p className="mt-2 text-[clamp(12px,3.2vw,13px)] leading-relaxed text-muted">
                  {body}
                </p>
              )}

              <div className="mt-[clamp(14px,2vh,22px)]">{children}</div>
            </div>
          </motion.div>

          {footnote && (
            <motion.div variants={rise} className="shrink-0">
              {footnote}
            </motion.div>
          )}
        </motion.div>
      </div>
    </ScreenTransition>
  );
}
