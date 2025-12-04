import type { NextApiRequest, NextApiResponse } from 'next'
import { summarizeText } from '@/lib/gemini'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const { text1, text2, title1 = 'Document 1', title2 = 'Document 2' } = req.body

        if (!text1 || !text2) {
            return res.status(400).json({ error: 'Both documents are required' })
        }

        // Create comparison prompt
        const comparisonPrompt = `You are an expert at comparing and analyzing documents. Compare the following two documents and provide a detailed analysis.

Document 1 (${title1}):
${text1}

Document 2 (${title2}):
${text2}

Please provide your analysis as JSON with this structure:
{
  "summary": "Overall comparison summary",
  "similarityScore": 85,
  "commonPoints": ["Point 1", "Point 2", "Point 3"],
  "uniqueToDoc1": ["Unique point 1", "Unique point 2"],
  "uniqueToDoc2": ["Unique point 1", "Unique point 2"],
  "keyDifferences": ["Difference 1", "Difference 2", "Difference 3"]
}

The similarityScore should be a number between 0-100 indicating how similar the documents are.`

        const model = require('@google/generative-ai').GoogleGenerativeAI
        const genAI = new model(process.env.GEMINI_API_KEY!)
        const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

        const result = await geminiModel.generateContent(comparisonPrompt)
        const response = result.response
        const responseText = response.text()

        if (!responseText) throw new Error('No response from Gemini')

        // Clean up the response to extract JSON
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            throw new Error('Invalid JSON response from Gemini')
        }

        const comparison = JSON.parse(jsonMatch[0])

        res.status(200).json({
            success: true,
            data: {
                ...comparison,
                doc1Title: title1,
                doc2Title: title2,
                doc1Content: text1,
                doc2Content: text2
            }
        })
    } catch (error) {
        console.error('Comparison error:', error)
        res.status(500).json({
            error: 'Failed to compare documents',
            details: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}
