import { motion } from "framer-motion";

interface FloatingAnimationProps {
  children: React.ReactNode;
  delay?: number;
  speed?: number;
  amplitude?: number;
}

export function FloatingAnimation({
  children,
  delay = 0,
  speed = 1.5,
  amplitude = 5,
}: FloatingAnimationProps) {
  return (
    <motion.div
      animate={{
        y: [
          0,
          -amplitude * 0.7,
          -amplitude,
          -amplitude * 0.7,
          0,
          amplitude * 0.7,
          amplitude,
          amplitude * 0.7,
          0,
        ],
        x: [
          0,
          amplitude * 0.3,
          0,
          -amplitude * 0.3,
          0,
          -amplitude * 0.3,
          0,
          amplitude * 0.3,
          0,
        ],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear",
        delay,
        times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
