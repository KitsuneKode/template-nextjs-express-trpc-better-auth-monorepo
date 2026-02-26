'use client'

import { toast } from 'sonner'
import { codeToHtml } from 'shiki'
import React, { useEffect, useState } from 'react'
import { Check, Copy } from '@template/ui/components/icons'

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
        theme: 'vitesse-dark', // Dark theme fitting the aesthetic
      })
      setHtml(out)
    }
    highlight()
  }, [code, language])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative min-w-0 overflow-hidden rounded-xl bg-transparent">
      {filename && (
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-2">
          <span className="font-mono text-xs text-[#71717A]">{filename}</span>
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/50" />
          </div>
        </div>
      )}

      <div className="group relative min-w-0">
        <button
          type="button"
          onClick={copyToClipboard}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[#A1A1AA] opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-white/20 hover:text-white"
          aria-label="Copy code"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>

        <div className="min-w-0 p-4 text-sm [&_pre]:break-all [&_pre]:whitespace-pre-wrap [&>pre]:!bg-transparent">
          {html ? (
            <div dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <pre className="font-mono text-[#D4D4D8]">
              <code>{code}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}
