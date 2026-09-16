import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import BrandLogo from "../components/BrandLogo";
import ScreenTransition from "../components/ScreenTransition";
import { ease, spring } from "../lib/motion";

interface SplashScreenProps {
  onDone: () => void;
}

/** How long the opening runs before the app takes over. */
const HOLD_MS = 3000;

/** Where the white ground hands over to the burgundy one. */
const SEAM = "46%";

const MOTES = [
  { x: 10, y: 82, delay: 0, size: 3 },
  { x: 24, y: 94, delay: 0.6, size: 2 },
  { x: 40, y: 88, delay: 1.2, size: 2.5 },
  { x: 62, y: 96, delay: 0.35, size: 2 },
  { x: 78, y: 84, delay: 1, size: 3 },
  { x: 90, y: 92, delay: 1.6, size: 2 },
];

/** A sprig of gold leaf, the same one the printed furniture uses. */
function LeafSprig({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 150" fill="none" className={className}>
      <path
        d="M60 146 C 60 104, 52 66, 30 34"
        stroke="rgba(176,141,40,0.55)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {[
        [58, 118, 22, 12],
        [54, 98, -24, -10],
        [49, 80, 20, 10],
        [43, 62, -20, -9],
        [37, 47, 16, 8],
      ].map(([x, y, dx, dy], i) => (
        <path
          key={i}
          d={`M${x} ${y} C ${x + dx * 0.5} ${y + dy - 10}, ${x + dx} ${y + dy - 4}, ${x + dx} ${y + dy + 4} C ${x + dx * 0.6} ${y + dy + 8}, ${x + dx * 0.2} ${y + 4}, ${x} ${y} Z`}
          fill="rgba(212,175,55,0.22)"
          stroke="rgba(176,141,40,0.45)"
          strokeWidth="0.8"
        />
      ))}
    </svg>
  );
}

/**
 * The opening. The frame is split: pearl above, house burgundy below, with a
 * gold seam ruled between them and a white medallion sitting astride it so the
 * mark reads on pearl while the plate stands on burgundy. Everything is
 * transform and opacity, so it stays on the compositor. Tap to skip.
 */
export default function SplashScreen({ onDone }: SplashScreenProps) {
  const reduced = useReducedMotion();
  const fired = useRef(false);
  const done = useRef(onDone);

  useEffect(() => {
    done.current = onDone;
  }, [onDone]);

  const finish = () => {
    if (fired.current) return;
    fired.current = true;
    done.current();
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (fired.current) return;
      fired.current = true;
      done.current();
    }, reduced ? 800 : HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  return (
    <ScreenTransition className="isolate overflow-hidden bg-pearl">
      <button
        type="button"
        onClick={finish}
        aria-label="Skip intro"
        className="absolute inset-0 z-40 h-full w-full cursor-default"
      />

      {/* Warm bloom on the pearl half */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10"
        style={{
          height: SEAM,
          background:
            "radial-gradient(120% 90% at 50% 20%, rgba(253,249,239,1) 0%, rgba(248,244,234,1) 60%, rgba(244,238,224,1) 100%)",
        }}
      />

      {/* The burgundy ground, rising into place */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 overflow-hidden"
        style={{
          height: `calc(100% - ${SEAM})`,
          background: "linear-gradient(168deg, #6B1F26 0%, #4A1117 52%, #370B11 100%)",
        }}
        initial={reduced ? false : { y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <span aria-hidden className="grain absolute inset-0 opacity-[0.07]" />

        {/* Gold bloom low in the burgundy */}
        <motion.span
          aria-hidden
          className="absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(229,199,107,0.22) 0%, rgba(229,199,107,0) 70%)",
          }}
          animate={reduced ? undefined : { opacity: [0.5, 1, 0.5], scale: [0.95, 1.08, 0.95] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {!reduced &&
          MOTES.map((mote, index) => (
            <motion.span
              key={index}
              aria-hidden
              className="absolute rounded-full"
              style={{
                left: `${mote.x}%`,
                top: `${mote.y}%`,
                width: mote.size,
                height: mote.size,
                background: "rgba(229,199,107,0.95)",
                boxShadow: "0 0 8px rgba(229,199,107,0.9)",
              }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: -120 }}
              transition={{ duration: 4.6, delay: 0.8 + mote.delay, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
      </motion.div>

      {/* The seam, ruled out from the centre, with a diamond set on it */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -z-10" style={{ top: SEAM }}>
        <motion.span
          className="block h-px w-full origin-center"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(229,199,107,0.85) 50%, rgba(212,175,55,0) 100%)",
          }}
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: ease.silk }}
        />
      </div>

      {/* Faint rings rippling out from the plate, so the pearl half is not bare */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -z-10"
        style={{ top: SEAM, transform: "translate(-50%, -50%)" }}
      >
        {[1.35, 1.78, 2.24].map((scale, index) => (
          <motion.span
            className="absolute left-1/2 top-1/2 rounded-full"
            key={scale}
            style={{
              width: "clamp(228px,66vw,292px)",
              height: "clamp(228px,66vw,292px)",
              marginLeft: "calc(clamp(228px,66vw,292px) / -2)",
              marginTop: "calc(clamp(228px,66vw,292px) / -2)",
              border: `1px solid rgba(176,141,40,${0.2 - index * 0.05})`,
            }}
            initial={reduced ? false : { opacity: 0, scale: scale * 0.9 }}
            animate={{ opacity: 1, scale }}
            transition={{ duration: 1.6, delay: 0.7 + index * 0.18, ease: ease.silk }}
          />
        ))}
      </div>

      {/* A struck diamond over a pair of rules, high on the pearl */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[clamp(58px,11vh,104px)] -z-10 flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.85, ease: ease.silk }}
      >
        <motion.span
          className="h-px origin-right bg-[rgba(176,141,40,0.45)]"
          style={{ width: "clamp(44px,14vw,72px)" }}
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 1, ease: ease.silk }}
        />
        {/* No `rotate-45` class here: Tailwind writes the `rotate` property,
            which stacks with the rotation Framer animates and squares it off. */}
        <motion.span
          style={{
            width: 7,
            height: 7,
            background: "linear-gradient(135deg,#e5c76b,#b08d28)",
          }}
          initial={reduced ? false : { scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 45 }}
          transition={{ ...spring.press, delay: 1.05 }}
        />
        <motion.span
          className="h-px origin-left bg-[rgba(176,141,40,0.45)]"
          style={{ width: "clamp(44px,14vw,72px)" }}
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 1, ease: ease.silk }}
        />
      </motion.div>

      {/* Leaf sprigs filling the pearl corners */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-6 top-6 -z-10 h-[150px] w-[120px] sm:h-[190px] sm:w-[150px]"
        initial={{ opacity: 0, rotate: -10, y: -8 }}
        animate={{ opacity: 1, rotate: 0, y: 0 }}
        transition={{ duration: 1.2, delay: 0.35, ease: ease.silk }}
      >
        <LeafSprig className="h-full w-full" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-6 top-6 -z-10 h-[150px] w-[120px] -scale-x-100 sm:h-[190px] sm:w-[150px]"
        initial={{ opacity: 0, rotate: 10, y: -8 }}
        animate={{ opacity: 1, rotate: 0, y: 0 }}
        transition={{ duration: 1.2, delay: 0.45, ease: ease.silk }}
      >
        <LeafSprig className="h-full w-full" />
      </motion.div>

      <div className="relative z-10 flex h-full w-full flex-col items-center px-6">
        {/* The medallion, standing astride the seam */}
        <div className="absolute left-1/2" style={{ top: SEAM, transform: "translate(-50%, -50%)" }}>
          <div className="relative flex items-center justify-center">
            {/* Ring drawn around the plate */}
            <motion.svg
              aria-hidden
              viewBox="0 0 240 240"
              fill="none"
              className="absolute h-[clamp(228px,66vw,292px)] w-[clamp(228px,66vw,292px)] -rotate-90"
            >
              <defs>
                <linearGradient id="splash-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#e5c76b" />
                  <stop offset="50%" stopColor="#c29a2c" />
                  <stop offset="100%" stopColor="#8a6a1f" />
                </linearGradient>
              </defs>
              <motion.circle
                cx="120"
                cy="120"
                r="112"
                stroke="url(#splash-ring)"
                strokeWidth="1.3"
                strokeLinecap="round"
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.55, ease: ease.silk }}
              />
              {[0, 90, 180, 270].map((angle, index) => (
                <motion.line
                  key={angle}
                  x1="120"
                  y1="2"
                  x2="120"
                  y2="14"
                  stroke="rgba(212,175,55,0.9)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  transform={`rotate(${angle} 120 120)`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.95 + index * 0.16, ease: ease.silk }}
                />
              ))}
            </motion.svg>

            {/* The pearl plate */}
            <motion.div
              className="relative flex items-center justify-center overflow-hidden rounded-full"
              style={{
                width: "clamp(196px,58vw,252px)",
                height: "clamp(196px,58vw,252px)",
                background:
                  "radial-gradient(120% 120% at 50% 22%, #ffffff 0%, #fdfaf3 55%, #f7f0e0 100%)",
                border: "1px solid rgba(212,175,55,0.5)",
                boxShadow:
                  "0 30px 70px -30px rgba(58,13,19,0.55), inset 0 2px 0 rgba(255,255,255,0.9)",
              }}
              initial={reduced ? false : { scale: 0.82, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...spring.soft, delay: 0.3 }}
            >
              <motion.div
                className="relative"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.62, ease: ease.silk }}
              >
                <BrandLogo variant="lockup" sizeClass="w-[clamp(138px,40vw,180px)]" width={180} shared />
              </motion.div>

              {/* Light crossing the plate, once */}
              {!reduced && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 w-1/3 rounded-full"
                  style={{
                    background:
                      "linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,250,232,0.9) 50%, rgba(255,255,255,0) 100%)",
                  }}
                  initial={{ x: "-180%" }}
                  animate={{ x: "420%" }}
                  transition={{ duration: 1.3, delay: 1.3, ease: [0.4, 0, 0.2, 1] }}
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* House line and thread, sitting on the burgundy */}
        <div
          className="absolute inset-x-0 flex flex-col items-center px-8"
          style={{ top: `calc(${SEAM} + clamp(150px,31vw,182px))` }}
        >
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.35, ease: ease.silk }}
          >
            <motion.span
              aria-hidden
              className="h-px bg-[rgba(229,199,107,0.7)]"
              initial={{ width: 0 }}
              animate={{ width: 30 }}
              transition={{ duration: 0.7, delay: 1.5, ease: ease.silk }}
            />
            <motion.span
              className="text-[11px] font-medium uppercase text-gold-300"
              initial={{ letterSpacing: "0.04em", opacity: 0 }}
              animate={{ letterSpacing: "0.34em", opacity: 1 }}
              transition={{ duration: 1.1, delay: 1.45, ease: ease.silk }}
            >
              Est. Kochi
            </motion.span>
            <motion.span
              aria-hidden
              className="h-px bg-[rgba(229,199,107,0.7)]"
              initial={{ width: 0 }}
              animate={{ width: 30 }}
              transition={{ duration: 0.7, delay: 1.5, ease: ease.silk }}
            />
          </motion.div>

          <motion.p
            className="mt-4 text-center text-[12.5px] leading-snug text-gold-200/80"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.62, ease: ease.silk }}
          >
            Gold held with trust, since the first instalment.
          </motion.p>
        </div>

        {/* The thread filling as the opening runs out */}
        <div className="absolute bottom-[clamp(46px,10vh,84px)] h-px w-[clamp(120px,36vw,160px)] overflow-hidden rounded-full bg-[rgba(229,199,107,0.22)]">
          <motion.span
            className="gold-fill absolute inset-y-0 left-0 w-full origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduced ? 0.5 : 2.7, ease: [0.3, 0, 0.2, 1] }}
          />
        </div>
      </div>
    </ScreenTransition>
  );
}
