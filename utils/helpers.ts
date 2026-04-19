import { PLAYER_COLORS } from '@/utils/constants'

export function getPlayerColor(index: number): string {
	return PLAYER_COLORS[index % PLAYER_COLORS.length]
}

export function generateRoomId(): string {
	return Math.floor(1000 + Math.random() * 9000).toString()
}

export function formatPlacement(rank: number): string {
	if (rank === 1) return '1st place 🏆'
	if (rank === 2) return '2nd place'
	if (rank === 3) return '3rd place'
	return `${rank}th place`
}

export function getInitial(name: string): string {
	return name.charAt(0).toUpperCase()
}
