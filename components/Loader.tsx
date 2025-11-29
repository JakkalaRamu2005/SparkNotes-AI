import { Sparkles } from 'lucide-react'

interface LoaderProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Loader({ message = 'Processing...', size = 'md' }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <Sparkles 
          className={`${sizeClasses[size]} text-primary-600 animate-spin`} 
        />
        <div className="absolute inset-0 animate-ping">
          <Sparkles 
            className={`${sizeClasses[size]} text-primary-300`} 
          />
        </div>
      </div>
      
      <p className={`mt-4 text-gray-600 font-medium ${textSizeClasses[size]}`}>
        {message}
      </p>
      
      <div className="flex space-x-1 mt-2">
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  )
}