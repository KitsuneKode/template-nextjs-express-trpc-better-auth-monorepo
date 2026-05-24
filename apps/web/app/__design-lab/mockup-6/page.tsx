export default function Mockup6() {
  return (
    <main className="min-h-screen bg-[#F0F0F3] font-sans text-slate-800 selection:bg-amber-200">
      {/* Tactile / Skeuomorphic / Soft UI Aesthetic */}
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 md:py-32">
        <div className="mb-12 flex size-16 items-center justify-center rounded-2xl bg-[#F0F0F3] shadow-[8px_8px_16px_#d1d1d4,-8px_-8px_16px_#ffffff]">
          <div className="size-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-inner" />
        </div>

        <h1 className="mb-6 text-center text-5xl font-bold tracking-tight text-slate-800 drop-shadow-sm md:text-7xl">
          The beginning of <br /> every project.
        </h1>

        <p className="mb-16 max-w-2xl text-center text-lg leading-relaxed font-medium text-slate-500 md:text-xl">
          One command. Full-stack TypeScript monorepo. Auth, database, API, frontend — wired and
          ready.
        </p>

        {/* Debossed Terminal */}
        <div className="mb-20 flex w-full max-w-2xl flex-col items-center gap-4 rounded-[2rem] bg-[#E6E6E9] p-2 shadow-[inset_6px_6px_12px_#c8c8cc,inset_-6px_-6px_12px_#ffffff] sm:flex-row">
          <div className="flex flex-1 items-center gap-3 px-6 py-4 font-mono text-[15px] text-slate-600">
            <span className="font-bold text-amber-500">❯</span>
            <span>bunx --bun arche create my-app</span>
          </div>
          <button className="h-[52px] w-full rounded-3xl bg-[#F0F0F3] px-8 font-semibold text-slate-700 shadow-[6px_6px_12px_#d1d1d4,-6px_-6px_12px_#ffffff] transition-shadow duration-200 hover:text-amber-600 active:shadow-[inset_4px_4px_8px_#d1d1d4,inset_-4px_-4px_8px_#ffffff] sm:w-auto">
            Copy
          </button>
        </div>

        {/* Embossed Features Grid */}
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: 'Create',
              desc: 'Pick a family. Answer 5 prompts. Get a working monorepo in seconds.',
            },
            {
              title: 'Type-Safe',
              desc: 'End-to-end types from database schema through tRPC to your frontend.',
            },
            {
              title: 'Auth Ready',
              desc: 'Better Auth with social providers, sessions, and protected routes.',
            },
          ].map((feat, i) => (
            <div
              key={i}
              className="rounded-[2rem] bg-[#F0F0F3] p-8 shadow-[8px_8px_16px_#d1d1d4,-8px_-8px_16px_#ffffff]"
            >
              <h3 className="mb-3 text-xl font-bold text-slate-700">{feat.title}</h3>
              <p className="text-[15px] leading-relaxed font-medium text-slate-500">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
