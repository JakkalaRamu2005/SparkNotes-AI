import Link from 'next/link'
import { Sparkles, Menu } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">SparkNotes AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/upload" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Upload
            </Link>
            <div className="text-gray-400 font-medium cursor-not-allowed">
              History
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  )
}