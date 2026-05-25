import { ImageResponse } from 'next/og'

import { getArcheMarkDataUri } from '@/lib/brand/mark-data-uri'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
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
      <img src={getArcheMarkDataUri()} alt="" width={132} height={132} />
    </div>,
    size,
  )
}
