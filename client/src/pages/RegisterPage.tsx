import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { FormRow } from '../components/ui/FormRow'
import { UserIcon, MailIcon, LockIcon } from '../components/icons/'
import { AuthHeader } from '../components/ui/AuthHeader'
import { api } from '../services/api'

interface IFieldConfig {
  name: string
  label: string
  type: string
  placeholder: string
  icon: React.ReactNode
}

const formFields: IFieldConfig[] = [
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'username',
    icon: <UserIcon />
  },
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
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: '••••••••',
    icon: <LockIcon />
  }
]

export default function RegisterPage() {
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<Record<string, string>>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

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

    setError('')

    if (Object.values(formData).some((val) => val.trim() === '')) {
      setError('Please fill in all fields.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await api.post('/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      })

      navigate('/auth/login')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AuthHeader title="Create Account" subtitle="Join us to get started" />

      <form className="p-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          {formFields.map((field, index) => (
            <div key={field.name}>
              <FormRow {...field} value={formData[field.name]} onChange={handleChange} />

              {index < formFields.length - 1 && (
                <div className="border-t border-slate-100 mx-2 my-1"></div>
              )}
            </div>
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
            {loading ? 'Creating Account...' : 'Register'}
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
