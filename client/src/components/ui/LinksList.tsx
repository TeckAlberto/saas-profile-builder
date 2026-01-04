import { useMemo } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Link } from '../../services/api'

type LinksListProps = {
  links: Link[]
  onAddLink: () => void
  onRequestRemove: (link: Link) => void
  onReorder: (links: Link[]) => void
}

type SortableLinkRowProps = {
  link: Link
  onRequestRemove: (link: Link) => void
}

function SortableLinkRow({ link, onRequestRemove }: SortableLinkRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
        isDragging ? 'ring-2 ring-indigo-200 shadow-md' : ''
      }`}
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
          type="button"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm hover:bg-slate-50 transition cursor-grab active:cursor-grabbing"
          aria-label={`Reorder ${link.title}`}
          {...attributes}
          {...listeners}
        >
          Drag
        </button>
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
          onClick={() => onRequestRemove(link)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          aria-label={`Remove ${link.title}`}
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default function LinksList({
  links,
  onAddLink,
  onRequestRemove,
  onReorder
}: LinksListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const linkIds = useMemo(() => links.map((link) => link.id), [links])

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={({ active, over }) => {
            if (!over || active.id === over.id) return
            const oldIndex = links.findIndex((link) => link.id === active.id)
            const newIndex = links.findIndex((link) => link.id === over.id)
            if (oldIndex === -1 || newIndex === -1) return
            onReorder(arrayMove(links, oldIndex, newIndex))
          }}
        >
          <SortableContext items={linkIds} strategy={verticalListSortingStrategy}>
            <div className="mt-6 space-y-3">
              {links.map((link) => (
                <SortableLinkRow key={link.id} link={link} onRequestRemove={onRequestRemove} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </section>
  )
}
