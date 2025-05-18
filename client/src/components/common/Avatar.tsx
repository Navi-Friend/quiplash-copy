import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

interface AvatarProps {
  avatarURL: string;
  name: string;
  isVip: boolean;
  className?: string;
  style?: React.CSSProperties;
  score?: number;
  showScore?: boolean;
}

export function Avatar({
  avatarURL,
  name,
  isVip,
  className,
  style,
  score,
  showScore = false,
}: AvatarProps) {
  return (
    <motion.div
      style={style}
      className={cn("flex flex-col items-center relative", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {isVip && (
        <motion.span
          className="text-primary font-extrabold text-2xl absolute top-0 tracking-widest animate-fly"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          VIP
        </motion.span>
      )}
      <motion.img
        src={avatarURL}
        width="130px"
        className="max-w-screen"
        alt={name}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.div
        className="bg-neutral-950 p-1 text-secondary-foreground text-xl text-bold mt-[-11px] text-center px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {name}
      </motion.div>
      {showScore && score !== undefined && (
        <motion.div
          className="absolute -right-10 top-1/3 transform -translate-y-1/2 rounded-full w-12 h-12 flex items-center justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3,
          }}
        >
          <motion.span
            className="text-3xl font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
}
