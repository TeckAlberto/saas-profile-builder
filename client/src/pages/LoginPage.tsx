import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FormRow } from '../components/ui/FormRow'
import { MailIcon, LockIcon } from '../components/icons/'
import { AuthHeader } from '../components/ui/AuthHeader'
import { authApi } from '../services/api'
import { useAuthStore } from '../store/authStore'

interface IFieldConfig {
  name: string
  label: string
  type: string
  placeholder: string
  icon: React.ReactNode
}

const formFields: IFieldConfig[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'example@email.com',
    icon: <MailIcon />
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    icon: <LockIcon />
  }
]

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = useAuthStore((state) => state.login)

  const navigate = useNavigate()

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (Object.values(formData).some((val) => val.trim() === '')) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)

    try {
      const data = await authApi.login(formData, { baseUrl: 'http://localhost:4000' })

      login(data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      navigate('/dashboard')
    } catch (error) {
      setError((error as Error).message || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AuthHeader title="Login" subtitle="Welcome back — sign in to access your account." />
      <form className="p-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          {formFields.map(({ name, label, type, placeholder, icon }) => (
            <FormRow
              key={name}
              name={name}
              label={label}
              type={type}
              placeholder={placeholder}
              icon={icon}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center border border-red-600 bg-red-100 rounded-md p-2">
            {error}
          </p>
        )}

        <div className="pt-4">
          <button
            type="submit"
            className={`w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''} bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg 
                       hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5
                       active:scale-95 transition-all duration-200`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          By signing up, you agree to our{' '}
          <a href="#" className="text-indigo-500 hover:underline">
            Terms and Conditions
          </a>
        </p>
      </form>
    </>
  )
}
