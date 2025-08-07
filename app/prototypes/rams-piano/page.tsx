'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import styles from './styles.module.css'

interface Note {
  note: string
  frequency: number
  isBlack: boolean
}

interface TuneNote {
  note: string
  duration: number
  rest?: boolean
}

interface VideoGameTune {
  name: string
  composer: string
  notes: TuneNote[]
  bpm: number
}

const NOTES: Note[] = [
  { note: 'C', frequency: 261.63, isBlack: false },
  { note: 'C#', frequency: 277.18, isBlack: true },
  { note: 'D', frequency: 293.66, isBlack: false },
  { note: 'D#', frequency: 311.13, isBlack: true },
  { note: 'E', frequency: 329.63, isBlack: false },
  { note: 'F', frequency: 349.23, isBlack: false },
  { note: 'F#', frequency: 369.99, isBlack: true },
  { note: 'G', frequency: 392.00, isBlack: false },
  { note: 'G#', frequency: 415.30, isBlack: true },
  { note: 'A', frequency: 440.00, isBlack: false },
  { note: 'A#', frequency: 466.16, isBlack: true },
  { note: 'B', frequency: 493.88, isBlack: false },
]

// Top 10 video game tunes - Extended versions (20-30 seconds each)
const VIDEO_GAME_TUNES: VideoGameTune[] = [
  {
    name: "Super Mario Bros - Main Theme",
    composer: "Koji Kondo",
    bpm: 120,
    notes: [
      // Main melody phrase 1
      { note: "E5", duration: 0.25 }, { note: "E5", duration: 0.25 }, { note: "", duration: 0.25, rest: true }, { note: "E5", duration: 0.25 },
      { note: "", duration: 0.25, rest: true }, { note: "C5", duration: 0.25 }, { note: "E5", duration: 0.25 }, { note: "", duration: 0.25, rest: true },
      { note: "G5", duration: 0.5 }, { note: "", duration: 0.5, rest: true }, { note: "G4", duration: 0.5 }, { note: "", duration: 0.5, rest: true },
      
      // Phrase 2
      { note: "C5", duration: 0.5 }, { note: "", duration: 0.25, rest: true }, { note: "G4", duration: 0.5 }, { note: "", duration: 0.25, rest: true },
      { note: "E4", duration: 0.5 }, { note: "", duration: 0.25, rest: true }, { note: "A4", duration: 0.25 }, { note: "B4", duration: 0.25 },
      { note: "A#4", duration: 0.25 }, { note: "A4", duration: 0.5 },
      
      // Phrase 3
      { note: "G4", duration: 0.33 }, { note: "E5", duration: 0.33 }, { note: "G5", duration: 0.33 }, { note: "A5", duration: 0.5 },
      { note: "F5", duration: 0.25 }, { note: "G5", duration: 0.25 }, { note: "", duration: 0.25, rest: true }, { note: "E5", duration: 0.25 },
      { note: "C5", duration: 0.25 }, { note: "D5", duration: 0.25 }, { note: "B4", duration: 0.5 },
      
      // Repeat main phrase
      { note: "E5", duration: 0.25 }, { note: "E5", duration: 0.25 }, { note: "", duration: 0.25, rest: true }, { note: "E5", duration: 0.25 },
      { note: "", duration: 0.25, rest: true }, { note: "C5", duration: 0.25 }, { note: "E5", duration: 0.25 }, { note: "", duration: 0.25, rest: true },
      { note: "G5", duration: 1 }
    ]
  },
  {
    name: "The Legend of Zelda - Main Theme",
    composer: "Koji Kondo", 
    bpm: 120,
    notes: [
      // Opening fanfare
      { note: "A#4", duration: 1 }, { note: "F5", duration: 0.5 }, { note: "F5", duration: 0.5 }, { note: "F5", duration: 0.5 },
      { note: "G#5", duration: 0.5 }, { note: "A#5", duration: 1 }, { note: "A#5", duration: 0.5 }, { note: "A#5", duration: 0.5 },
      { note: "A#5", duration: 0.5 }, { note: "C6", duration: 0.5 }, { note: "D6", duration: 1 },
      
      // Main melody
      { note: "D6", duration: 0.25 }, { note: "C6", duration: 0.25 }, { note: "A#5", duration: 0.5 }, { note: "G5", duration: 0.25 },
      { note: "F5", duration: 0.25 }, { note: "G5", duration: 0.5 }, { note: "A5", duration: 0.5 }, { note: "A#5", duration: 1 },
      
      // Second phrase
      { note: "A5", duration: 0.25 }, { note: "G5", duration: 0.25 }, { note: "F5", duration: 0.5 }, { note: "G5", duration: 0.5 },
      { note: "A5", duration: 0.5 }, { note: "A#5", duration: 0.5 }, { note: "C6", duration: 0.5 }, { note: "A#5", duration: 0.5 },
      { note: "G5", duration: 0.5 }, { note: "F5", duration: 1 },
      
      // Final phrase
      { note: "F5", duration: 0.25 }, { note: "F5", duration: 0.25 }, { note: "G5", duration: 0.5 }, { note: "A5", duration: 0.5 },
      { note: "A#5", duration: 1.5 }
    ]
  },
  {
    name: "Tetris - Theme A (Korobeiniki)",
    composer: "Hirokazu Tanaka",
    bpm: 150,
    notes: [
      // Main theme A section
      { note: "E5", duration: 0.5 }, { note: "B4", duration: 0.25 }, { note: "C5", duration: 0.25 }, { note: "D5", duration: 0.5 },
      { note: "C5", duration: 0.25 }, { note: "B4", duration: 0.25 }, { note: "A4", duration: 0.5 }, { note: "A4", duration: 0.25 },
      { note: "C5", duration: 0.25 }, { note: "E5", duration: 0.5 }, { note: "D5", duration: 0.25 }, { note: "C5", duration: 0.25 },
      
      { note: "B4", duration: 0.75 }, { note: "C5", duration: 0.25 }, { note: "D5", duration: 0.5 }, { note: "E5", duration: 0.5 },
      { note: "C5", duration: 0.5 }, { note: "A4", duration: 0.5 }, { note: "A4", duration: 1 },
      
      // B section
      { note: "D5", duration: 0.5 }, { note: "F5", duration: 0.25 }, { note: "A5", duration: 0.5 }, { note: "G5", duration: 0.25 },
      { note: "F5", duration: 0.25 }, { note: "E5", duration: 0.75 }, { note: "C5", duration: 0.25 }, { note: "E5", duration: 0.5 },
      { note: "D5", duration: 0.25 }, { note: "C5", duration: 0.25 },
      
      { note: "B4", duration: 0.75 }, { note: "C5", duration: 0.25 }, { note: "D5", duration: 0.5 }, { note: "E5", duration: 0.5 },
      { note: "C5", duration: 0.5 }, { note: "A4", duration: 0.5 }, { note: "A4", duration: 1 },
      
      // Repeat A section
      { note: "E5", duration: 0.5 }, { note: "B4", duration: 0.25 }, { note: "C5", duration: 0.25 }, { note: "D5", duration: 0.5 },
      { note: "C5", duration: 0.25 }, { note: "B4", duration: 0.25 }, { note: "A4", duration: 1 }
    ]
  },
  {
    name: "Pac-Man - Main Theme", 
    composer: "Toshio Kai",
    bpm: 140,
    notes: [
      // Opening phrase
      { note: "C5", duration: 0.25 }, { note: "C6", duration: 0.25 }, { note: "G5", duration: 0.25 }, { note: "E5", duration: 0.25 },
      { note: "C6", duration: 0.25 }, { note: "G5", duration: 0.375 }, { note: "E5", duration: 0.125 }, { note: "C5", duration: 0.25 },
      { note: "C6", duration: 0.25 }, { note: "G5", duration: 0.25 }, { note: "E5", duration: 0.25 },
      
      // Second phrase
      { note: "F5", duration: 0.25 }, { note: "F6", duration: 0.25 }, { note: "C6", duration: 0.25 }, { note: "A5", duration: 0.25 },
      { note: "F6", duration: 0.25 }, { note: "C6", duration: 0.375 }, { note: "A5", duration: 0.125 }, { note: "F5", duration: 0.25 },
      { note: "F6", duration: 0.25 }, { note: "C6", duration: 0.25 }, { note: "A5", duration: 0.25 },
      
      // Third phrase
      { note: "G5", duration: 0.25 }, { note: "G6", duration: 0.25 }, { note: "D6", duration: 0.25 }, { note: "B5", duration: 0.25 },
      { note: "F6", duration: 0.25 }, { note: "E6", duration: 0.25 }, { note: "D6", duration: 0.25 }, { note: "C6", duration: 0.25 },
      { note: "B5", duration: 0.5 }, { note: "C6", duration: 0.5 },
      
      // Final phrase
      { note: "C5", duration: 0.25 }, { note: "G5", duration: 0.25 }, { note: "E5", duration: 0.25 }, { note: "C5", duration: 0.25 },
      { note: "G5", duration: 0.5 }, { note: "C6", duration: 1 }
    ]
  },
  {
    name: "Mega Man 2 - Dr. Wily Stage",
    composer: "Takashi Tateishi",
    bpm: 135,
    notes: [
      // Main riff
      { note: "D5", duration: 0.25 }, { note: "D5", duration: 0.25 }, { note: "D5", duration: 0.5 }, { note: "D5", duration: 0.25 },
      { note: "A#4", duration: 0.25 }, { note: "C5", duration: 0.5 }, { note: "D5", duration: 0.25 }, { note: "D5", duration: 0.25 },
      { note: "D5", duration: 0.5 }, { note: "F5", duration: 0.25 }, { note: "D5", duration: 0.25 },
      
      // Variation
      { note: "A#4", duration: 0.25 }, { note: "A#4", duration: 0.25 }, { note: "A#4", duration: 0.5 }, { note: "A#4", duration: 0.25 },
      { note: "G4", duration: 0.25 }, { note: "A4", duration: 0.5 }, { note: "A#4", duration: 0.25 }, { note: "A#4", duration: 0.25 },
      { note: "A#4", duration: 0.5 }, { note: "D5", duration: 0.25 }, { note: "A#4", duration: 0.25 },
      
      // Higher phrase
      { note: "F5", duration: 0.25 }, { note: "F5", duration: 0.25 }, { note: "F5", duration: 0.5 }, { note: "F5", duration: 0.25 },
      { note: "D5", duration: 0.25 }, { note: "E5", duration: 0.5 }, { note: "F5", duration: 0.25 }, { note: "G5", duration: 0.25 },
      { note: "A5", duration: 0.5 }, { note: "G5", duration: 0.25 }, { note: "F5", duration: 0.25 },
      
      // Return to main
      { note: "D5", duration: 0.25 }, { note: "D5", duration: 0.25 }, { note: "D5", duration: 0.5 }, { note: "D5", duration: 0.25 },
      { note: "A#4", duration: 0.25 }, { note: "C5", duration: 0.5 }, { note: "D5", duration: 1 }
    ]
  },
  {
    name: "Final Fantasy VII - Victory Fanfare",
    composer: "Nobuo Uematsu",
    bpm: 110,
    notes: [
      // Opening fanfare
      { note: "C5", duration: 0.25 }, { note: "C5", duration: 0.25 }, { note: "C5", duration: 0.25 }, { note: "C5", duration: 0.5 },
      { note: "G#4", duration: 0.5 }, { note: "A#4", duration: 0.5 }, { note: "C5", duration: 0.5 }, { note: "A#4", duration: 0.25 },
      { note: "C5", duration: 1 },
      
      // Main melody
      { note: "F5", duration: 0.5 }, { note: "E5", duration: 0.25 }, { note: "F5", duration: 0.25 }, { note: "G5", duration: 0.5 },
      { note: "F5", duration: 0.25 }, { note: "E5", duration: 0.25 }, { note: "D5", duration: 0.5 }, { note: "C5", duration: 0.5 },
      { note: "D5", duration: 0.5 }, { note: "E5", duration: 0.5 }, { note: "F5", duration: 1 },
      
      // Second phrase
      { note: "A#5", duration: 0.5 }, { note: "A5", duration: 0.25 }, { note: "A#5", duration: 0.25 }, { note: "C6", duration: 0.5 },
      { note: "A#5", duration: 0.25 }, { note: "A5", duration: 0.25 }, { note: "G5", duration: 0.5 }, { note: "F5", duration: 0.5 },
      { note: "G5", duration: 0.5 }, { note: "A5", duration: 0.5 }, { note: "A#5", duration: 1 },
      
      // Finale
      { note: "C6", duration: 0.25 }, { note: "C6", duration: 0.25 }, { note: "C6", duration: 0.25 }, { note: "C6", duration: 0.5 },
      { note: "F5", duration: 0.5 }, { note: "G5", duration: 0.5 }, { note: "A#5", duration: 0.5 }, { note: "C6", duration: 1.5 }
    ]
  },
  {
    name: "Sonic the Hedgehog - Green Hill Zone",
    composer: "Masato Nakamura", 
    bpm: 125,
    notes: [
      // Main melody line 1
      { note: "D5", duration: 0.25 }, { note: "D5", duration: 0.125 }, { note: "D5", duration: 0.125 }, { note: "D5", duration: 0.25 },
      { note: "D5", duration: 0.25 }, { note: "A4", duration: 0.25 }, { note: "F#4", duration: 0.25 }, { note: "G4", duration: 0.25 },
      { note: "A4", duration: 0.5 }, { note: "G4", duration: 0.25 }, { note: "A4", duration: 0.25 },
      
      // Line 2
      { note: "D5", duration: 0.25 }, { note: "D5", duration: 0.125 }, { note: "D5", duration: 0.125 }, { note: "D5", duration: 0.25 },
      { note: "E5", duration: 0.25 }, { note: "F#5", duration: 0.25 }, { note: "G5", duration: 0.25 }, { note: "A5", duration: 0.25 },
      { note: "G5", duration: 0.5 }, { note: "F#5", duration: 0.25 }, { note: "E5", duration: 0.25 },
      
      // Line 3
      { note: "B4", duration: 0.25 }, { note: "B4", duration: 0.125 }, { note: "B4", duration: 0.125 }, { note: "B4", duration: 0.25 },
      { note: "C5", duration: 0.25 }, { note: "D5", duration: 0.25 }, { note: "E5", duration: 0.25 }, { note: "F#5", duration: 0.25 },
      { note: "E5", duration: 0.5 }, { note: "D5", duration: 0.25 }, { note: "C5", duration: 0.25 },
      
      // Line 4
      { note: "A4", duration: 0.25 }, { note: "A4", duration: 0.125 }, { note: "A4", duration: 0.125 }, { note: "A4", duration: 0.25 },
      { note: "B4", duration: 0.25 }, { note: "C5", duration: 0.25 }, { note: "D5", duration: 0.25 }, { note: "E5", duration: 0.25 },
      { note: "D5", duration: 0.5 }, { note: "C5", duration: 0.25 }, { note: "B4", duration: 0.25 },
      
      // Final phrase
      { note: "G4", duration: 0.5 }, { note: "A4", duration: 0.5 }, { note: "B4", duration: 0.5 }, { note: "D5", duration: 1 }
    ]
  },
  {
    name: "Street Fighter II - Ryu Theme",
    composer: "Yoko Shimomura",
    bpm: 130,
    notes: [
      // Main melody A
      { note: "G4", duration: 0.5 }, { note: "G4", duration: 0.25 }, { note: "A4", duration: 0.25 }, { note: "C5", duration: 0.5 },
      { note: "A4", duration: 0.5 }, { note: "G4", duration: 0.25 }, { note: "F4", duration: 0.25 }, { note: "G4", duration: 1 },
      { note: "F4", duration: 0.5 }, { note: "G4", duration: 0.5 },
      
      // Melody B
      { note: "A4", duration: 0.5 }, { note: "A4", duration: 0.25 }, { note: "B4", duration: 0.25 }, { note: "D5", duration: 0.5 },
      { note: "B4", duration: 0.5 }, { note: "A4", duration: 0.25 }, { note: "G4", duration: 0.25 }, { note: "A4", duration: 1 },
      { note: "G4", duration: 0.5 }, { note: "A4", duration: 0.5 },
      
      // Higher phrase
      { note: "C5", duration: 0.5 }, { note: "C5", duration: 0.25 }, { note: "D5", duration: 0.25 }, { note: "F5", duration: 0.5 },
      { note: "D5", duration: 0.5 }, { note: "C5", duration: 0.25 }, { note: "A#4", duration: 0.25 }, { note: "C5", duration: 1 },
      { note: "A#4", duration: 0.5 }, { note: "C5", duration: 0.5 },
      
      // Return and resolve
      { note: "G4", duration: 0.5 }, { note: "A4", duration: 0.25 }, { note: "C5", duration: 0.25 }, { note: "A4", duration: 0.5 },
      { note: "G4", duration: 0.5 }, { note: "F4", duration: 0.5 }, { note: "G4", duration: 1.5 }
    ]
  },
  {
    name: "Castlevania - Vampire Killer",
    composer: "Kinuyo Yamashita",
    bpm: 140,
    notes: [
      // Main theme
      { note: "D5", duration: 0.25 }, { note: "D5", duration: 0.25 }, { note: "D5", duration: 0.25 }, { note: "A#4", duration: 0.25 },
      { note: "D5", duration: 0.25 }, { note: "A4", duration: 0.25 }, { note: "G#4", duration: 0.25 }, { note: "G4", duration: 0.25 },
      { note: "F4", duration: 0.5 }, { note: "F4", duration: 0.25 }, { note: "G4", duration: 0.25 },
      
      // Second phrase
      { note: "A4", duration: 0.25 }, { note: "A4", duration: 0.25 }, { note: "A4", duration: 0.25 }, { note: "F4", duration: 0.25 },
      { note: "A4", duration: 0.25 }, { note: "E4", duration: 0.25 }, { note: "D#4", duration: 0.25 }, { note: "D4", duration: 0.25 },
      { note: "C4", duration: 0.5 }, { note: "C4", duration: 0.25 }, { note: "D4", duration: 0.25 },
      
      // Third phrase
      { note: "A#4", duration: 0.25 }, { note: "A#4", duration: 0.25 }, { note: "A#4", duration: 0.25 }, { note: "G4", duration: 0.25 },
      { note: "A#4", duration: 0.25 }, { note: "F4", duration: 0.25 }, { note: "E4", duration: 0.25 }, { note: "D#4", duration: 0.25 },
      { note: "D4", duration: 0.5 }, { note: "D4", duration: 0.25 }, { note: "E4", duration: 0.25 },
      
      // Fourth phrase
      { note: "F4", duration: 0.25 }, { note: "G4", duration: 0.25 }, { note: "A4", duration: 0.25 }, { note: "A#4", duration: 0.25 },
      { note: "C5", duration: 0.25 }, { note: "D5", duration: 0.25 }, { note: "E5", duration: 0.25 }, { note: "F5", duration: 0.25 },
      { note: "D5", duration: 0.5 }, { note: "A#4", duration: 0.5 }, { note: "D5", duration: 1 }
    ]
  },
  {
    name: "Metroid - Title Theme",
    composer: "Hirokazu Tanaka",
    bpm: 100,
    notes: [
      // Opening atmospheric phrase
      { note: "F#4", duration: 1 }, { note: "A4", duration: 0.5 }, { note: "C5", duration: 0.5 }, { note: "F#5", duration: 1 },
      { note: "E5", duration: 0.5 }, { note: "D5", duration: 0.5 }, { note: "C5", duration: 1 }, { note: "A4", duration: 0.5 },
      { note: "F#4", duration: 1.5 },
      
      // Second phrase
      { note: "G4", duration: 1 }, { note: "B4", duration: 0.5 }, { note: "D5", duration: 0.5 }, { note: "G5", duration: 1 },
      { note: "F#5", duration: 0.5 }, { note: "E5", duration: 0.5 }, { note: "D5", duration: 1 }, { note: "B4", duration: 0.5 },
      { note: "G4", duration: 1.5 },
      
      // Third phrase
      { note: "A4", duration: 1 }, { note: "C5", duration: 0.5 }, { note: "E5", duration: 0.5 }, { note: "A5", duration: 1 },
      { note: "G5", duration: 0.5 }, { note: "F5", duration: 0.5 }, { note: "E5", duration: 1 }, { note: "C5", duration: 0.5 },
      { note: "A4", duration: 1.5 },
      
      // Final resolve
      { note: "F#4", duration: 0.5 }, { note: "A4", duration: 0.5 }, { note: "C5", duration: 0.5 }, { note: "F#5", duration: 1 },
      { note: "A5", duration: 1 }, { note: "F#5", duration: 2 }
    ]
  }
]

// Generate 3 octaves (36 keys)
const generateKeys = (baseOctave: number = 4) => {
  const keys: (Note & { id: string, octave: number })[] = []
  for (let octave = 0; octave < 3; octave++) {
    NOTES.forEach(note => {
      const actualOctave = baseOctave + octave
      const frequency = note.frequency * Math.pow(2, octave)
      keys.push({
        ...note,
        id: `${note.note}${actualOctave}`,
        frequency,
        octave: actualOctave
      })
    })
  }
  return keys
}

type InstrumentType = 'piano' | 'electric' | 'organ'

export default function RamsPiano() {
  const [octaveShift, setOctaveShift] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [instrument, setInstrument] = useState<InstrumentType>('piano')
  const [isRecording, setIsRecording] = useState(false)
  const [recordedNotes, setRecordedNotes] = useState<Array<{note: string, time: number, duration: number}>>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [selectedTune, setSelectedTune] = useState<string>('')
  const [isPlayingTune, setIsPlayingTune] = useState(false)
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const recordingStartTimeRef = useRef<number>(0)
  const playingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const keys = generateKeys(4 + octaveShift)

  useEffect(() => {
    // Initialize audio context
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const createOscillator = useCallback((frequency: number, type: InstrumentType = 'piano') => {
    if (!audioContextRef.current) return null

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()
    
    // Different waveforms for different instruments
    switch (type) {
      case 'piano':
        oscillator.type = 'triangle'
        break
      case 'electric':
        oscillator.type = 'sawtooth'
        break
      case 'organ':
        oscillator.type = 'sine'
        break
    }
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
    gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 1)
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)
    
    return { oscillator, gainNode }
  }, [volume, instrument])

  const playNote = useCallback((frequency: number, noteId: string, duration: number = 0.5) => {
    const nodes = createOscillator(frequency, instrument)
    if (!nodes) return

    const { oscillator, gainNode } = nodes
    
    setPressedKeys(prev => new Set(prev).add(noteId))
    
    oscillator.start()
    oscillator.stop(audioContextRef.current!.currentTime + duration)
    
    setTimeout(() => {
      setPressedKeys(prev => {
        const newSet = new Set(prev)
        newSet.delete(noteId)
        return newSet
      })
    }, duration * 1000)

    // Record note if recording
    if (isRecording) {
      const currentTime = Date.now() - recordingStartTimeRef.current
      setRecordedNotes(prev => [...prev, { note: noteId, time: currentTime, duration: duration * 1000 }])
    }
  }, [createOscillator, instrument, isRecording])

  const handleKeyPress = useCallback((key: typeof keys[0]) => {
    playNote(key.frequency, key.id)
  }, [playNote])

  const startRecording = () => {
    setRecordedNotes([])
    recordingStartTimeRef.current = Date.now()
    setIsRecording(true)
  }

  const stopRecording = () => {
    setIsRecording(false)
  }

  const playRecording = () => {
    if (recordedNotes.length === 0 || isPlaying) return
    
    setIsPlaying(true)
    
    recordedNotes.forEach(({ note, time, duration }) => {
      setTimeout(() => {
        const key = keys.find(k => k.id === note)
        if (key) {
          playNote(key.frequency, key.id, duration / 1000)
        }
      }, time)
    })

    const totalDuration = Math.max(...recordedNotes.map(n => n.time + n.duration))
    playingTimeoutRef.current = setTimeout(() => {
      setIsPlaying(false)
    }, totalDuration)
  }

  const playVideoGameTune = () => {
    if (!selectedTune || isPlayingTune) return
    
    const tune = VIDEO_GAME_TUNES.find(t => t.name === selectedTune)
    if (!tune) return

    setIsPlayingTune(true)
    
    const beatDuration = 60000 / tune.bpm // ms per beat
    let currentTime = 0

    tune.notes.forEach((tuneNote, index) => {
      if (tuneNote.rest) {
        currentTime += tuneNote.duration * beatDuration
        return
      }

      setTimeout(() => {
        // Find the key that matches this note
        const noteWithoutOctave = tuneNote.note.replace(/\d/, '')
        const octave = tuneNote.note.match(/\d/) ? parseInt(tuneNote.note.match(/\d/)![0]) : 4
        
        // Find matching key in our current key range
        let matchingKey = keys.find(k => k.note === noteWithoutOctave && k.octave === octave)
        
        // If not found in current range, try adjacent octaves
        if (!matchingKey) {
          matchingKey = keys.find(k => k.note === noteWithoutOctave && Math.abs(k.octave - octave) <= 1)
        }
        
        if (matchingKey) {
          playNote(matchingKey.frequency, matchingKey.id, tuneNote.duration * beatDuration / 1000)
        }
      }, currentTime)
      
      currentTime += tuneNote.duration * beatDuration
    })

    // Stop playing state after tune is complete
    setTimeout(() => {
      setIsPlayingTune(false)
    }, currentTime + 500)
  }

  const renderKeys = () => {
    const whiteKeys = keys.filter(key => !key.isBlack)
    const blackKeys = keys.filter(key => key.isBlack)

    return (
      <div className={styles.keyboard}>
        <div className={styles.whiteKeys}>
          {whiteKeys.map((key, index) => (
            <button
              key={key.id}
              className={`${styles.whiteKey} ${pressedKeys.has(key.id) ? styles.pressed : ''}`}
              onClick={() => handleKeyPress(key)}
              onTouchStart={(e) => {
                e.preventDefault()
                handleKeyPress(key)
              }}
            >
              <span className={styles.keyLabel}>{key.note}</span>
            </button>
          ))}
        </div>
        <div className={styles.blackKeys}>
          {blackKeys.map((key) => {
            // Calculate position based on the pattern of black keys
            const whiteKeyIndex = whiteKeys.findIndex(wk => 
              keys.indexOf(wk) < keys.indexOf(key) && 
              Math.floor(keys.indexOf(wk) / 12) === Math.floor(keys.indexOf(key) / 12)
            )
            const patternIndex = keys.indexOf(key) % 12
            let offset = 0
            
            // Position black keys between white keys
            if (patternIndex === 1) offset = 0.7 // C#
            else if (patternIndex === 3) offset = 1.7 // D#
            else if (patternIndex === 6) offset = 3.7 // F#
            else if (patternIndex === 8) offset = 4.7 // G#
            else if (patternIndex === 10) offset = 5.7 // A#
            
            const octaveOffset = Math.floor(keys.indexOf(key) / 12) * 7
            const leftPosition = (octaveOffset + offset) * (100 / 21) // 21 white keys total

            return (
              <button
                key={key.id}
                className={`${styles.blackKey} ${pressedKeys.has(key.id) ? styles.pressed : ''}`}
                style={{ left: `${leftPosition}%` }}
                onClick={() => handleKeyPress(key)}
                onTouchStart={(e) => {
                  e.preventDefault()
                  handleKeyPress(key)
                }}
              />
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Piano</h1>
        <div className={styles.subtitle}>Dieter Rams Edition</div>
      </div>

      <div className={styles.controlPanel}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className={styles.slider}
          />
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Octave</label>
          <div className={styles.buttonGroup}>
            <button 
              className={styles.controlButton}
              onClick={() => setOctaveShift(Math.max(-2, octaveShift - 1))}
              disabled={octaveShift <= -2}
            >
              −
            </button>
            <span className={styles.octaveDisplay}>{octaveShift}</span>
            <button 
              className={styles.controlButton}
              onClick={() => setOctaveShift(Math.min(2, octaveShift + 1))}
              disabled={octaveShift >= 2}
            >
              +
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Instrument</label>
          <select
            value={instrument}
            onChange={(e) => setInstrument(e.target.value as InstrumentType)}
            className={styles.select}
          >
            <option value="piano">Piano</option>
            <option value="electric">Electric</option>
            <option value="organ">Organ</option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Recording</label>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.recordButton} ${isRecording ? styles.recording : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isPlaying || isPlayingTune}
            >
              {isRecording ? 'Stop' : 'Record'}
            </button>
            <button
              className={styles.playButton}
              onClick={playRecording}
              disabled={recordedNotes.length === 0 || isPlaying || isRecording || isPlayingTune}
            >
              {isPlaying ? 'Playing...' : 'Play'}
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Video Game Tunes</label>
          <div className={styles.tuneControls}>
            <select
              value={selectedTune}
              onChange={(e) => setSelectedTune(e.target.value)}
              className={styles.tuneSelect}
              disabled={isPlayingTune || isPlaying || isRecording}
            >
              <option value="">Select a tune...</option>
              {VIDEO_GAME_TUNES.map((tune, index) => (
                <option key={index} value={tune.name}>
                  {tune.name}
                </option>
              ))}
            </select>
            <button
              className={styles.playTuneButton}
              onClick={playVideoGameTune}
              disabled={!selectedTune || isPlayingTune || isPlaying || isRecording}
            >
              {isPlayingTune ? 'Playing...' : 'Play Tune'}
            </button>
          </div>
          {selectedTune && (
            <div className={styles.tuneInfo}>
              {VIDEO_GAME_TUNES.find(t => t.name === selectedTune)?.composer}
            </div>
          )}
        </div>
      </div>

      {renderKeys()}
    </div>
  )
}
