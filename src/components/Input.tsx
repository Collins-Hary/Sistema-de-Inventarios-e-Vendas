import { InputHTMLAttributes } from 'react'

export default function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 outline-none transition shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  )
}
