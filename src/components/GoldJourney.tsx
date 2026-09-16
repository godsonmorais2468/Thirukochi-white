import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import PremiumCard from "./PremiumCard";
import PremiumButton from "./PremiumButton";
import { useCountUp } from "../hooks/useCountUp";
import { formatGrams, formatRupees } from "../lib/format";
import { schemeCallout, wallet } from "../data/mock";
import { ease, layout } from "../lib/motion";

interface GoldJourneyProps {
  onExplore: () => void;
  onPay?: () => void;
  className?: string;
}

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** The instalment ring: a gold arc drawing itself to the plan's progress. */
function ProgressRing({ paid, total }: { paid: number; total: number }) {
  const reduced = useReducedMotion();
  const ratio = paid / total;

  return (
    <div className="relative flex h-[92px] w-[92px] shrink-0 items-center justify-center sm:h-[136px] sm:w-[136px] lg:h-[150px] lg:w-[150px]">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" fill="none" aria-hidden>
        <defs>
          <linearGradient id="ring-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c29a2c" />
            <stop offset="50%" stopColor="#e5c76b" />
            <stop offset="100%" stopColor="#a8801f" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r={RADIUS} stroke="#f0e5d2" strokeWidth="9" />
        <motion.circle
          cx="64"
          cy="64"
          r={RADIUS}
          stroke="url(#ring-gold)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={reduced ? false : { strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - ratio) }}
          transition={{ duration: 1.6, delay: 0.45, ease: ease.silk }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="font-display text-[20px] leading-none text-ink sm:text-[30px]">
          {paid}
          <span className="text-[12px] text-muted-soft sm:text-[17px]">/{total}</span>
        </p>
        <p className="mt-1 text-[10px] font-medium tracking-luxe uppercase text-gold-700 sm:mt-1.5 sm:text-[11px]">Instalments</p>
      </div>
    </div>
  );
}

/**
 * "I am building towards my next piece." The active plan is visualised on the
 * left; the invitation to start another sits on the right.
 */
export default function GoldJourney({ onExplore, onPay, className = "" }: GoldJourneyProps) {
  const grams = useCountUp(wallet.goldGrams, { duration: 1.5, delay: 0.5 });
  const { scheme } = wallet;
  const remaining = scheme.total - scheme.paid;

  return (
    <PremiumCard tone="cream" padded={false} sheenDelay={2.4} className={className}>
      <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-7 lg:p-8">
        {/* Where the plan stands */}
        <div className="flex items-center gap-3 sm:gap-7">
          <ProgressRing paid={scheme.paid} total={scheme.total} />

          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-luxe uppercase text-gold-700">Your plan</p>
            <p className="mt-1.5 font-display text-[17px] leading-tight text-ink sm:mt-2 sm:text-[21px]">{scheme.name}</p>
            <p className="mt-1 text-[12px] text-muted sm:mt-1.5 sm:text-[13px]">
              {formatRupees(scheme.monthly)} every month
            </p>

            {/*
              The column next to the ring is narrow on a 320px phone — narrow
              enough that a label and its figure will not sit on one line. The
              rows wrap rather than push the figure out of the card.
            */}
            <dl className="mt-3 flex flex-col gap-1.5 border-t border-line-soft pt-3 text-[12.5px] sm:mt-4 sm:gap-2 sm:pt-3.5 sm:text-[13px]">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
                <dt className="text-muted">Gold held</dt>
                <dd className="font-display text-[14px] text-ink">{formatGrams(grams)}</dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5">
                <dt className="text-muted">Remaining</dt>
                <dd className="font-display text-[14px] whitespace-nowrap text-ink">
                  {remaining} {remaining === 1 ? "month" : "months"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Where it could go next */}
        <div className="min-w-0 border-t border-line-soft pt-3 sm:pt-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(212,175,55,0.45)] bg-gold-50 px-2 py-0.5 text-[10px] font-medium tracking-luxe uppercase text-gold-700 sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[11px]">
            <Sparkles size={10} strokeWidth={1.7} />
            {schemeCallout.eyebrow}
          </span>

          <h3 className="mt-2 font-display text-[16px] leading-[1.15] text-ink sm:mt-4 sm:text-[23px] lg:text-[27px]">
            {schemeCallout.title}
          </h3>
          <p className="mt-1 max-w-[44ch] text-[12px] leading-snug text-muted sm:mt-3 sm:text-[13.5px] sm:leading-relaxed">
            {schemeCallout.body}
          </p>

          <div className="mt-2.5 flex flex-row flex-wrap gap-2 sm:mt-6 sm:gap-2.5">
            <PremiumButton
              layoutId={layout.primaryAction}
              onClick={onExplore}
              block={false}
              className="flex-1 sm:flex-none"
              icon={<ArrowRight size={14} strokeWidth={1.9} />}
            >
              {schemeCallout.action}
            </PremiumButton>

            {onPay && (
              <PremiumButton variant="outline" onClick={onPay} block={false} className="flex-1 sm:flex-none">
                Make a payment
              </PremiumButton>
            )}
          </div>
        </div>
      </div>

      {/* Gold rule tying the two halves together */}
      <motion.span
        aria-hidden
        className="divider-gold pointer-events-none absolute inset-x-8 bottom-0 h-px"
        initial={{ opacity: 0, scaleX: 0.6 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.1, delay: 0.5, ease: ease.silk }}
      />
    </PremiumCard>
  );
}
