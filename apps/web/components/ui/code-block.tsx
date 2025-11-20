"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export const CodeBlock = ({ code, language = "typescript", filename }: CodeBlockProps) => {
  const [html, setHtml] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const highlight = async () => {
      const out = await codeToHtml(code, {
        lang: language,
        theme: "nord", // Using nord as it fits well with solar dusk, or use a custom theme
      });
      setHtml(out);
    };
    highlight();
  }, [code, language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg overflow-hidden border border-white/10 bg-[#2E3440] shadow-xl">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
          <span className="text-xs text-neutral-400 font-mono">{filename}</span>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
        </div>
      )}
      
      <div className="relative group">
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-2 p-2 rounded-md bg-white/10 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 hover:text-white"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
        
        <div 
          className="p-4 overflow-x-auto text-sm font-mono"
          dangerouslySetInnerHTML={{ __html: html || `<pre><code>${code}</code></pre>` }}
        />
      </div>
    </div>
  );
};
