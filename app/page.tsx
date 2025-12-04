'use client'

import Link from 'next/link'
import { FileText, Upload, History, Sparkles, GitCompare } from 'lucide-react'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="h-12 w-12 text-primary-600 dark:text-primary-400 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">SparkNotes AI</h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Transform any content into clear, concise summaries using AI.
          Upload documents, images, audio, or YouTube links.
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Link href="/upload" className="card hover:shadow-md transition-shadow duration-200 block">
            <div className="text-center">
              <Upload className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Upload Content</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload PDFs, images, audio files, or paste YouTube links
              </p>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link href="/compare" className="card hover:shadow-md transition-shadow duration-200 block">
            <div className="text-center">
              <GitCompare className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Compare Documents</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Compare two documents side-by-side with AI analysis
              </p>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
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
        </motion.div>
      </motion.div>

      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="inline-flex items-center px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-full">
          <Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-2" />
          <span className="text-primary-700 dark:text-primary-300 text-sm font-medium">
            Powered by Google Gemini 2.0 Flash
          </span>
        </div>
      </motion.div>
    </div>
  )
}