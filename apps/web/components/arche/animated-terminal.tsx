'use client'

import { Button } from '@template/ui/components/button'
import { motion } from 'motion/react'
import { useState, useEffect } from 'react'

const terminalSteps = [
  { text: 'bunx --bun arche create my-app', type: 'command', delay: 800 },
  { text: '? Which family would you like to use?', type: 'prompt', delay: 600 },
  { text: '❯ Fullstack (Next.js + Express + tRPC)', type: 'select', delay: 400 },
  { text: '✔ Fullstack family selected', type: 'success', delay: 300 },
  { text: '? Do you want to initialize a git repository?', type: 'prompt', delay: 500 },
  { text: '❯ Yes', type: 'select', delay: 300 },
  { text: '✔ Git initialized', type: 'success', delay: 300 },
  { text: '⠋ Scaffolding project from KitsuneKode/template...', type: 'loading', delay: 800 },
  { text: '✔ Project created successfully!', type: 'success', delay: 0 },
]

export function AnimatedTerminal() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [typedCommand, setTypedCommand] = useState('')

  useEffect(() => {
    // Only run sequence once on mount
    let isSubscribed = true

    const runSequence = async () => {
      // Step 0: Typing animation for the initial command
      if (currentStep === 0) {
        const command = terminalSteps[0].text
        for (let i = 0; i <= command.length; i++) {
          if (!isSubscribed) return
          setTypedCommand(command.slice(0, i))
          await new Promise((r) => setTimeout(r, 40)) // Typing speed
        }
        await new Promise((r) => setTimeout(r, terminalSteps[0].delay))
        if (!isSubscribed) return
        setIsTyping(false)
        setCurrentStep(1)
        return
      }

      // Subsequent steps
      if (currentStep > 0 && currentStep < terminalSteps.length) {
        await new Promise((r) => setTimeout(r, terminalSteps[currentStep - 1].delay))
        if (!isSubscribed) return
        setCurrentStep((prev) => prev + 1)
      }
    }

    runSequence()

    return () => {
      isSubscribed = false
    }
  }, [currentStep])

  return (
    <div className="relative z-20 flex w-full max-w-2xl flex-col gap-4 sm:flex-row">
      <div className="group flex flex-1 flex-col overflow-hidden border border-zinc-800 bg-black shadow-[4px_4px_0_0_rgba(39,39,42,1)] transition-all duration-300 hover:shadow-[8px_8px_0_0_rgba(39,39,42,1)]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2 font-mono text-[10px] tracking-widest text-white uppercase">
          <div className="flex items-center gap-2">
            <div className="size-2 animate-pulse bg-amber-500" />
            Terminal
          </div>
          <div className="opacity-50">v3.0.0</div>
        </div>

        {/* Terminal Content */}
        <div className="relative flex min-h-[220px] flex-col items-start bg-black p-4 text-left font-mono text-sm leading-relaxed md:p-6">
          {/* Step 0: Typing Command */}
          <div className="flex items-center gap-3 text-white">
            <span className="text-zinc-400">~</span>
            <span>{isTyping ? typedCommand : terminalSteps[0].text}</span>
            {isTyping && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="block h-4 w-2 bg-white"
              />
            )}
          </div>

          {/* Render completed steps */}
          {terminalSteps.slice(1, currentStep).map((step, i) => (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              key={i}
              className={`mt-2 ${
                step.type === 'prompt'
                  ? 'text-zinc-400'
                  : step.type === 'select'
                    ? 'ml-2 border-l-2 border-white pl-4 font-semibold text-white'
                    : step.type === 'success'
                      ? 'text-green-400'
                      : step.type === 'loading'
                        ? 'text-blue-400'
                        : 'text-white'
              }`}
            >
              {step.text}
            </motion.div>
          ))}

          {/* Current loading indicator if not finished */}
          {currentStep === 7 && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="mt-4 inline-block text-blue-400"
            >
              ⠋
            </motion.div>
          )}
        </div>
      </div>

      {/* CTA Button next to terminal */}
      <div className="flex shrink-0 gap-2 sm:flex-col">
        <Button
          aria-label="Initialize Arche Project"
          className="flex-1 rounded-none border border-white bg-white px-8 font-bold text-black shadow-[4px_4px_0_0_rgba(255,255,255,0.2)] transition-all hover:bg-zinc-200 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
        >
          Initialize
        </Button>
        <Button
          aria-label="Read Documentation"
          variant="outline"
          className="flex-1 rounded-none border border-zinc-800 bg-black px-8 font-bold text-white shadow-[4px_4px_0_0_rgba(39,39,42,1)] transition-all hover:bg-zinc-900 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
        >
          Docs ↗
        </Button>
      </div>
    </div>
  )
}
