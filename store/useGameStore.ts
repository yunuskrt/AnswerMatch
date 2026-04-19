import { GameState } from '@/utils/interfaces'
import { create } from 'zustand'
export const useGameStore = create<GameState>()((set) => ({
	phase: null,
	roundNumber: 0,
	totalRounds: 0,
	askerIndex: 0,
	timeLeft: 30,
	question: '',
	answers: [],
	matches: {},
	scores: {},
	roundScores: {},
	correctMatches: {},
	setPhase: (phase, timeLeft, roundNumber, askerIndex) =>
		set({ phase, timeLeft, roundNumber, askerIndex, matches: {} }),
	setQuestion: (question) => set({ question }),
	setAnswers: (answers) => set({ answers }),
	setMatch: (answerId, playerId) =>
		set((state) => ({ matches: { ...state.matches, [answerId]: playerId } })),
	setRoundResults: (roundScores, correctMatches) =>
		set({ roundScores, correctMatches }),
	setFinalScores: (scores) => set({ scores }),
	setTimeLeft: (timeLeft) => set({ timeLeft }),
	setTotalRounds: (total) => set({ totalRounds: total }),
	reset: () =>
		set({
			phase: null,
			roundNumber: 0,
			totalRounds: 0,
			askerIndex: 0,
			timeLeft: 30,
			question: '',
			answers: [],
			matches: {},
			scores: {},
			roundScores: {},
			correctMatches: {},
		}),
}))
