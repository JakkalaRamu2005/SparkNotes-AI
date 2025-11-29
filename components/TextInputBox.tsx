'use client'

import { useState } from 'react'
import { FileText } from 'lucide-react'

export default function TextInputBox() {
  const [text, setText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setIsProcessing(true)
    // TODO: Implement text processing
    setTimeout(() => {
      setIsProcessing(false)
    }, 2000)
  }

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here for AI summarization..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          maxLength={50000}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-500">
          {wordCount} words
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <FileText className="h-4 w-4 mr-1" />
          <span>Max 50,000 characters</span>
        </div>
        
        <button
          type="submit"
          disabled={!text.trim() || isProcessing}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Summarize Text'}
        </button>
      </div>
    </form>
  )
}