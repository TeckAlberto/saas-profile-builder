interface AuthHeaderProps {
  title: string
  subtitle: string
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <div className="bg-indigo-600 p-6 text-center">
      <h2 className="text-3xl font-bold text-white tracking-wide">{title}</h2>
      <p className="text-indigo-200 mt-2 text-sm">{subtitle}</p>
    </div>
  )
}
