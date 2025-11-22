import { Variants } from 'motion/react'

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const staggerChildren: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const scaleOnHover: Variants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
}

export const slideInFromRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const pulseAnimation: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const glowEffect: Variants = {
  initial: { boxShadow: '0 0 0 rgba(0,0,0,0)' },
  hover: {
    boxShadow: '0 0 20px var(--solar-orange)',
    transition: { duration: 0.3 },
  },
}
