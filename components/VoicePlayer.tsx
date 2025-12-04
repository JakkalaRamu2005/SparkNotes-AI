'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, Square, Volume2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { getTextToSpeech } from '@/lib/textToSpeech'

interface VoicePlayerProps {
    text: string
    className?: string
}

export default function VoicePlayer({ text, className = '' }: VoicePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [rate, setRate] = useState(1)
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)

    useEffect(() => {
        // Load voices
        const loadVoices = () => {
            const tts = getTextToSpeech()
            const availableVoices = tts.getVoices()
            setVoices(availableVoices)
            if (availableVoices.length > 0 && !selectedVoice) {
                setSelectedVoice(availableVoices[0])
            }
        }

        loadVoices()

        // Voices might load asynchronously
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices
        }

        return () => {
            const tts = getTextToSpeech()
            tts.stop()
        }
    }, [])

    const handlePlay = () => {
        const tts = getTextToSpeech()

        if (isPaused) {
            tts.resume()
            setIsPaused(false)
            setIsPlaying(true)
        } else {
            tts.speak(text, {
                rate,
                voice: selectedVoice || undefined
            })
            setIsPlaying(true)
            setIsPaused(false)
        }
    }

    const handlePause = () => {
        const tts = getTextToSpeech()
        tts.pause()
        setIsPaused(true)
        setIsPlaying(false)
    }

    const handleStop = () => {
        const tts = getTextToSpeech()
        tts.stop()
        setIsPlaying(false)
        setIsPaused(false)
    }

    return (
        <div className={`card ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Volume2 className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Listen to Summary</h3>
                </div>
            </div>

            <div className="space-y-4">
                {/* Playback Controls */}
                <div className="flex items-center space-x-2">
                    {!isPlaying && !isPaused && (
                        <motion.button
                            onClick={handlePlay}
                            className="btn-primary flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Play className="h-4 w-4 mr-2" />
                            Play
                        </motion.button>
                    )}

                    {isPlaying && (
                        <motion.button
                            onClick={handlePause}
                            className="btn-secondary flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                        </motion.button>
                    )}

                    {isPaused && (
                        <motion.button
                            onClick={handlePlay}
                            className="btn-primary flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                        </motion.button>
                    )}

                    {(isPlaying || isPaused) && (
                        <motion.button
                            onClick={handleStop}
                            className="btn-secondary flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Square className="h-4 w-4 mr-2" />
                            Stop
                        </motion.button>
                    )}
                </div>

                {/* Speed Control */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Speed: {rate}x
                    </label>
                    <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="w-full"
                    />
                </div>

                {/* Voice Selection */}
                {voices.length > 0 && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Voice
                        </label>
                        <select
                            value={selectedVoice?.name || ''}
                            onChange={(e) => {
                                const voice = voices.find(v => v.name === e.target.value)
                                setSelectedVoice(voice || null)
                            }}
                            className="input-field"
                        >
                            {voices.map((voice) => (
                                <option key={voice.name} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    )
}
