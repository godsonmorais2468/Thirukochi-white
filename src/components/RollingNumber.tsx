import { motion, useReducedMotion } from "framer-motion";

interface RollingNumberProps {
  /** The finished, formatted figure — "₹1,24,379", "8.836 g". */
  value: string;
  /** Seconds before the first reel starts turning. */
  delay?: number;
  className?: string;
}

/** Full turns each reel makes before it lands. */
const SPINS = 2;
/** Row height, in em, so the drum scales with whatever size it is set at. */
const ROW = 1.15;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * One drum: it spins through two whole cycles, then stops on its digit.
 *
 * The column is built upside down and travels towards `y: 0`, rather than the
 * obvious way round — towards the digit. That way the drum's *resting* row is
 * the true digit, so a frame the animation never reaches still reads the right
 * number. Built the other way, anything that stops the frames — a backgrounded
 * tab, a device throttling itself — leaves every drum parked on its first row,
 * and the figure reads ₹00,000.00.
 */
function Reel({ digit, delay }: { digit: number; delay: number }) {
  const ascending: number[] = [];
  for (let turn = 0; turn < SPINS; turn += 1) ascending.push(...DIGITS);
  ascending.push(...DIGITS.slice(0, digit + 1));
  const rows = ascending.reverse();

  return (
    <span className="inline-block overflow-hidden align-top" style={{ height: `${ROW}em` }}>
      <motion.span
        className="block"
        initial={{ y: `-${(rows.length - 1) * ROW}em` }}
        animate={{ y: 0 }}
        transition={{ duration: 1.05, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {rows.map((row, index) => (
          <span
            key={index}
            className="block text-center"
            style={{ height: `${ROW}em`, lineHeight: `${ROW}em` }}
          >
            {row}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * Figures arrive on drums, the way a weighing scale or a ledger counter lands
 * on its reading — each digit spins through two turns and stops, a beat after
 * the one to its left, and a single sweep of light crosses the whole figure as
 * the last drum settles.
 *
 * This replaces a plain count-up. A count-up says nothing about the house; it
 * also had to interpolate a number and re-format it on every frame, so the
 * grouping commas jumped about as the figure grew. The drums move on transform
 * alone and the figure is formatted once, finished, before anything turns.
 *
 * Re-key on `value` at the call site — or let it change — and the drums roll
 * again, which is what makes the gold rate re-read when its unit is switched.
 */
export default function RollingNumber({ value, delay = 0, className = "" }: RollingNumberProps) {
  const reduced = useReducedMotion();

  if (reduced) return <span className={className}>{value}</span>;

  const characters = [...value];
  let digitIndex = -1;

  return (
    <span
      className={`relative inline-flex overflow-hidden tabular-nums ${className}`}
      aria-label={value}
    >
      {characters.map((character, index) => {
        const isDigit = character >= "0" && character <= "9";
        if (isDigit) digitIndex += 1;

        return isDigit ? (
          <Reel key={index} digit={Number(character)} delay={delay + digitIndex * 0.06} />
        ) : (
          <span
            key={index}
            aria-hidden
            className="inline-block align-top"
            style={{ height: `${ROW}em`, lineHeight: `${ROW}em`, whiteSpace: "pre" }}
          >
            {character}
          </span>
        );
      })}

      {/* One pass of light, timed to the last drum stopping */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-1/3"
        style={{
          background:
            "linear-gradient(104deg, rgba(255,255,255,0) 0%, rgba(255,246,219,0.75) 50%, rgba(255,255,255,0) 100%)",
        }}
        initial={{ x: "-160%" }}
        animate={{ x: "460%" }}
        transition={{ duration: 0.9, delay: delay + 0.9, ease: [0.4, 0, 0.2, 1] }}
      />
    </span>
  );
}
