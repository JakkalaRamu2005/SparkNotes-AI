import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import { processImageForOCR } from '@/lib/ocr'

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

      const file = Array.isArray(files.image) ? files.image[0] : files.image
      
      if (!file) {
        return res.status(400).json({ error: 'No image file uploaded' })
      }

      // Validate file type
      if (!file.mimetype?.startsWith('image/')) {
        return res.status(400).json({ error: 'File must be an image' })
      }

      // Read file and create File object
      const fileBuffer = fs.readFileSync(file.filepath)
      const imageFile = new File([fileBuffer], file.originalFilename || 'image', {
        type: file.mimetype
      })

      // Process with Gemini OCR (with Tesseract fallback)
      const ocrResult = await processImageForOCR(imageFile)

      res.status(200).json({
        success: true,
        data: {
          text: ocrResult.text,
          confidence: ocrResult.confidence,
          method: ocrResult.method,
          fileName: file.originalFilename
        }
      })
    })
  } catch (error) {
    console.error('OCR processing error:', error)
    res.status(500).json({ 
      error: 'OCR processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}