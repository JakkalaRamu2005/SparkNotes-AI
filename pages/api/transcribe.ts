import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import { processAudioFile } from '@/lib/whisper'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = new IncomingForm()
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'File parsing failed' })
      }

      const file = Array.isArray(files.audio) ? files.audio[0] : files.audio
      const language = Array.isArray(fields.language) ? fields.language[0] : fields.language
      
      if (!file) {
        return res.status(400).json({ error: 'No audio file uploaded' })
      }

      // Validate file type
      const supportedTypes = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 'audio/ogg']
      if (!file.mimetype || !supportedTypes.includes(file.mimetype)) {
        return res.status(400).json({ 
          error: 'Unsupported audio format. Please use MP3, MP4, WAV, WebM, or OGG.' 
        })
      }

      // Read file and create File object
      const fileBuffer = fs.readFileSync(file.filepath)
      const audioFile = new File([fileBuffer], file.originalFilename || 'audio', {
        type: file.mimetype
      })

      // Process with Gemini
      const transcriptionResult = await processAudioFile(
        audioFile,
        { language: language as string }
      )

      res.status(200).json({
        success: true,
        data: {
          text: transcriptionResult.text,
          language: transcriptionResult.language,
          fileName: file.originalFilename,
          method: 'gemini'
        }
      })
    })
  } catch (error) {
    console.error('Audio transcription error:', error)
    res.status(500).json({ 
      error: 'Audio transcription failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}