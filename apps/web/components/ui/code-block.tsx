'use client'

import { codeToHtml } from 'shiki'
import { motion } from 'motion/react'
import { Check, Copy } from '@template/ui/components/icons'
import React, { useEffect, useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export const CodeBlock = ({
  code,
  language = 'typescript',
  filename,
}: CodeBlockProps) => {
  const [html, setHtml] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const highlight = async () => {
      const out = await codeToHtml(code, {
        lang: language,
        theme: 'nord', // Using nord as it fits well with solar dusk, or use a custom theme
      })
      setHtml(out)
    }
    highlight()
  }, [code, language])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#2E3440] shadow-xl">
      {filename && (
        <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-2">
          <span className="font-mono text-xs text-neutral-400">{filename}</span>
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          </div>
        </div>
      )}

      <div className="group relative">
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 rounded-md bg-white/10 p-2 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/20 hover:text-white"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>

        <div
          className="overflow-x-auto p-4 font-mono text-sm"
          dangerouslySetInnerHTML={{
            __html: html || `<pre><code>${code}</code></pre>`,
          }}
        />
      </div>
    </div>
  )
}
