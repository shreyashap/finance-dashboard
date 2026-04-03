import { motion } from 'framer-motion'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
}

export function InsightCard() {
  return (
    <motion.section
      custom={7}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="max-w-3xl"
    >
      <motion.div 
        className="rounded-2xl bg-[var(--color-tertiary)]/10 border border-[var(--color-tertiary)]/20 p-4 flex items-start gap-3 shadow-[0_20px_40px_rgba(79,70,229,0.06)] cursor-pointer"
        whileHover={{ scale: 1.01 }}
      >
        <motion.span 
          className="material-symbols-outlined text-[var(--color-tertiary)] mt-0.5" 
          style={{ fontVariationSettings: 'FILL 1' }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          lightbulb
        </motion.span>
        <div>
          <h4 className="font-bold text-sm text-[var(--text-primary)]">FinanceIQ Insight</h4>
          <p className="text-xs mt-1 leading-relaxed text-[var(--text-secondary)]">
            Your spending in <span className="font-bold text-[var(--color-tertiary)]">Dining Out</span> is up 5% compared to last week. Consider cooking at home to save more.
          </p>
        </div>
      </motion.div>
    </motion.section>
  )
}
