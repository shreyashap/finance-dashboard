import { useState } from 'react'
import { motion } from 'framer-motion'

interface CategoryChartProps {
  categories: { name: string; percent: number; color: string }[]
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
  })
}

export function CategoryChart({ categories }: CategoryChartProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const circumference = 2 * Math.PI * 14

  return (
    <motion.div
      custom={4}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      className="rounded-3xl bg-[var(--bg-surface)] p-6 md:p-8 shadow-[0_20px_40px_rgba(79,70,229,0.06)] cursor-pointer"
    >
      <h3 className="font-headline text-xl font-extrabold text-[var(--text-primary)] mb-6">Categories</h3>
      
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center group">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <circle cx="18" cy="18" fill="none" r="14" stroke="var(--border-default)" strokeWidth="3" opacity="0.3" />
            
            {/* Animated segments */}
            {categories.map((cat, index) => {
              const segmentLength = (cat.percent / 100) * circumference
              const gap = circumference - segmentLength
              const offset = index === 0 
                ? 0 
                : -categories.slice(0, index).reduce((sum, c) => sum + (c.percent / 100) * circumference, 0)
              
              return (
                <motion.circle 
                  key={cat.name}
                  cx="18" cy="18" 
                  fill="none" 
                  r={selectedCategory === cat.name ? 15 : 14} 
                  stroke={cat.color} 
                  strokeWidth={selectedCategory === cat.name ? 4 : index === 0 ? 3 : 2}
                  strokeDasharray={`${segmentLength} ${gap}`}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1, delay: index * 0.2, ease: 'easeOut' }}
                  style={{ transformOrigin: 'center', transition: 'r 0.3s, stroke-width 0.3s' }}
                  onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                  className="cursor-pointer"
                />
              )
            })}
          </svg>
          
          {/* Center Text */}
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-bold text-[var(--text-primary)]">85%</span>
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Budget</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 w-full">
          {categories.map((cat, i) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className={`flex items-center gap-2 group cursor-pointer rounded-lg p-1 -m-1 transition-colors ${selectedCategory === cat.name ? 'bg-[var(--color-primary)]/10' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
            >
              <motion.div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: cat.color }}
                whileHover={{ scale: 1.5 }}
                animate={{ scale: selectedCategory === cat.name ? 1.3 : 1 }}
              />
              <span className={`text-xs font-medium transition-colors ${selectedCategory === cat.name ? 'text-[var(--color-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--color-primary)]'}`}>
                {cat.name} ({cat.percent}%)
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
