export interface VoiceOptions {
    rate?: number
    pitch?: number
    volume?: number
    voice?: SpeechSynthesisVoice
}

export class TextToSpeech {
    private synth: SpeechSynthesis
    private utterance: SpeechSynthesisUtterance | null = null
    private isPaused: boolean = false

    constructor() {
        if (typeof window !== 'undefined') {
            this.synth = window.speechSynthesis
        } else {
            throw new Error('Speech Synthesis not supported')
        }
    }

    speak(text: string, options: VoiceOptions = {}) {
        // Cancel any ongoing speech
        this.stop()

        this.utterance = new SpeechSynthesisUtterance(text)

        // Set options
        this.utterance.rate = options.rate || 1
        this.utterance.pitch = options.pitch || 1
        this.utterance.volume = options.volume || 1

        if (options.voice) {
            this.utterance.voice = options.voice
        }

        this.isPaused = false
        this.synth.speak(this.utterance)
    }

    pause() {
        if (this.synth.speaking && !this.isPaused) {
            this.synth.pause()
            this.isPaused = true
        }
    }

    resume() {
        if (this.isPaused) {
            this.synth.resume()
            this.isPaused = false
        }
    }

    stop() {
        this.synth.cancel()
        this.isPaused = false
        this.utterance = null
    }

    getVoices(): SpeechSynthesisVoice[] {
        return this.synth.getVoices()
    }

    isSpeaking(): boolean {
        return this.synth.speaking
    }

    isPausedState(): boolean {
        return this.isPaused
    }
}

// Singleton instance
let ttsInstance: TextToSpeech | null = null

export const getTextToSpeech = (): TextToSpeech => {
    if (!ttsInstance) {
        ttsInstance = new TextToSpeech()
    }
    return ttsInstance
}

export default {
    TextToSpeech,
    getTextToSpeech
}
