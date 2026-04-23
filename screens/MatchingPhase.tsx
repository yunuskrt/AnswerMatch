import NeoButton from '@/components/NeoButton'
import Text from '@/components/Text'
import TimerRing from '@/components/TimerRing'
import { useSocket } from '@/hooks/useSocket'
import { useGameStore } from '@/store/useGameStore'
import { useRoomStore } from '@/store/useRoomStore'
import { globalStyles } from '@/styles/global'
import { emitSubmitMatches } from '@/utils/callbacks'
import { COLORS } from '@/utils/constants'
import { getInitial, getPlayerColor } from '@/utils/helpers'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Svg, { Line } from 'react-native-svg'

type Props = {}
const MatchingPhase = ({}: Props) => {
	const router = useRouter()
	const socket = useSocket()
	const { roomId, players } = useRoomStore()
	const {
		timeLeft,
		answers,
		matches,
		setMatch,
		setPhase,
		setTimeLeft,
		setRoundResults,
	} = useGameStore()

	const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

	useEffect(() => {
		socket.on(
			'phase_changed',
			({ phase, timeLeft: tl, roundNumber: rn, askerIndex }) => {
				setPhase(phase, tl, rn, askerIndex)
				if (phase === 'round_results') router.replace('/round-leaderboard')
				else if (phase === 'final') router.replace('/final-results')
			},
		)
		socket.on('timer_tick', ({ timeLeft: tl }) => setTimeLeft(tl))
		socket.on('round_results', ({ correctMatches, scores }) => {
			setRoundResults(scores, correctMatches)
			router.replace('/round-leaderboard')
		})
		return () => {
			socket.off('phase_changed')
			socket.off('timer_tick')
			socket.off('round_results')
		}
	}, [])

	function handleAnswerPress(answerId: string) {
		setSelectedAnswer(answerId === selectedAnswer ? null : answerId)
	}

	function handlePlayerPress(playerId: string) {
		if (!selectedAnswer) return
		setMatch(selectedAnswer, playerId)
		setSelectedAnswer(null)
	}

	function handleSubmit() {
		if (!roomId) return
		emitSubmitMatches(socket, roomId, matches)
	}

	const displayAnswers =
		answers.length > 0
			? answers
			: [
					{ id: 'a1', text: 'Fried scorpion in Bangkok' },
					{ id: 'a2', text: "Nothing, I'm picky 😅" },
					{ id: 'a3', text: "My grandma's mystery soup" },
					{ id: 'a4', text: 'Durian ice cream' },
				]

	const displayPlayers =
		players.length > 0
			? players
			: [
					{ id: 'p1', username: 'Alex' },
					{ id: 'p2', username: 'Sam' },
					{ id: 'p3', username: 'Mia' },
					{ id: 'p4', username: 'Jordan' },
				]

	const matchedCount = Object.keys(matches).length

	return (
		<SafeAreaView style={globalStyles.safe}>
			<View style={styles.container}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={globalStyles.title}>Who said what?</Text>
					<TimerRing
						seconds={timeLeft}
						totalSeconds={30}
						accent={COLORS.purple}
						size={64}
					/>
				</View>
				<Text style={styles.hint}>
					Tap an answer, then tap a player to match
				</Text>

				{/* Two-column layout */}
				<View style={styles.columns}>
					{/* Answers */}
					<View style={styles.col}>
						<Text style={styles.colHeader}>Answers</Text>
						{displayAnswers.map((a) => {
							const isSelected = selectedAnswer === a.id
							const isMatched = a.id in matches
							return (
								<TouchableOpacity
									key={a.id}
									style={[
										styles.answerCard,
										isSelected && styles.answerSelected,
										isMatched && styles.answerMatched,
									]}
									onPress={() => handleAnswerPress(a.id)}
									activeOpacity={0.75}
								>
									<Text style={styles.answerText}>{a.text}</Text>
								</TouchableOpacity>
							)
						})}
					</View>

					{/* Connector arrows */}
					<View style={styles.arrowCol}>
						<Svg width={24} height={200} viewBox='0 0 24 200'>
							<Line
								x1={4}
								y1={30}
								x2={20}
								y2={30}
								stroke={COLORS.lightGray}
								strokeWidth={1.5}
								strokeDasharray='3 2'
							/>
							<Line
								x1={4}
								y1={78}
								x2={20}
								y2={78}
								stroke={COLORS.lightGray}
								strokeWidth={1.5}
								strokeDasharray='3 2'
							/>
							<Line
								x1={4}
								y1={126}
								x2={20}
								y2={126}
								stroke={COLORS.lightGray}
								strokeWidth={1.5}
								strokeDasharray='3 2'
							/>
							<Line
								x1={4}
								y1={174}
								x2={20}
								y2={174}
								stroke={COLORS.lightGray}
								strokeWidth={1.5}
								strokeDasharray='3 2'
							/>
						</Svg>
					</View>

					{/* Players */}
					<View style={styles.col}>
						<Text style={styles.colHeader}>Players</Text>
						{displayPlayers.map((p, i) => {
							const color = getPlayerColor(i)
							const matchedAnswerId = Object.keys(matches).find(
								(k) => matches[k] === p.id,
							)
							return (
								<TouchableOpacity
									key={p.id}
									style={[
										styles.playerCard,
										matchedAnswerId && { borderColor: color },
									]}
									onPress={() => handlePlayerPress(p.id)}
									activeOpacity={0.75}
								>
									<View
										style={[
											styles.playerAvatar,
											{
												borderColor: color,
												backgroundColor: color + '33',
												width: 26,
												height: 26,
												borderRadius: 13,
											},
										]}
									>
										<Text style={[styles.playerInitial, { color }]}>
											{getInitial(p.username)}
										</Text>
									</View>
									<Text style={styles.playerName}>{p.username}</Text>
									{matchedAnswerId && <Text style={styles.checkmark}>✓</Text>}
								</TouchableOpacity>
							)
						})}
					</View>
				</View>

				{/* Submit */}
				<View style={styles.submitArea}>
					<Text style={styles.matchCount}>
						{matchedCount} / {displayAnswers.length} matched
					</Text>
					<NeoButton
						label='Submit Matches →'
						bg={COLORS.purple}
						onPress={handleSubmit}
					/>
				</View>
			</View>
		</SafeAreaView>
	)
}

export default MatchingPhase

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 12,
		paddingBottom: 32,
		gap: 10,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	hint: { fontSize: 13, color: COLORS.gray },
	columns: {
		flex: 1,
		flexDirection: 'row',
		gap: 4,
	},
	col: {
		flex: 1,
		gap: 6,
	},
	colHeader: {
		fontSize: 12,
		color: COLORS.gray,
		textAlign: 'center',
		letterSpacing: 0.5,
		textTransform: 'uppercase',
		marginBottom: 2,
	},
	arrowCol: {
		width: 24,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 22,
	},
	answerCard: {
		padding: 8,
		backgroundColor: COLORS.white,
		borderWidth: 2,
		borderColor: COLORS.lightGray,
		borderRadius: 8,
		minHeight: 44,
		justifyContent: 'center',
	},
	answerSelected: {
		borderColor: COLORS.accent,
		backgroundColor: COLORS.accent + '22',
		shadowColor: COLORS.border,
		shadowOffset: { width: 2, height: 2 },
		shadowOpacity: 1,
		shadowRadius: 0,
		elevation: 2,
	},
	answerMatched: {
		borderColor: COLORS.green,
		backgroundColor: COLORS.green + '22',
	},
	answerText: { fontSize: 12, color: COLORS.fg, lineHeight: 16 },
	playerCard: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		padding: 8,
		backgroundColor: COLORS.white,
		borderWidth: 2,
		borderColor: COLORS.lightGray,
		borderRadius: 8,
		minHeight: 44,
	},
	playerAvatar: {
		borderWidth: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	playerInitial: { fontSize: 10, fontWeight: '700' },
	playerName: { flex: 1, fontSize: 12, color: COLORS.fg },
	checkmark: { fontSize: 14 },
	submitArea: { gap: 6 },
	matchCount: { fontSize: 13, color: COLORS.gray, textAlign: 'center' },
})
