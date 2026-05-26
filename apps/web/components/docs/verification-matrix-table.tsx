import {
  PRESET_VERIFICATION_MATRIX,
  PRESETS,
  VERIFICATION_MATRIX_COLUMNS,
  formatSupportStatus,
} from '@arche-template/registry'

function cell(value: boolean) {
  return value ? (
    <span className="text-emerald-400" aria-label="yes">
      yes
    </span>
  ) : (
    <span className="text-zinc-600" aria-label="no">
      —
    </span>
  )
}

export function VerificationMatrixTable() {
  const columns = VERIFICATION_MATRIX_COLUMNS.filter((col) =>
    PRESETS.some((preset) => {
      const evidence = PRESET_VERIFICATION_MATRIX[preset.id]
      const key = col.key as keyof typeof evidence
      return evidence[key]
    }),
  )

  return (
    <div className="not-prose my-10 overflow-hidden border border-zinc-800">
      <p className="border-b border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-400">
        Evidence recorded in the CLI registry. A preset becomes{' '}
        <strong className="text-white">Stable</strong> only when every required column is green for
        that route.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              <th className="sticky left-0 z-10 bg-zinc-900 px-3 py-2 font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
                Preset
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-2 py-2 text-center font-mono text-[10px] tracking-wide text-zinc-500 uppercase"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRESETS.map((preset) => {
              const evidence = PRESET_VERIFICATION_MATRIX[preset.id]
              return (
                <tr key={preset.id} className="border-b border-zinc-800/80">
                  <td className="sticky left-0 z-10 bg-black px-3 py-2">
                    <div className="font-mono text-[11px] text-zinc-300">{preset.id}</div>
                    <div className="text-[10px] text-zinc-600">
                      {formatSupportStatus(preset.status)}
                    </div>
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-2 py-2 text-center font-mono">
                      {cell(evidence[col.key as keyof typeof evidence])}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
