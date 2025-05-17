import { motion } from "framer-motion";

interface OrButtonProps {
  isVisible: boolean;
}

export function OrButton({ isVisible }: OrButtonProps) {
  return (
    <motion.div
      className="w-[100px] h-[100px]"
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        className="bg-chart-2 rounded-full cursor-default
                   border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                   transition-all duration-200
                   w-full h-full flex items-center justify-center"
      >
        <motion.p
          className="text-4xl font-mono text-black font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          ИЛИ
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
