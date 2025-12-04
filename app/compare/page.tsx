'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GitCompare, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ComparePage() {
    const [text1, setText1] = useState('')
    const [text2, setText2] = useState('')
    const [title1, setTitle1] = useState('Document 1')
    const [title2, setTitle2] = useState('Document 2')
    const [isComparing, setIsComparing] = useState(false)
    const [comparison, setComparison] = useState<any>(null)

    const handleCompare = async () => {
        if (!text1.trim() || !text2.trim()) {
            alert('Please enter text for both documents')
            return
        }

        setIsComparing(true)

        try {
            const response = await fetch('/api/compare', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text1,
                    text2,
                    title1,
                    title2
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to compare documents')
            }

            setComparison(data.data)
        } catch (error) {
            console.error('Error:', error)
            alert(error instanceof Error ? error.message : 'Failed to compare documents')
        } finally {
            setIsComparing(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <Link
                        href="/"
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                    </Link>
                    <div className="flex items-center">
                        <GitCompare className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Compare Documents</h1>
                    </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Compare two documents side-by-side with AI-powered analysis
                </p>

                {!comparison ? (
                    <div className="space-y-6">
                        {/* Input Section */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Document 1 */}
                            <motion.div
                                className="card"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <input
                                    type="text"
                                    value={title1}
                                    onChange={(e) => setTitle1(e.target.value)}
                                    placeholder="Document 1 Title"
                                    className="input-field mb-4"
                                />
                                <textarea
                                    value={text1}
                                    onChange={(e) => setText1(e.target.value)}
                                    placeholder="Paste first document here..."
                                    className="input-field h-96 resize-none"
                                    maxLength={50000}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    {text1.length} / 50,000 characters
                                </p>
                            </motion.div>

                            {/* Document 2 */}
                            <motion.div
                                className="card"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <input
                                    type="text"
                                    value={title2}
                                    onChange={(e) => setTitle2(e.target.value)}
                                    placeholder="Document 2 Title"
                                    className="input-field mb-4"
                                />
                                <textarea
                                    value={text2}
                                    onChange={(e) => setText2(e.target.value)}
                                    placeholder="Paste second document here..."
                                    className="input-field h-96 resize-none"
                                    maxLength={50000}
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    {text2.length} / 50,000 characters
                                </p>
                            </motion.div>
                        </div>

                        {/* Compare Button */}
                        <motion.button
                            onClick={handleCompare}
                            disabled={!text1.trim() || !text2.trim() || isComparing}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isComparing ? 'Comparing...' : 'Compare Documents'}
                        </motion.button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Comparison Results */}
                        <motion.div
                            className="card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Comparison Results</h2>
                                <button
                                    onClick={() => setComparison(null)}
                                    className="btn-secondary"
                                >
                                    New Comparison
                                </button>
                            </div>

                            {/* Similarity Score */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Similarity Score</span>
                                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                        {comparison.similarityScore}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-primary-600 to-primary-400 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${comparison.similarityScore}%` }}
                                    />
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Summary</h3>
                                <p className="text-gray-700 dark:text-gray-300">{comparison.summary}</p>
                            </div>

                            {/* Common Points */}
                            {comparison.commonPoints && comparison.commonPoints.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Common Points</h3>
                                    <ul className="space-y-2">
                                        {comparison.commonPoints.map((point: string, index: number) => (
                                            <li key={index} className="flex items-start">
                                                <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                                    ✓
                                                </span>
                                                <span className="text-gray-700 dark:text-gray-300">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Key Differences */}
                            {comparison.keyDifferences && comparison.keyDifferences.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Differences</h3>
                                    <ul className="space-y-2">
                                        {comparison.keyDifferences.map((diff: string, index: number) => (
                                            <li key={index} className="flex items-start">
                                                <span className="flex-shrink-0 w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                                    !
                                                </span>
                                                <span className="text-gray-700 dark:text-gray-300">{diff}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Side-by-Side Unique Points */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Unique to Doc 1 */}
                                {comparison.uniqueToDoc1 && comparison.uniqueToDoc1.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                            Unique to {comparison.doc1Title}
                                        </h3>
                                        <ul className="space-y-2">
                                            {comparison.uniqueToDoc1.map((point: string, index: number) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                                        1
                                                    </span>
                                                    <span className="text-gray-700 dark:text-gray-300">{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Unique to Doc 2 */}
                                {comparison.uniqueToDoc2 && comparison.uniqueToDoc2.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                            Unique to {comparison.doc2Title}
                                        </h3>
                                        <ul className="space-y-2">
                                            {comparison.uniqueToDoc2.map((point: string, index: number) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                                                        2
                                                    </span>
                                                    <span className="text-gray-700 dark:text-gray-300">{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}
