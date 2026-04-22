import Avatar from '@/components/Avatar'
import BorderlessNeoButton from '@/components/BorderlessNeoButton'
import SectionLabel from '@/components/SectionLabel'
import { useSocket } from '@/hooks/useSocket'
import { useRoomStore } from '@/store/useRoomStore'
import { useUserStore } from '@/store/useUserStore'
import { emitStartGame } from '@/utils/callbacks'
import { COLORS } from '@/utils/constants'
import { getPlayerColor } from '@/utils/helpers'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import {
	ScrollView,
	StyleSheet,
	Text,
	View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}
const HostLobby = ({}: Props) => {
	const router = useRouter()
	const socket = useSocket()
	const { roomId, players, hostId, settings, setPlayers } = useRoomStore()
	const { username } = useUserStore()

	const canStart = players.length >= settings.minCapacity

	useEffect(() => {
		socket.on('player_joined', ({ players: updated }) => {
			setPlayers(updated)
		})
		socket.on('player_left', ({ players: updated }) => {
			setPlayers(updated)
		})
		socket.on('game_started', ({ settings: gameSettings, rounds }) => {
			router.push('/ask-phase')
		})
		return () => {
			socket.off('player_joined')
			socket.off('player_left')
			socket.off('game_started')
		}
	}, [])

	function handleStartGame() {
		if (!canStart || !roomId) return
		emitStartGame(socket, roomId, {
			roundDuration: settings.roundDuration,
			rounds: settings.rounds,
		})
	}

	const displayPlayers = players.length > 0 ? players : [{ id: '1', username }]

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.scroll}>
				{/* Header */}
				<View style={styles.headerRow}>
					<View>
						<Text style={styles.title}>Waiting Room</Text>
						<View style={styles.roomIdRow}>
							<Text style={styles.roomIdLabel}>Room ID:</Text>
							<Text style={styles.roomId}>#{roomId}</Text>
						</View>
					</View>
					<View style={styles.countBadge}>
						<Text style={styles.countText}>
							{displayPlayers.length} / {settings.minCapacity} min
						</Text>
					</View>
				</View>

				{/* Share hint */}
				<View style={styles.shareHint}>
					<Text style={styles.shareIcon}>📋</Text>
					<Text style={styles.shareText}>Share room ID with friends</Text>
				</View>

				<SectionLabel text={`Players (${displayPlayers.length}/10)`} />

				{/* Player list */}
				<View style={styles.playerList}>
					{displayPlayers.map((p, i) => (
						<View key={p.id} style={styles.playerRow}>
							<Avatar name={p.username} color={getPlayerColor(i)} size={36} />
							<Text style={styles.playerName}>{p.username}</Text>
							{i === 0 && (
								<View style={styles.hostBadge}>
									<Text style={styles.hostBadgeText}>host</Text>
								</View>
							)}
							<View style={styles.onlineDot} />
						</View>
					))}
					{/* Empty slot */}
					{displayPlayers.length < settings.minCapacity && (
						<View style={[styles.playerRow, styles.emptyRow]}>
							<View style={styles.emptyAvatar} />
							<Text style={styles.emptyText}>waiting…</Text>
						</View>
					)}
				</View>

				{/* Start game */}
				<View style={styles.footer}>
					{canStart && (
						<Text style={styles.readyText}>
							Min. capacity reached — you can start!
						</Text>
					)}
					<BorderlessNeoButton
						label='🚀  Start Game'
						bg={canStart ? COLORS.accent : COLORS.lightGray}
						disabled={!canStart}
						onPress={handleStartGame}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default HostLobby

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: COLORS.bg },
	scroll: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 40,
		gap: 16,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	title: { fontSize: 26, fontWeight: '700', color: COLORS.fg },
	roomIdRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		marginTop: 2,
	},
	roomIdLabel: { fontSize: 14, color: COLORS.gray },
	roomId: {
		fontSize: 22,
		fontWeight: '700',
		color: COLORS.accent,
		letterSpacing: 2,
	},
	countBadge: {
		backgroundColor: COLORS.accent3 + '33',
		borderWidth: 1.5,
		borderColor: COLORS.accent3,
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
	countText: { fontSize: 13, color: COLORS.fg },
	shareHint: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		backgroundColor: COLORS.accent + '22',
		borderWidth: 1.5,
		borderColor: COLORS.accent,
		borderStyle: 'dashed',
		borderRadius: 10,
		padding: 10,
	},
	shareIcon: { fontSize: 18 },
	shareText: { fontSize: 14, color: COLORS.fg },
	playerList: { gap: 8 },
	playerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		paddingVertical: 10,
		paddingHorizontal: 12,
		backgroundColor: COLORS.white,
		borderWidth: 1.5,
		borderColor: COLORS.lightGray,
		borderRadius: 10,
	},
	emptyRow: {
		borderStyle: 'dashed',
		opacity: 0.5,
	},
	playerName: { flex: 1, fontSize: 17, color: COLORS.fg },
	hostBadge: {
		backgroundColor: COLORS.accent2 + '22',
		borderWidth: 1,
		borderColor: COLORS.accent2,
		borderRadius: 20,
		paddingHorizontal: 8,
		paddingVertical: 2,
	},
	hostBadgeText: { fontSize: 12, color: COLORS.accent2 },
	onlineDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: COLORS.green,
	},
	emptyAvatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: COLORS.lightGray,
	},
	emptyText: { flex: 1, fontSize: 15, color: COLORS.gray },
	footer: { marginTop: 'auto' as any, gap: 8 },
	readyText: { fontSize: 13, color: COLORS.gray, textAlign: 'center' },
})