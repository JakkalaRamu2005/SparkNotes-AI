'use client'

import { Clock, FileText, Key } from 'lucide-react'
import VoicePlayer from './VoicePlayer'

interface SummaryData {
  id: string
  title: string
  originalContent: string
  summary: string
  keyPoints: string[]
  createdAt: string
  contentType: 'document' | 'image' | 'audio' | 'youtube' | 'text'
}

interface SummaryCardProps {
  summary: SummaryData
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{summary.title}</h2>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            {formatDate(summary.createdAt)}
          </div>
        </div>

        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
          {summary.contentType.charAt(0).toUpperCase() + summary.contentType.slice(1)}
        </div>
      </div>

      {/* AI Summary */}
      <div className="card">
        <div className="flex items-center mb-4">
          <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Summary</h3>
        </div>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{summary.summary}</p>
        </div>
      </div>

      {/* Voice Player */}
      <VoicePlayer text={summary.summary} />

      {/* Key Points */}
      {summary.keyPoints.length > 0 && (
        <div className="card">
          <div className="flex items-center mb-4">
            <Key className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Key Points</h3>
          </div>
          <ul className="space-y-2">
            {summary.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Original Content Preview */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Original Content</h3>
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 max-h-64 overflow-y-auto">
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {summary.originalContent}
          </p>
        </div>
      </div>
    </div>
  )
}