import { Stages } from "./VotingPage";
import { motion } from "framer-motion";

export function Question({ stage, text }: { stage: Stages; text: string }) {
  const isShowQuestion = stage === Stages.SHOW_QUESTION;

  return (
    <motion.div
      className="max-w-3/4 text-center"
      animate={{
        y: isShowQuestion ? "20vh" : "-20vh",
        scale: isShowQuestion ? 1.5 : 1,
      }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      <motion.h1
        className="font-mono text-shadow-[7px_6px_4px_rgb(30,30,30)] text-9xl font-bold text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, fontSize: "var(--text-6xl)" }}
        transition={{ duration: 0.3 }}
      >
        {text}
      </motion.h1>
    </motion.div>
  );
}
