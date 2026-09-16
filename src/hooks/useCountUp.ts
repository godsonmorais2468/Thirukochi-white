import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { ease } from "../lib/motion";

interface CountUpOptions {
  duration?: number;
  delay?: number;
}

/** Smoothly counts from zero to `target` once the value is mounted. */
export function useCountUp(target: number, { duration = 1.6, delay = 0 }: CountUpOptions = {}) {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }

    setValue(0);
    const controls = animate(0, target, {
      duration,
      delay,
      ease: ease.silk,
      onUpdate: setValue,
    });

    return () => controls.stop();
  }, [target, duration, delay, reduced]);

  return value;
}
