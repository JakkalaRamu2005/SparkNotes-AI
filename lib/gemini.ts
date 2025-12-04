import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface SummarizationOptions {
  maxLength?: number
  style?: 'concise' | 'detailed' | 'bullet-points'
  focus?: string
}

export const summarizeText = async (
  text: string,
  options: SummarizationOptions = {}
): Promise<{ summary: string; keyPoints: string[] }> => {
  const { maxLength = 500, style = 'concise', focus } = options

  const prompt = `You are an expert at creating clear, concise summaries. 
  Create a ${style} summary that captures the main ideas and key insights.
  ${focus ? `Focus particularly on: ${focus}` : ''}
  
  Please summarize the following text in approximately ${maxLength} words and return your response as JSON with this structure:
  {
    "summary": "Main summary text",
    "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
  }

  Text to summarize:
  ${text}`

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();

    if (!responseText) throw new Error('No response from Gemini')

    // Clean up the response to extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini')
    }

    const parsed = JSON.parse(jsonMatch[0])
    return {
      summary: parsed.summary,
      keyPoints: parsed.keyPoints || []
    }
  } catch (error) {
    console.error('Gemini summarization error:', error)
    throw new Error('Failed to generate summary')
  }
}

export const extractTextFromImage = async (imageFile: File): Promise<string> => {
  try {
    // Convert file to base64
    const arrayBuffer = await imageFile.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64,
          mimeType: imageFile.type
        }
      },
      { text: 'Extract all text content from this image. Return only the text, no additional commentary.' }
    ]);

    return result.response.text() || ''
  } catch (error) {
    console.error('Gemini image text extraction error:', error)
    throw new Error('Failed to extract text from image')
  }
}

export const transcribeAudio = async (audioFile: File): Promise<string> => {
  try {
    // Convert file to base64
    const arrayBuffer = await audioFile.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64,
          mimeType: audioFile.type
        }
      },
      { text: 'Transcribe the audio content from this file. Return only the transcribed text, no additional commentary.' }
    ]);

    return result.response.text() || ''
  } catch (error) {
    console.error('Gemini audio transcription error:', error)
    throw new Error('Failed to transcribe audio')
  }
}

export default { summarizeText, extractTextFromImage, transcribeAudio }