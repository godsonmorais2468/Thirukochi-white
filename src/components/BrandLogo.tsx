import { motion } from "framer-motion";
import { layout, spring } from "../lib/motion";

/**
 * Supplied artwork, served from `public/brand`. Two tones of the same lockup:
 * `ink` is the burgundy-and-gold rendering that holds on cream and pearl,
 * `light` is the original pale gold, kept for burgundy panels.
 */
const sources = {
  ink: {
    lockup: "/brand/thirukochi-logo-ink.png",
    mark: "/brand/thirukochi-mark-ink.png",
    wordmark: "/brand/thirukochi-wordmark-ink.png",
  },
  light: {
    lockup: "/brand/thirukochi-logo.png",
    mark: "/brand/thirukochi-mark.png",
    wordmark: "/brand/thirukochi-wordmark.png",
  },
} as const;

type Variant = keyof (typeof sources)["ink"];
type Tone = keyof typeof sources;

interface BrandLogoProps {
  variant?: Variant;
  /** `ink` for pale surfaces, `light` for burgundy ones. */
  tone?: Tone;
  /** Rendered width of the artwork in pixels. */
  width?: number;
  /**
   * Responsive width classes, e.g. `w-[150px] lg:w-[200px]`. Prefer this over a
   * scale utility: shared-layout elements carry an inline transform from
   * Framer, which would override any `scale-*` class.
   */
  sizeClass?: string;
  /** Participates in the shared-element transition between screens. */
  shared?: boolean;
  className?: string;
}

const ALT = "Thirukochi Gold & Diamonds";

export default function BrandLogo({
  variant = "lockup",
  tone = "ink",
  width = 190,
  sizeClass,
  shared = false,
  className = "",
}: BrandLogoProps) {
  const image = (
    <img
      src={sources[tone][variant]}
      alt={ALT}
      width={width}
      style={sizeClass ? { height: "auto" } : { width, height: "auto" }}
      className={`block select-none ${sizeClass ?? ""}`}
      draggable={false}
    />
  );

  if (!shared) {
    return <div className={className}>{image}</div>;
  }

  return (
    <motion.div layoutId={layout.logo} transition={spring.screen} className={className}>
      {image}
    </motion.div>
  );
}
