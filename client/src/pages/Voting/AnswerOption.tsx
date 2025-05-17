import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { FloatingAnimation } from "@/components/common/FloatingAnimation";

interface AnswerOptionProps {
  text: string;
  isVisible: boolean;
  position: "left" | "right";
  isSelected?: boolean;
  onSelect: () => void;
}

export function AnswerOption({
  text,
  isVisible,
  position,
  isSelected = false,
  onSelect,
}: AnswerOptionProps) {
  const rotation = position === "left" ? -3 : 3;

  return (
    <FloatingAnimation
      delay={position === "left" ? 0 : 0.5}
      speed={0.8}
      amplitude={4}
    >
      <motion.div
        className="w-[400px]"
        initial={{
          opacity: 0,
          rotate: rotation,
          x: position === "left" ? -50 : 50,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          rotate: isVisible ? rotation : 0,
          x: isVisible ? 0 : position === "left" ? -50 : 50,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className={cn(
            "bg-white rounded-none p-8 cursor-pointer \
             border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] \
             hover:shadow-[15px_12px_0px_0px_rgba(0,0,0,1)] \
             transition-all duration-200 \
             min-h-[200px] flex items-center justify-center",
            {
              "shadow-[-8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[-15px_12px_0px_0px_rgba(0,0,0,1)]":
                position === "left",
              "bg-gray-100 scale-95": isSelected,
            }
          )}
          onClick={onSelect}
        >
          <motion.p
            className={cn(
              "text-3xl font-mono text-black text-center font-bold \
               line-clamp-4 break-words",
              {
                "text-gray-600": isSelected,
              }
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        </motion.div>
      </motion.div>
    </FloatingAnimation>
  );
}
