import { GamePhase } from '@/utils/types'

interface Answer {
	id: string
	text: string
}

interface RoundResult {
	correctMatches: Record<string, string>
	scores: Record<string, number>
}

interface Player {
	id: string
	username: string
}

export interface GameHistoryEntry {
	roomId: string
	placement: string
	date: string
}

export interface TimerRingProps {
	seconds: number
	totalSeconds?: number
	accent?: string
	size?: number
}

export interface GameState {
	phase: GamePhase | null
	roundNumber: number
	totalRounds: number
	askerIndex: number
	timeLeft: number
	question: string
	answers: Answer[]
	matches: Record<string, string>
	scores: Record<string, number>
	roundScores: Record<string, number>
	correctMatches: Record<string, string>
	setPhase: (
		phase: GamePhase,
		timeLeft: number,
		roundNumber: number,
		askerIndex: number,
	) => void
	setQuestion: (question: string) => void
	setAnswers: (answers: Answer[]) => void
	setMatch: (answerId: string, playerId: string) => void
	setRoundResults: (
		roundScores: Record<string, number>,
		correctMatches: Record<string, string>,
	) => void
	setFinalScores: (scores: Record<string, number>) => void
	setTimeLeft: (timeLeft: number) => void
	setTotalRounds: (total: number) => void
	reset: () => void
}

export interface RoomSettings {
	minCapacity: number
	roundDuration: number
	rounds: number
}

export interface RoomState {
	roomId: string | null
	players: Player[]
	hostId: string | null
	settings: RoomSettings
	setRoom: (roomId: string, hostId: string) => void
	setPlayers: (players: Player[]) => void
	setSettings: (settings: Partial<RoomSettings>) => void
	reset: () => void
}

export interface UserState {
	username: string
	gameHistory: GameHistoryEntry[]
	setUsername: (username: string) => void
	addGameHistory: (entry: GameHistoryEntry) => void
}
