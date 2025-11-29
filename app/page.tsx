import Link from 'next/link'
import { FileText, Upload, History, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-12 w-12 text-primary-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">SparkNotes AI</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transform any content into clear, concise summaries using AI. 
          Upload documents, images, audio, or YouTube links.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link href="/upload" className="card hover:shadow-md transition-shadow duration-200">
          <div className="text-center">
            <Upload className="h-12 w-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Content</h3>
            <p className="text-gray-600">
              Upload PDFs, images, audio files, or paste YouTube links
            </p>
          </div>
        </Link>

        <div className="card opacity-50">
          <div className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-500">Text Input</h3>
            <p className="text-gray-500">
              Paste text directly for instant summarization
            </p>
            <span className="text-xs text-gray-400 mt-2 block">Coming Soon</span>
          </div>
        </div>

        <div className="card opacity-50">
          <div className="text-center">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-500">History</h3>
            <p className="text-gray-500">
              View and manage your previous summaries
            </p>
            <span className="text-xs text-gray-400 mt-2 block">Coming Soon</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <div className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-full">
          <Sparkles className="h-4 w-4 text-primary-600 mr-2" />
          <span className="text-primary-700 text-sm font-medium">
            Powered by Google Gemini 2.0 Flash
          </span>
        </div>
      </div>
    </div>
  )
}