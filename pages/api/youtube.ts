import type { NextApiRequest, NextApiResponse } from 'next'
import { YoutubeTranscript } from 'youtube-transcript'
import { summarizeText } from '@/lib/gemini'

interface TranscriptItem {
  text: string
  duration: number
  offset: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { url, summarize = false } = req.body

    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' })
    }

    // Extract video ID from URL
    const videoId = extractVideoId(url)
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' })
    }

    // Get transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)
    
    // Combine transcript items into full text
    const fullText = transcript
      .map((item: TranscriptItem) => item.text)
      .join(' ')
      .replace(/\n/g, ' ')
      .trim()

    if (!fullText) {
      return res.status(404).json({ 
        error: 'No transcript available for this video' 
      })
    }

    let summary = null
    let keyPoints = null

    // Generate summary if requested
    if (summarize) {
      try {
        const summaryResult = await summarizeText(fullText, {
          style: 'detailed',
          maxLength: 800
        })
        summary = summaryResult.summary
        keyPoints = summaryResult.keyPoints
      } catch (summaryError) {
        console.warn('Failed to generate summary:', summaryError)
      }
    }

    res.status(200).json({
      success: true,
      data: {
        videoId,
        text: fullText,
        summary,
        keyPoints,
        duration: transcript.length > 0 ? 
          transcript[transcript.length - 1].offset + transcript[transcript.length - 1].duration : 0,
        segments: transcript.length
      }
    })
  } catch (error) {
    console.error('YouTube transcript error:', error)
    
    if (error instanceof Error && error.message.includes('Transcript is disabled')) {
      return res.status(404).json({ 
        error: 'Transcript is not available for this video' 
      })
    }

    res.status(500).json({ 
      error: 'Failed to fetch YouTube transcript',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}