import { useGameStore } from '@/store/useGameStore'
import { useRoomStore } from '@/store/useRoomStore'
import { useUserStore } from '@/store/useUserStore'
import { COLORS } from '@/utils/constants'
import { formatPlacement, getInitial, getPlayerColor } from '@/utils/helpers'
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

export default function FinalResults() {
	const router = useRouter()
	const { players, roomId, reset: resetRoom } = useRoomStore()
	const { scores, totalRounds, reset: resetGame } = useGameStore()
	const { username, addGameHistory } = useUserStore()

	// Build sorted final leaderboard
	const sortedPlayers =
		players.length > 0
			? [...players]
					.map((p, i) => ({
						id: p.id,
						name: p.username,
						pts: scores[p.id] ?? 0,
						colorIdx: i,
					}))
					.sort((a, b) => b.pts - a.pts)
			: [
					{ id: '1', name: 'Alex', pts: 12, colorIdx: 0 },
					{ id: '2', name: 'Mia', pts: 9, colorIdx: 2 },
					{ id: '3', name: 'Sam', pts: 7, colorIdx: 1 },
					{ id: '4', name: 'Jordan', pts: 6, colorIdx: 3 },
				]

	const myRank = sortedPlayers.findIndex((p) => p.name === username) + 1 || 4
	const myScore = sortedPlayers.find((p) => p.name === username)?.pts ?? 0

	useEffect(() => {
		if (roomId) {
			addGameHistory({
				roomId,
				placement: formatPlacement(myRank),
				date: new Date().toISOString(),
			})
		}
	}, [])

	// Build podium: 2nd, 1st, 3rd
	const top3 = sortedPlayers.slice(0, 3)
	const podium =
		top3.length >= 2 ? [top3[1], top3[0], top3[2]].filter(Boolean) : top3

	const podiumHeights = [70, 100, 55]

	function handlePlayAgain() {
		resetGame()
		router.replace('/create-room')
	}

	function handleHome() {
		resetGame()
		resetRoom()
		router.replace('/')
	}

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView contentContainerStyle={styles.scroll}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.emoji}>🎉</Text>
					<Text style={styles.title}>Game Over!</Text>
					<Text style={styles.subtitle}>
						Room #{roomId || '4821'} · {totalRounds || 5} rounds completed
					</Text>
				</View>

				{/* Podium */}
				<View style={styles.podium}>
					{podium.map((p, i) => {
						const h = podiumHeights[i] ?? 55
						const color = getPlayerColor(p.colorIdx)
						const rank = i === 0 ? 2 : i === 1 ? 1 : 3
						return (
							<View key={p.id} style={styles.podiumItem}>
								<View
									style={[
										styles.podiumAvatar,
										{ borderColor: color, backgroundColor: color + '33' },
									]}
								>
									<Text style={[styles.podiumInitial, { color }]}>
										{getInitial(p.name)}
									</Text>
								</View>
								<Text style={styles.podiumName}>{p.name}</Text>
								<View style={styles.podiumBlockWrapper}>
									<View style={styles.podiumBlockShadow} />
									<View
										style={[
											styles.podiumBlock,
											{
												height: h,
												backgroundColor: color + '55',
												borderColor: color,
											},
										]}
									>
										{rank === 1 && <Text style={styles.crownEmoji}>👑</Text>}
										<Text style={styles.podiumPts}>{p.pts}</Text>
										<Text style={styles.podiumPtsLabel}>pts</Text>
									</View>
									<View style={[styles.podiumBase, { backgroundColor: color }]}>
										<Text style={styles.podiumRank}>#{rank}</Text>
									</View>
								</View>
							</View>
						)
					})}
				</View>

				{/* My placement */}
				{myRank > 3 && (
					<View style={styles.myPlacement}>
						<Text style={styles.myName}>{username} (You)</Text>
						<Text style={styles.myRank}>
							{myRank}th · {myScore} pts
						</Text>
					</View>
				)}

				{/* Full leaderboard */}
				{sortedPlayers.length > 3 && (
					<View style={styles.fullList}>
						{sortedPlayers.slice(3).map((p, i) => {
							const color = getPlayerColor(p.colorIdx)
							return (
								<View key={p.id} style={styles.listRow}>
									<Text style={styles.listRank}>{i + 4}</Text>
									<View
										style={[
											styles.listAvatar,
											{ borderColor: color, backgroundColor: color + '33' },
										]}
									>
										<Text style={[styles.listInitial, { color }]}>
											{getInitial(p.name)}
										</Text>
									</View>
									<Text
										style={[
											styles.listName,
											p.name === username && { color: COLORS.accent2 },
										]}
									>
										{p.name}
										{p.name === username ? ' (You)' : ''}
									</Text>
									<Text style={styles.listPts}>{p.pts} pts</Text>
								</View>
							)
						})}
					</View>
				)}

				{/* Actions */}
				<View style={styles.actions}>
					<NeoButton
						label='🔄  Play Again'
						bg={COLORS.accent}
						onPress={handlePlayAgain}
					/>
					<NeoButton
						label='Back to Home'
						bg={COLORS.white}
						onPress={handleHome}
						dark
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

function NeoButton({
	label,
	bg,
	onPress,
	dark,
}: {
	label: string
	bg: string
	onPress: () => void
	dark?: boolean
}) {
	return (
		<View style={btnStyles.wrapper}>
			<View style={[btnStyles.shadow, { backgroundColor: COLORS.border }]} />
			<TouchableOpacity
				style={[btnStyles.btn, { backgroundColor: bg }]}
				onPress={onPress}
				activeOpacity={0.85}
			>
				<Text style={[btnStyles.label, dark && { color: COLORS.fg }]}>
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
		gap: 20,
	},
	header: { alignItems: 'center', gap: 4 },
	emoji: { fontSize: 36 },
	title: { fontSize: 30, fontWeight: '700', color: COLORS.fg },
	subtitle: { fontSize: 14, color: COLORS.gray },
	podium: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'flex-end',
		gap: 8,
		paddingHorizontal: 8,
	},
	podiumItem: {
		flex: 1,
		alignItems: 'center',
		gap: 4,
	},
	podiumAvatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	podiumInitial: { fontSize: 16, fontWeight: '700' },
	podiumName: { fontSize: 13, color: COLORS.fg, textAlign: 'center' },
	podiumBlockWrapper: { width: '100%', position: 'relative' },
	podiumBlockShadow: {
		position: 'absolute',
		top: 3,
		left: 3,
		right: -3,
		bottom: -3,
		borderRadius: 6,
		backgroundColor: COLORS.border,
	},
	podiumBlock: {
		borderWidth: 2,
		borderRadius: 6,
		borderBottomWidth: 0,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 2,
	},
	crownEmoji: { fontSize: 20 },
	podiumPts: { fontSize: 22, fontWeight: '700', color: COLORS.fg },
	podiumPtsLabel: { fontSize: 11, color: COLORS.gray },
	podiumBase: {
		height: 26,
		borderWidth: 2,
		borderColor: COLORS.border,
		borderRadius: 4,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		alignItems: 'center',
		justifyContent: 'center',
	},
	podiumRank: { fontSize: 14, fontWeight: '700', color: COLORS.white },
	myPlacement: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 12,
		backgroundColor: COLORS.accent + '22',
		borderWidth: 1.5,
		borderColor: COLORS.accent,
		borderRadius: 10,
	},
	myName: { fontSize: 15, color: COLORS.fg },
	myRank: { fontSize: 15, color: COLORS.gray },
	fullList: { gap: 6 },
	listRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		padding: 10,
		backgroundColor: COLORS.white,
		borderWidth: 1.5,
		borderColor: COLORS.lightGray,
		borderRadius: 8,
	},
	listRank: { fontSize: 16, fontWeight: '700', color: COLORS.gray, width: 20 },
	listAvatar: {
		width: 30,
		height: 30,
		borderRadius: 15,
		borderWidth: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	listInitial: { fontSize: 12, fontWeight: '700' },
	listName: { flex: 1, fontSize: 16, color: COLORS.fg },
	listPts: { fontSize: 14, color: COLORS.gray },
	actions: { gap: 10 },
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
		borderColor: COLORS.border,
		alignItems: 'center',
		justifyContent: 'center',
	},
	label: { fontSize: 18, fontWeight: '700', color: COLORS.white },
})
