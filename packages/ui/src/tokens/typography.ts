export const fontFamily = {
  sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'].join(', '),
  mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'].join(', '),
} as const

export const fontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
} as const

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const
