import { transcribeAudio } from './gemini'

export interface TranscriptionOptions {
  language?: string
  prompt?: string
}

export interface TranscriptionResult {
  text: string
  language?: string
}

export const processAudioFile = async (
  audioFile: File,
  options: TranscriptionOptions = {}
): Promise<TranscriptionResult> => {
  // Validate file type
  const supportedTypes = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 'audio/ogg']
  if (!supportedTypes.includes(audioFile.type)) {
    throw new Error('Unsupported audio format. Please use MP3, MP4, WAV, WebM, or OGG.')
  }

  // Check file size (Gemini limit is typically 20MB)
  if (audioFile.size > 20 * 1024 * 1024) {
    throw new Error('Audio file too large (max 20MB)')
  }

  try {
    const text = await transcribeAudio(audioFile)
    
    return {
      text,
      language: 'auto-detected'
    }
  } catch (error) {
    console.error('Gemini transcription error:', error)
    throw new Error('Failed to transcribe audio')
  }
}

export default {
  processAudioFile
}