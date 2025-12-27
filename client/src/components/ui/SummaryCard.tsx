type SummaryCardProps = {
  profileUrl: string
  copied: boolean
  onCopy: () => void
  onAddLink: () => void
  onLogout: () => void
  onPreview: () => void
  canCopy: boolean
}

export default function SummaryCard({
  profileUrl,
  copied,
  onCopy,
  onAddLink,
  onLogout,
  onPreview,
  canCopy
}: SummaryCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900">Your page</h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage the links people will see when they open your profile.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 truncate">
              {profileUrl}
            </div>

            <button
              onClick={onCopy}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg
                         hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5
                         active:scale-95 transition-all duration-200"
              disabled={!canCopy}
            >
              {copied ? 'Copied!' : 'Copy link'}
            </button>

            <button
              onClick={onPreview}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm
                         hover:bg-slate-50 transition"
            >
              Preview
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onAddLink}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg
                       hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5
                       active:scale-95 transition-all duration-200"
          >
            Add link
          </button>

          <button
            onClick={onLogout}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm
                       hover:bg-slate-50 transition"
          >
            Log out
          </button>
        </div>
      </div>
    </section>
  )
}
