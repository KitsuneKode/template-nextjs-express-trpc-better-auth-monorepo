"use client";

import React from "react";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { CodeBlock } from "@/components/ui/code-block";
import { terminalSteps } from "@/lib/demo-data";

export const QuickStart = () => {
  return (
    <SectionWrapper id="quick-start">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Start Building in Minutes
          </h2>
          <p className="text-lg text-neutral-400 mb-8">
            Get up and running with a single command. The template comes pre-configured with everything you need.
          </p>
          
          <div className="space-y-6">
            {terminalSteps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[var(--solar-dark)] border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  {index < terminalSteps.length - 1 && (
                    <div className="w-px flex-1 bg-white/10 my-2" />
                  )}
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="text-white font-medium mb-1">{step.description}</h3>
                  <div className="bg-neutral-900 rounded-lg p-3 font-mono text-xs md:text-sm text-neutral-300 border border-white/5 overflow-x-auto">
                    <span className="text-[var(--solar-teal)]">$</span> {step.command}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--solar-orange)] to-[var(--solar-purple)] rounded-2xl blur-2xl opacity-20" />
          <CodeBlock
            filename="terminal"
            language="bash"
            code={`$bun create-turbo@latest --example https://github.com/kitsunekode/template-nextjs-express-trpc-bettera-auth-monorepo my-app
Cloning into 'my-app'...
Done.

$ cd my-app && bun install
Installing dependencies...
+ 847 packages installed [12.43s]

$ bun run rename-scope:dry
Preview: Renaming @template → @myapp
Found 23 files to update

$ bun run rename-scope
✓ Renamed @template to @myapp across all packages
✓ Updated 23 files

$ bun dev
> turbo run dev
@myapp/web:dev: ready on http://localhost:3000
@myapp/server:dev: Server listening on :8080
@myapp/worker:dev: Worker started
`}
          />
        </div>
      </div>
    </SectionWrapper>
  );
};
