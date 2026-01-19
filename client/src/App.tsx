import { Outlet, Link, useLocation } from 'react-router-dom'

function PublicHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <Link to="/home" className="font-extrabold text-slate-900 tracking-tight">
          LinkHub
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            to="/auth/login"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            Login
          </Link>

          <Link
            to="/auth/register"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
          >
            Create account
          </Link>
        </nav>
      </div>
    </header>
  )
}

function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="font-extrabold text-slate-900 tracking-tight">
          LinkHub
        </Link>

        <div className="text-sm text-slate-500">Your dashboard</div>
      </div>
    </header>
  )
}

function RootLayoutContainer({
  variant,
  children
}: {
  variant: 'public' | 'app' | 'auth'
  children: React.ReactNode
}) {
  const base = 'min-h-screen flex flex-col'
  const bg =
    variant === 'public' ? 'bg-slate-50' : variant === 'app' ? 'bg-slate-50' : 'bg-slate-50'
  return <div className={`${base} ${bg}`}>{children}</div>
}

export default function App() {
  const location = useLocation()
  const path = location.pathname

  const isAuth = path.startsWith('/auth')
  const isApp = path.startsWith('/dashboard')
  const isPublic = !isAuth && !isApp

  return (
    <RootLayoutContainer variant={isAuth ? 'auth' : isApp ? 'app' : 'public'}>
      {isPublic && <PublicHeader />}
      {isApp && <AppHeader />}

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>

      {isPublic && (
        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-slate-500">
            Built for sharing all your links in one place.
          </div>
        </footer>
      )}
    </RootLayoutContainer>
  )
}
