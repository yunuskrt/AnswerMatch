import { UserState } from '@/utils/interfaces'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			username: '',
			gameHistory: [],
			setUsername: (username) => set({ username }),
			addGameHistory: (entry) =>
				set((state) => ({
					gameHistory: [entry, ...state.gameHistory].slice(0, 10),
				})),
		}),
		{
			name: '@user:profile',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
)
