import { extractTextFromImage as geminiExtractText } from './gemini'
import { createWorker } from 'tesseract.js'

export interface OCRResult {
  text: string
  confidence: number
  method: 'gemini' | 'tesseract'
}

export const extractTextFromImage = async (
  imageFile: File,
  useGemini: boolean = true
): Promise<OCRResult> => {
  if (useGemini) {
    try {
      const text = await geminiExtractText(imageFile)
      return {
        text,
        confidence: 95, // Gemini typically has high accuracy
        method: 'gemini'
      }
    } catch (error) {
      console.warn('Gemini OCR failed, falling back to Tesseract:', error)
      // Fall back to Tesseract if Gemini fails
    }
  }

  // Tesseract fallback
  const worker = await createWorker('eng')
  try {
    const { data } = await worker.recognize(imageFile)
    return {
      text: data.text,
      confidence: data.confidence,
      method: 'tesseract'
    }
  } catch (error) {
    console.error('OCR processing error:', error)
    throw new Error('Failed to extract text from image')
  } finally {
    await worker.terminate()
  }
}

export const processImageForOCR = async (imageFile: File): Promise<OCRResult> => {
  // Validate file type
  if (!imageFile.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }

  // Check file size (limit to 20MB for Gemini)
  if (imageFile.size > 20 * 1024 * 1024) {
    throw new Error('Image file too large (max 20MB)')
  }

  return await extractTextFromImage(imageFile, true)
}

export default {
  extractTextFromImage,
  processImageForOCR
}