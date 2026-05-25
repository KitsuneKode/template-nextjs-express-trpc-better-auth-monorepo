import { ImageResponse } from 'next/og'

import { getArcheMarkDataUri } from '@/lib/brand/mark-data-uri'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505',
      }}
    >
      <img src={getArcheMarkDataUri()} alt="" width={26} height={26} />
    </div>,
    size,
  )
}
