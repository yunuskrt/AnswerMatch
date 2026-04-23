import { UserState } from '@/utils/interfaces'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			username: '',
			gameHistory: [
				{ roomId: 'ABC123', placement: '1st 🥇', date: '2026-04-20' },
				{ roomId: 'XY9901', placement: '2nd 🥈', date: '2026-04-18' },
				{ roomId: 'QZP445', placement: '3rd 🥉', date: '2026-04-15' },
				{ roomId: 'LMN772', placement: '1st 🥇', date: '2026-04-10' },
				{ roomId: 'DEF334', placement: '4th', date: '2026-04-05' },
				{ roomId: 'ABC123', placement: '1st 🥇', date: '2026-04-20' },
				{ roomId: 'XY9901', placement: '2nd 🥈', date: '2026-04-18' },
				{ roomId: 'QZP445', placement: '3rd 🥉', date: '2026-04-15' },
				{ roomId: 'LMN772', placement: '1st 🥇', date: '2026-04-10' },
				{ roomId: 'DEF334', placement: '4th', date: '2026-04-05' },
			],
			setUsername: (username) => set({ username }),
			addGameHistory: (entry) =>
				set((state) => ({
					gameHistory: [entry, ...state.gameHistory].slice(0, 10),
				})),
		}),
		{
			name: '@user:profile',
			storage: createJSONStorage(() => AsyncStorage),
			version: 1,
			migrate: (state, version) => {
				if (version < 1) return {}
				return state as UserState
			},
		},
	),
)
