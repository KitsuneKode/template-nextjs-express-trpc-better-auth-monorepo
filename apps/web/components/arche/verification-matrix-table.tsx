'use client'

import {
  PRESETS,
  PRESET_VERIFICATION_MATRIX,
  VERIFICATION_MATRIX_COLUMNS,
  formatSupportStatus,
} from '@arche-template/registry'

function cellMark(value: boolean) {
  return value ? (
    <span className="text-emerald-400" aria-label="verified">
      yes
    </span>
  ) : (
    <span className="text-zinc-600" aria-label="not verified">
      no
    </span>
  )
}

export function VerificationMatrixTable() {
  const productPresets = PRESETS.filter(
    (preset) => preset.id !== 'customize' && preset.id !== 'experiments',
  )

  return (
    <div className="w-full overflow-x-auto border border-zinc-800 bg-black">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-zinc-800 bg-zinc-900/50 font-mono tracking-widest text-zinc-400 uppercase">
          <tr>
            <th className="sticky left-0 border-r border-zinc-800 bg-zinc-900/95 px-4 py-3 font-medium">
              Preset
            </th>
            {VERIFICATION_MATRIX_COLUMNS.map((column) => (
              <th
                key={column.key}
                className="border-r border-zinc-800 px-3 py-3 font-medium last:border-r-0"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productPresets.map((preset) => {
            const evidence = PRESET_VERIFICATION_MATRIX[preset.id]
            return (
              <tr key={preset.id} className="border-b border-zinc-800 last:border-b-0">
                <td className="sticky left-0 border-r border-zinc-800 bg-black px-4 py-3">
                  <div className="font-mono font-bold text-white">{preset.id}</div>
                  <div className="mt-1 text-[10px] text-zinc-500">
                    {formatSupportStatus(preset.status)}
                  </div>
                </td>
                {VERIFICATION_MATRIX_COLUMNS.map((column) => (
                  <td
                    key={column.key}
                    className="border-r border-zinc-800 px-3 py-3 text-center font-mono last:border-r-0"
                  >
                    {cellMark(evidence[column.key])}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
