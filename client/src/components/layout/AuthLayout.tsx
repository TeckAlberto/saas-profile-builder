import { Outlet } from 'react-router-dom'

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-100 via-purple-50 to-pink-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <Outlet />
      </div>
    </div>
  )
}
