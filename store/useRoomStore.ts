import { RoomSettings, RoomState } from '@/utils/interfaces'
import { create } from 'zustand'

const defaultSettings: RoomSettings = {
	minCapacity: 5,
	roundDuration: 30,
	rounds: 10,
}

export const useRoomStore = create<RoomState>()((set) => ({
	roomId: null,
	players: [],
	hostId: null,
	settings: defaultSettings,
	setRoom: (roomId, hostId) => set({ roomId, hostId }),
	setPlayers: (players) => set({ players }),
	setSettings: (settings) =>
		set((state) => ({ settings: { ...state.settings, ...settings } })),
	reset: () =>
		set({ roomId: null, players: [], hostId: null, settings: defaultSettings }),
}))
