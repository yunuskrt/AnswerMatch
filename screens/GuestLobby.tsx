import NeoButton from '@/components/NeoButton'
import SectionLabel from '@/components/SectionLabel'
import { useSocket } from '@/hooks/useSocket'
import { useRoomStore } from '@/store/useRoomStore'
import { useUserStore } from '@/store/useUserStore'
import { emitJoinRoom } from '@/utils/callbacks'
import { COLORS } from '@/utils/constants'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import Text from '@/components/Text'
import {
	ScrollView,
	StyleSheet,
	TextInput,
	View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}
const GuestLobby = ({}: Props) => {
	const router = useRouter()
	const socket = useSocket()
	const { roomId, setRoom, players, setPlayers } = useRoomStore()
	const { username } = useUserStore()

	const [inputRoomId, setInputRoomId] = useState('')
	const [joined, setJoined] = useState(false)
	const [hostName, setHostName] = useState('')

	useEffect(() => {
		socket.on('room_created', () => {})
		socket.on('player_joined', ({ players: updated }) => {
			setPlayers(updated)
			if (!joined) setJoined(true)
		})
		socket.on('player_left', ({ players: updated }) => {
			setPlayers(updated)
		})
		socket.on('game_started', () => {
			router.push('/ask-phase')
		})
		return () => {
			socket.off('room_created')
			socket.off('player_joined')
			socket.off('player_left')
			socket.off('game_started')
		}
	}, [joined])

	function handleJoin() {
		const id = inputRoomId.trim()
		if (!id || !username) return
		setRoom(id, '')
		emitJoinRoom(socket, id, username)
		setJoined(true)
	}

	const displayPlayers =
		players.length > 0
			? players
			: joined
				? [
						{ id: '0', username: 'Alex 👑' },
						{ id: '1', username: 'Sam' },
						{ id: '2', username: 'Mia' },
						{ id: '3', username: username },
					]
				: []

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView
				contentContainerStyle={styles.scroll}
				keyboardShouldPersistTaps='handled'
			>
				<Text style={styles.title}>Join a Room</Text>

				{/* Room ID input */}
				<View style={styles.section}>
					<SectionLabel text='Enter Room ID' />
					<TextInput
						style={styles.input}
						value={inputRoomId}
						onChangeText={setInputRoomId}
						placeholder='e.g. 4821'
						placeholderTextColor={COLORS.gray}
						keyboardType='numeric'
						maxLength={6}
					/>
					<NeoButton
						label='Join Room'
						bg={COLORS.accent3}
						onPress={handleJoin}
					/>
				</View>

				{/* Joined state card */}
				{joined && (
					<View style={styles.joinedCard}>
						<View style={styles.joinedHeader}>
							<Text style={styles.joinedTitle}>
								Joined #{inputRoomId || roomId}
							</Text>
							<View style={styles.onlineDotPulse} />
						</View>
						{hostName ? (
							<Text style={styles.joinedSub}>Hosted by {hostName}</Text>
						) : null}
					</View>
				)}

				{/* Waiting area */}
				{joined && (
					<View style={styles.waitingArea}>
						<View style={styles.dotsRow}>
							{[0, 1, 2].map((i) => (
								<View
									key={i}
									style={[styles.dot, { opacity: 0.4 + i * 0.3 }]}
								/>
							))}
						</View>
						<Text style={styles.waitingText}>
							{'Waiting for host\nto start the game…'}
						</Text>

						{displayPlayers.length > 0 && (
							<View style={styles.playerList}>
								{displayPlayers.map((p, i) => (
									<View key={p.id} style={styles.playerRow}>
										<View style={styles.onlineDot} />
										<Text
											style={[
												styles.playerName,
												i === displayPlayers.length - 1 && {
													color: COLORS.accent2,
												},
											]}
										>
											{p.username}
										</Text>
									</View>
								))}
							</View>
						)}
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	)
}

export default GuestLobby

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: COLORS.bg },
	scroll: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 40,
		gap: 16,
	},
	title: { fontSize: 26, fontWeight: '700', color: COLORS.fg },
	section: { gap: 10 },
	input: {
		height: 48,
		borderWidth: 2,
		borderColor: COLORS.border,
		borderRadius: 10,
		paddingHorizontal: 14,
		fontSize: 16,
		color: COLORS.fg,
		backgroundColor: COLORS.white,
	},
	joinedCard: {
		backgroundColor: COLORS.accent3 + '22',
		borderWidth: 2,
		borderColor: COLORS.accent3,
		borderRadius: 12,
		padding: 14,
		gap: 4,
	},
	joinedHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	joinedTitle: { fontSize: 17, fontWeight: '600', color: COLORS.fg },
	joinedSub: { fontSize: 13, color: COLORS.gray },
	onlineDotPulse: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: COLORS.green,
	},
	waitingArea: {
		flex: 1,
		alignItems: 'center',
		gap: 16,
	},
	dotsRow: {
		flexDirection: 'row',
		gap: 10,
		marginTop: 8,
	},
	dot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: COLORS.accent3,
	},
	waitingText: {
		fontSize: 18,
		color: COLORS.gray,
		textAlign: 'center',
		lineHeight: 26,
	},
	playerList: {
		width: '100%',
		gap: 6,
	},
	playerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingVertical: 8,
		paddingHorizontal: 12,
		backgroundColor: COLORS.white,
		borderWidth: 1.5,
		borderColor: COLORS.lightGray,
		borderRadius: 8,
	},
	onlineDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: COLORS.green,
	},
	playerName: { fontSize: 15, color: COLORS.fg },
})