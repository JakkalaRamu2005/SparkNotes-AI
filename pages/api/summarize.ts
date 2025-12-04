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

    if (!text) {
      return res.status(400).json({ error: 'Text is required' })
    }

    // Generate summary using Gemini
    const { summary, keyPoints } = await summarizeText(text, options)

    // Try to save to database (optional - won't fail if Supabase not configured)
    let savedSummary = null
    try {
      savedSummary = await saveSummary({
        title: title || 'Untitled Summary',
        content: text,
        summary,
        key_points: keyPoints,
        content_type: contentType || 'text'
      })
    } catch (dbError) {
      console.warn('Database save failed (Supabase may not be configured):', dbError)
      // Create a mock response if DB save fails
      savedSummary = {
        id: Date.now().toString(),
        title: title || 'Untitled Summary',
        content: text,
        summary,
        key_points: keyPoints,
        content_type: contentType || 'text',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }

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