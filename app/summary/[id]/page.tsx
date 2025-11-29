import { notFound } from 'next/navigation'
import SummaryCard from '@/components/SummaryCard'
import { ArrowLeft, Download, Share } from 'lucide-react'
import Link from 'next/link'

interface SummaryPageProps {
  params: {
    id: string
  }
}

export default function SummaryPage({ params }: SummaryPageProps) {
  // TODO: Fetch summary data based on ID
  const summaryData = {
    id: params.id,
    title: 'Sample Document Summary',
    originalContent: 'This is a placeholder for the original content...',
    summary: 'This is a placeholder for the AI-generated summary...',
    keyPoints: [
      'Key point 1 from the content',
      'Key point 2 from the content',
      'Key point 3 from the content',
    ],
    createdAt: new Date().toISOString(),
    contentType: 'document' as const,
  }

  if (!summaryData) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Summary Results</h1>
          </div>
          
          <div className="flex space-x-2">
            <button className="btn-secondary flex items-center">
              <Share className="h-4 w-4 mr-2" />
              Share
            </button>
            <button className="btn-secondary flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Summary Content */}
        <SummaryCard summary={summaryData} />

        {/* Additional Actions */}
        <div className="mt-8 text-center">
          <Link href="/upload" className="btn-primary">
            Create Another Summary
          </Link>
        </div>
      </div>
    </div>
  )
}