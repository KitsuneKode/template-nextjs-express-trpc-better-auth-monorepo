export default function Mockup8() {
  return (
    <main className="min-h-screen bg-[#F7F5F0] font-sans text-[#2C2B29] selection:bg-[#2C2B29] selection:text-[#F7F5F0]">
      {/* Editorial / Magazine Aesthetic */}

      <div className="mx-auto flex min-h-screen max-w-[1400px] flex-col px-6 py-12 md:py-20">
        {/* Editorial Header */}
        <header className="mb-16 flex items-end justify-between border-b border-[#2C2B29]/20 pb-6 md:mb-24">
          <div className="text-[10px] font-semibold tracking-[0.2em] uppercase md:text-xs">
            Vol. III <br />
            Kit Stack
          </div>
          <div className="font-serif text-2xl tracking-tight italic md:text-3xl">Arche.</div>
          <div className="text-right text-[10px] font-semibold tracking-[0.2em] uppercase md:text-xs">
            System <br />
            Initiation
          </div>
        </header>

        <div className="flex flex-1 flex-col items-start gap-16 lg:flex-row lg:gap-24">
          {/* Left Column: Typography heavy */}
          <div className="flex-1 lg:max-w-2xl">
            <h1 className="mb-10 font-serif text-[4rem] leading-[0.85] tracking-tighter text-[#1A1A18] md:text-[6rem] lg:text-[7.5rem]">
              The <br />
              <span className="text-[#A85B32] italic">beginning</span> <br />
              of every <br />
              project.
            </h1>

            <p className="mb-12 max-w-md text-lg leading-relaxed font-medium text-[#5C5A56] md:text-xl">
              One command. Full-stack TypeScript monorepo. Auth, database, API, frontend — wired and
              ready.
            </p>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-[#2C2B29]/20" />
              <div className="text-xs font-semibold tracking-[0.15em] text-[#8A8680] uppercase">
                Install via Bun
              </div>
            </div>
          </div>

          {/* Right Column: Terminal & Features */}
          <div className="w-full flex-1 lg:mt-[10%]">
            {/* Elegant Terminal */}
            <div className="mb-16 rounded-sm bg-[#1A1A18] p-1 text-[#E8E6E1] shadow-2xl">
              <div className="flex flex-col gap-6 border border-[#3A3835] p-6 md:p-8">
                <div className="font-mono text-sm text-[10px] tracking-wide uppercase opacity-50">
                  Terminal / ZSH
                </div>
                <div className="flex items-center gap-4 font-mono text-lg">
                  <span className="text-[#A85B32]">❯</span>
                  bunx --bun arche create my-app
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="border-b border-[#E8E6E1]/30 pb-1 text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors hover:border-[#A85B32] hover:text-[#A85B32]">
                    Copy Command
                  </button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-8">
              {[
                {
                  title: 'Modular Foundation',
                  desc: 'Pick a family. Answer 5 prompts. Get a working monorepo.',
                },
                {
                  title: 'End-to-End Safety',
                  desc: 'Types from database schema through tRPC to your frontend.',
                },
                {
                  title: 'Agent Integration',
                  desc: 'Every project ships with AGENTS.md and IDE rules files.',
                },
              ].map((feat, i) => (
                <div key={i} className="group">
                  <h3 className="mb-2 flex items-center gap-4 font-serif text-xl text-[#1A1A18] italic">
                    <span className="font-sans text-sm tracking-widest text-[#A85B32] not-italic">
                      0{i + 1}
                    </span>
                    {feat.title}
                  </h3>
                  <p className="pl-9 text-[15px] leading-relaxed text-[#5C5A56]">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
