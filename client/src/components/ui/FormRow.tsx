import React from 'react'

interface FormRowProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: React.ReactNode
}

export const FormRow = ({ label, icon, className, ...props }: FormRowProps) => {
  return (
    <div
      className={`group flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-slate-50 ${className || ''}`}
    >
      <label
        className="text-slate-500 font-semibold text-sm w-1/3 cursor-pointer"
        htmlFor={props.name}
      >
        {label}
      </label>

      <div className="relative w-2/3">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
            {icon}
          </div>
        )}

        <input
          {...props}
          id={props.id || props.name}
          className={`
            w-full py-2 pr-3 bg-white border border-slate-200 rounded-lg text-sm shadow-sm placeholder-slate-400
            focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
            transition duration-200 ease-in-out
            ${icon ? 'pl-10' : 'pl-3'} 
            ${props.disabled ? 'bg-slate-100 cursor-not-allowed' : ''}
          `}
        />
      </div>
    </div>
  )
}
