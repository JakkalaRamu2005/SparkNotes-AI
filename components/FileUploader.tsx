'use client'

import { useState, useCallback } from 'react'
import { Upload, File, Image, FileText } from 'lucide-react'

export default function FileUploader() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles(prev => [...prev, ...newFiles])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image
    if (file.type === 'application/pdf') return FileText
    return File
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">
          Drop your files here, or{' '}
          <label className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium">
            browse
            <input
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              onChange={handleFileSelect}
            />
          </label>
        </p>
        <p className="text-sm text-gray-500">
          Supports PDF, DOC, TXT, JPG, PNG (Max 20MB each)
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Selected Files:</h4>
          {files.map((file, index) => {
            const Icon = getFileIcon(file)
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Icon className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <button className="btn-primary w-full">
          Process {files.length} File{files.length > 1 ? 's' : ''}
        </button>
      )}
    </div>
  )
}