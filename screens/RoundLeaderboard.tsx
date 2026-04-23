import NeoButton from '@/components/NeoButton'
import Text from '@/components/Text'
import { useSocket } from '@/hooks/useSocket'
import { useGameStore } from '@/store/useGameStore'
import { useRoomStore } from '@/store/useRoomStore'
import { globalStyles } from '@/styles/global'
import { COLORS } from '@/utils/constants'
import { getInitial, getPlayerColor } from '@/utils/helpers'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}
const RoundLeaderboard = ({}: Props) => {
	const router = useRouter()
	const socket = useSocket()
	const { players } = useRoomStore()
	const {
		roundNumber,
		totalRounds,
		roundScores,
		scores,
		setPhase,
		setQuestion,
		setAnswers,
	} = useGameStore()

	useEffect(() => {
		socket.on(
			'phase_changed',
			({ phase, timeLeft, roundNumber: rn, askerIndex }) => {
				setPhase(phase, timeLeft, rn, askerIndex)
				setQuestion('')
				setAnswers([])
				if (phase === 'ask') router.replace('/ask-phase')
				else if (phase === 'answer') router.replace('/answer-phase')
				else if (phase === 'final') router.replace('/final-results')
			},
		)
		socket.on('game_over', ({ finalScores }) => {
			router.replace('/final-results')
		})
		return () => {
			socket.off('phase_changed')
			socket.off('game_over')
		}
	}, [])

	// Build sorted leaderboard from scores
	const displayPlayers =
		players.length > 0
			? [...players]
					.map((p) => ({
						id: p.id,
						name: p.username,
						total: scores[p.id] ?? 0,
						delta: roundScores[p.id] ?? 0,
					}))
					.sort((a, b) => b.total - a.total)
			: [
					{ id: '1', name: 'Alex', total: 3, delta: 3 },
					{ id: '2', name: 'Mia', total: 2, delta: 2 },
					{ id: '3', name: 'Sam', total: 2, delta: 1 },
					{ id: '4', name: 'Jordan', total: 1, delta: 1 },
				]

	const roundWinner = displayPlayers[0]
	const maxDelta = Math.max(...displayPlayers.map((p) => p.delta), 0)
	const isLast = roundNumber >= totalRounds

	function handleNext() {
		// Server drives phase transitions; this is a fallback for demo
		router.replace('/ask-phase')
	}

	return (
		<SafeAreaView style={globalStyles.safe}>
			<ScrollView contentContainerStyle={globalStyles.scroll}>
				{/* Title */}
				<View style={styles.titleArea}>
					<Text style={globalStyles.title}>Round {roundNumber} Results</Text>
					<Text style={globalStyles.subtitle}>
						{totalRounds} rounds total ·{' '}
						{Math.max(0, totalRounds - roundNumber)} remaining
					</Text>
				</View>

				{/* Round winner callout */}
				{roundWinner && (
					<View style={styles.winnerWrapper}>
						<View style={styles.winnerShadow} />
						<View style={styles.winnerCard}>
							<Text style={styles.trophyEmoji}>🏆</Text>
							<Text style={styles.winnerText}>
								{roundWinner.name} got {maxDelta}/{displayPlayers.length}{' '}
								correct!
							</Text>
							{maxDelta === displayPlayers.length && (
								<Text style={styles.perfectLabel}>Perfect round</Text>
							)}
						</View>
					</View>
				)}

				{/* Leaderboard */}
				<View style={styles.list}>
					{displayPlayers.map((p, i) => {
						const color = getPlayerColor(i)
						return (
							<View
								key={p.id}
								style={[styles.row, i === 0 && { borderColor: COLORS.accent }]}
							>
								<Text
									style={[styles.rank, i === 0 && { color: COLORS.accent }]}
								>
									{i + 1}
								</Text>
								<View
									style={[
										styles.avatar,
										{ borderColor: color, backgroundColor: color + '33' },
									]}
								>
									<Text style={[styles.avatarText, { color }]}>
										{getInitial(p.name)}
									</Text>
								</View>
								<Text style={styles.playerName}>{p.name}</Text>
								{p.delta > 0 && (
									<View style={styles.deltaBadge}>
										<Text style={styles.deltaText}>+{p.delta}</Text>
									</View>
								)}
								<Text style={styles.totalScore}>{p.total}</Text>
							</View>
						)
					})}
				</View>

				<View style={styles.footer}>
					<NeoButton
						label={isLast ? 'View Final Results →' : 'Next Round →'}
						bg={COLORS.accent}
						onPress={
							isLast ? () => router.replace('/final-results') : handleNext
						}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default RoundLeaderboard

const styles = StyleSheet.create({
	titleArea: { alignItems: 'center', gap: 4 },
	winnerWrapper: { position: 'relative' },
	winnerShadow: {
		position: 'absolute',
		top: 4,
		left: 4,
		right: -4,
		bottom: -4,
		borderRadius: 14,
		backgroundColor: COLORS.border,
	},
	winnerCard: {
		backgroundColor: COLORS.accent + '33',
		borderWidth: 2,
		borderColor: COLORS.accent,
		borderRadius: 14,
		padding: 14,
		alignItems: 'center',
		gap: 4,
	},
	trophyEmoji: { fontSize: 30 },
	winnerText: {
		fontSize: 22,
		fontWeight: '700',
		color: COLORS.fg,
		textAlign: 'center',
	},
	perfectLabel: { fontSize: 14, color: COLORS.gray },
	list: { gap: 8 },
	row: {
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
	rank: { fontSize: 18, fontWeight: '700', color: COLORS.gray, width: 24 },
	avatar: {
		width: 32,
		height: 32,
		borderRadius: 16,
		borderWidth: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarText: { fontSize: 13, fontWeight: '700' },
	playerName: { flex: 1, fontSize: 17, color: COLORS.fg },
	deltaBadge: {
		backgroundColor: COLORS.green + '33',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 6,
	},
	deltaText: { fontSize: 14, color: COLORS.green },
	totalScore: {
		fontSize: 20,
		fontWeight: '700',
		color: COLORS.fg,
		minWidth: 28,
		textAlign: 'right',
	},
	footer: { marginTop: 'auto' as any },
})
