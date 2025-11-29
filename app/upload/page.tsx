'use client'

import { useState } from 'react'
import FileUploader from '@/components/FileUploader'
import TextInputBox from '@/components/TextInputBox'
import { FileText, Upload, Youtube, Mic } from 'lucide-react'

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState<'file' | 'text' | 'youtube' | 'audio'>('file')

  const tabs = [
    { id: 'file' as const, label: 'Upload File', icon: Upload },
    { id: 'text' as const, label: 'Text Input', icon: FileText },
    { id: 'youtube' as const, label: 'YouTube', icon: Youtube },
    { id: 'audio' as const, label: 'Audio', icon: Mic },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Content</h1>
          <p className="text-gray-600">
            Choose your content type and let AI create a summary for you
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 font-medium text-sm border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="card">
          {activeTab === 'file' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Upload Document or Image</h3>
              <FileUploader />
            </div>
          )}

          {activeTab === 'text' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Paste Your Text</h3>
              <TextInputBox />
            </div>
          )}

          {activeTab === 'youtube' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">YouTube Video</h3>
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="Paste YouTube URL here..."
                  className="input-field"
                />
                <button className="btn-primary">
                  Extract & Summarize
                </button>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Audio File</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Drop your audio file here</p>
                  <p className="text-sm text-gray-500">Supports MP3, WAV, M4A files</p>
                  <button className="btn-secondary mt-4">
                    Choose Audio File
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}