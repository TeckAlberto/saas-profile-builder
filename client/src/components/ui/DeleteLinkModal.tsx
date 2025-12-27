type DeleteLinkModalProps = {
  isOpen: boolean
  linkTitle: string
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteLinkModal({
  isOpen,
  linkTitle,
  onConfirm,
  onCancel
}: DeleteLinkModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Delete link"
    >
      <div className="absolute inset-0 bg-slate-900/30" onClick={onCancel} />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-900">Delete link</h3>
        <p className="text-sm text-slate-600 mt-1">
          This will remove "{linkTitle}" from your profile.
        </p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-lg
                       hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5
                       active:scale-95 transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
