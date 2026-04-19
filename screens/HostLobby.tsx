import { useSocket } from '@/hooks/useSocket'
import { useRoomStore } from '@/store/useRoomStore'
import { useUserStore } from '@/store/useUserStore'
import { emitStartGame } from '@/utils/callbacks'
import { COLORS } from '@/utils/constants'
import { getInitial, getPlayerColor } from '@/utils/helpers'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'

export default function HostLobby() {
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
					<NeoButton
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

function SectionLabel({ text }: { text: string }) {
	return (
		<View style={sl.row}>
			<Text style={sl.text}>{text}</Text>
			<View style={sl.line} />
		</View>
	)
}

function Avatar({
	name,
	color,
	size = 36,
}: {
	name: string
	color: string
	size?: number
}) {
	return (
		<View
			style={[
				avStyles.circle,
				{
					width: size,
					height: size,
					borderRadius: size / 2,
					borderColor: color,
					backgroundColor: color + '33',
				},
			]}
		>
			<Text style={[avStyles.initial, { fontSize: size * 0.38, color }]}>
				{getInitial(name)}
			</Text>
		</View>
	)
}

function NeoButton({
	label,
	bg,
	disabled,
	onPress,
}: {
	label: string
	bg: string
	disabled?: boolean
	onPress: () => void
}) {
	return (
		<View style={btnStyles.wrapper}>
			{!disabled && (
				<View style={[btnStyles.shadow, { backgroundColor: COLORS.border }]} />
			)}
			<TouchableOpacity
				style={[
					btnStyles.btn,
					{
						backgroundColor: bg,
						borderColor: disabled ? COLORS.lightGray : COLORS.border,
					},
				]}
				onPress={onPress}
				disabled={disabled}
				activeOpacity={0.85}
			>
				<Text style={[btnStyles.label, disabled && { color: COLORS.gray }]}>
					{label}
				</Text>
			</TouchableOpacity>
		</View>
	)
}

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

const sl = StyleSheet.create({
	row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	text: {
		fontSize: 12,
		color: COLORS.gray,
		letterSpacing: 1,
		textTransform: 'uppercase',
	},
	line: { flex: 1, height: 1, backgroundColor: COLORS.lightGray },
})

const avStyles = StyleSheet.create({
	circle: { borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
	initial: { fontWeight: '700' },
})

const btnStyles = StyleSheet.create({
	wrapper: { position: 'relative', height: 52 },
	shadow: {
		position: 'absolute',
		top: 4,
		left: 4,
		right: -4,
		bottom: -4,
		borderRadius: 10,
	},
	btn: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		borderRadius: 10,
		borderWidth: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	label: { fontSize: 18, fontWeight: '700', color: COLORS.white },
})
