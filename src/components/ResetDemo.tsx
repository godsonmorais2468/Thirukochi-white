import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

interface ResetDemoProps {
  onReset: () => void;
}

/** Development affordance for restarting the walkthrough. */
export default function ResetDemo({ onReset }: ResetDemoProps) {
  if (!import.meta.env.DEV) return null;

  return (
    <motion.button
      type="button"
      onClick={onReset}
      whileTap={{ scale: 0.94 }}
      title="Reset demo"
      aria-label="Reset demo"
      className="absolute bottom-3 right-3 z-[70] hidden h-7 w-7 items-center justify-center rounded-full border border-line bg-pearl/80 text-muted-soft backdrop-blur-md transition-colors hover:text-wine-700 lg:flex"
    >
      <RotateCcw size={11} strokeWidth={1.8} />
    </motion.button>
  );
}
