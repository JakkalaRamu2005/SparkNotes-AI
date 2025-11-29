# SparkNotes AI

An AI-powered web application for summarizing various types of content including documents, images, audio files, and YouTube videos.

## Features

- 📄 **Document Processing**: Upload PDFs, DOCs, and text files
- 🖼️ **Image OCR**: Extract text from images using Gemini Vision + Tesseract.js fallback
- 🎵 **Audio Transcription**: Convert audio to text using Gemini Audio
- 📺 **YouTube Integration**: Extract and summarize YouTube video transcripts
- 🤖 **AI Summarization**: Generate intelligent summaries using Google Gemini 2.0 Flash
- 💾 **Data Storage**: Store summaries and files using Supabase

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **AI Services**: Google Gemini 2.0 Flash (Free)
- **OCR**: Gemini Vision + Tesseract.js fallback
- **Database**: Supabase
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google AI Studio API key (Gemini - Free)
- Supabase project

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd sparknotes-ai
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit `.env.local` with your API keys:
- `GEMINI_API_KEY`: Your Google AI Studio API key (Free from https://aistudio.google.com/)
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── upload/            # Upload page
│   └── summary/[id]/      # Summary display page
├── components/            # React components
│   ├── Navbar.tsx
│   ├── FileUploader.tsx
│   ├── TextInputBox.tsx
│   ├── SummaryCard.tsx
│   └── Loader.tsx
├── lib/                   # Utility libraries
│   ├── supabase.ts       # Supabase client
│   ├── gemini.ts         # Gemini AI integration
│   ├── ocr.ts            # OCR processing (Gemini + Tesseract)
│   └── whisper.ts        # Audio transcription (Gemini)
├── pages/api/            # API routes
│   ├── summarize.ts      # Text summarization
│   ├── upload-file.ts    # File upload
│   ├── ocr.ts            # Image OCR
│   ├── transcribe.ts     # Audio transcription
│   └── youtube.ts        # YouTube transcript + summary
└── styles/               # Global styles
    └── globals.css
\`\`\`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details."# SparkNotes-AI" 
