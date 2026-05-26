import {
  formatSupportStatus,
  PUBLIC_PRESET_ENTRY_ROWS,
  devScaffoldCommand,
} from '@/lib/presets-public'

export function PresetRegistryTable() {
  return (
    <div className="not-prose my-10 overflow-hidden border border-zinc-800">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              <th className="px-4 py-3 font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                Preset
              </th>
              <th className="px-4 py-3 font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                Status
              </th>
              <th className="px-4 py-3 font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                Shape
              </th>
              <th className="px-4 py-3 font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                Good for
              </th>
            </tr>
          </thead>
          <tbody>
            {PUBLIC_PRESET_ENTRY_ROWS.map((row) => (
              <tr key={row.id} className="border-b border-zinc-800/80 align-top">
                <td className="px-4 py-4">
                  <div className="font-mono text-xs font-semibold text-amber-200/90">{row.id}</div>
                  <div className="mt-1 text-zinc-300">{row.label}</div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={
                      row.status === 'experimental'
                        ? 'text-amber-400'
                        : row.status === 'stable'
                          ? 'text-emerald-400'
                          : 'text-zinc-400'
                    }
                  >
                    {formatSupportStatus(row.status)}
                  </span>
                </td>
                <td className="px-4 py-4 text-pretty text-zinc-400">{row.shape}</td>
                <td className="px-4 py-4 text-pretty text-zinc-500">{row.goodFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-zinc-800 bg-zinc-950/50 px-4 py-3 font-mono text-[10px] text-zinc-500">
        Example: <span className="text-zinc-300">{devScaffoldCommand('typescript-fullstack')}</span>
      </p>
    </div>
  )
}
