import { motion } from 'framer-motion'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
}

export function QuickActions() {
  return (
    <motion.div
      custom={5}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="space-y-4 md:hidden"
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-[var(--color-primary)] text-white py-4 rounded-3xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-[var(--color-primary)]/20"
      >
        <span className="material-symbols-outlined">add</span>
        <span className="text-[10px] font-bold uppercase tracking-wider">Send</span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-[var(--bg-surface-2)] text-[var(--color-primary)] py-4 rounded-3xl flex flex-col items-center justify-center gap-1"
      >
        <span className="material-symbols-outlined">qr_code_2</span>
        <span className="text-[10px] font-bold uppercase tracking-wider">Request</span>
      </motion.button>
    </motion.div>
  )
}
