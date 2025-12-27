type LinkDraft = {
  title: string
  url: string
}

type AddLinkModalProps = {
  isOpen: boolean
  formError: string
  draft: LinkDraft
  onClose: () => void
  onSubmit: () => void
  onChange: (draft: LinkDraft) => void
}

export default function AddLinkModal({
  isOpen,
  formError,
  draft,
  onClose,
  onSubmit,
  onChange
}: AddLinkModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add link"
    >
      <div className="absolute inset-0 bg-slate-900/30" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-900">Add a link</h3>
        <p className="text-sm text-slate-600 mt-1">Use a full URL (https://...).</p>

        <div className="mt-5 space-y-3">
          <div>
            <label className="text-sm font-semibold text-slate-700">Title</label>
            <input
              value={draft.title}
              onChange={(e) => onChange({ ...draft, title: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none
                         focus:ring-2 focus:ring-indigo-200"
              placeholder="Instagram"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">URL</label>
            <input
              value={draft.url}
              onChange={(e) => onChange({ ...draft, url: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none
                         focus:ring-2 focus:ring-indigo-200"
              placeholder="https://instagram.com/youruser"
            />
          </div>

          {formError && (
            <p className="text-red-600 text-sm border border-red-200 bg-red-50 rounded-xl p-2">
              {formError}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg
                       hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5
                       active:scale-95 transition-all duration-200"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
