import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import { uploadFile } from '@/lib/supabase'

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

      const file = Array.isArray(files.file) ? files.file[0] : files.file
      
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      // Validate file size (20MB limit for Gemini)
      if (file.size > 20 * 1024 * 1024) {
        return res.status(400).json({ error: 'File too large (max 20MB)' })
      }

      // Read file and create File object for upload
      const fileBuffer = fs.readFileSync(file.filepath)
      const fileBlob = new File([fileBuffer], file.originalFilename || 'upload', {
        type: file.mimetype || 'application/octet-stream'
      })

      // Upload to Supabase Storage
      const uploadResult = await uploadFile(fileBlob)

      res.status(200).json({
        success: true,
        data: {
          path: uploadResult.path,
          fullPath: uploadResult.fullPath,
          fileName: file.originalFilename,
          fileSize: file.size,
          mimeType: file.mimetype
        }
      })
    })
  } catch (error) {
    console.error('File upload error:', error)
    res.status(500).json({ 
      error: 'File upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}