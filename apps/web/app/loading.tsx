export default function Loading() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[94]"
    >
      <div className="h-[3px] w-full animate-pulse bg-gradient-to-r from-[#d7ae7f] via-[#f2d6b1] to-[#67c8ba]" />
      <div className="h-px w-full bg-[#67c8ba]/35" />
    </div>
  )
}
