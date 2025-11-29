import type { NextApiRequest, NextApiResponse } from 'next'
import { summarizeText } from '@/lib/gemini'
import { saveSummary } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { text, title, contentType, options } = req.body

    if (!text || !title) {
      return res.status(400).json({ error: 'Text and title are required' })
    }

    // Generate summary using Gemini
    const { summary, keyPoints } = await summarizeText(text, options)

    // Save to database
    const savedSummary = await saveSummary({
      title,
      content: text,
      summary,
      key_points: keyPoints,
      content_type: contentType || 'text'
    })

    res.status(200).json({
      success: true,
      data: savedSummary
    })
  } catch (error) {
    console.error('Summarization error:', error)
    res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}