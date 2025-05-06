'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

interface ThemeProviderProps {
  children: React.ReactNode
  themes?: string[]
  forcedTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  enableColorScheme?: boolean
  storageKey?: string
  defaultTheme?: string
  attribute?: string | 'class'
  value?: Record<string, string>
  nonce?: string
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
