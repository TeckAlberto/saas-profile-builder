import type { Link } from '../../services/api'

type LinksListProps = {
  links: Link[]
  onAddLink: () => void
}

export default function LinksList({ links, onAddLink }: LinksListProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Links</h2>
          {links.length > 1 ? (
            <p className="text-sm text-slate-600 mt-1">Manage your profile links here.</p>
          ) : null}
        </div>

        <div className="text-sm text-slate-500">
          {links.length} {links.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {links.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-700 font-semibold">No links yet.</p>
          <p className="text-sm text-slate-600 mt-1">
            Add your first link (Instagram, website, portfolio, whatever makes you look like a real
            person).
          </p>

          <button
            onClick={onAddLink}
            className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg
                       hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5
                       active:scale-95 transition-all duration-200"
          >
            Add your first link
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{link.title}</p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-indigo-600 hover:underline break-all"
                >
                  {link.url}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className={`rounded-xl px-3 py-2 text-sm font-semibold shadow-sm border transition
                    ${
                      link.isActive
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  aria-pressed={link.isActive}
                >
                  {link.isActive ? 'Active' : 'Inactive'}
                </button>

                <button
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                  aria-label={`Remove ${link.title}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
