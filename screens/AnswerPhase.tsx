import NeoButton from '@/components/NeoButton'
import SectionLabel from '@/components/SectionLabel'
import TimerRing from '@/components/TimerRing'
import { useSocket } from '@/hooks/useSocket'
import { useGameStore } from '@/store/useGameStore'
import { useRoomStore } from '@/store/useRoomStore'
import { emitSubmitAnswer } from '@/utils/callbacks'
import { COLORS } from '@/utils/constants'
import { getInitial, getPlayerColor } from '@/utils/helpers'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import Text from '@/components/Text'
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}
const AnswerPhase = ({}: Props) => {
	const router = useRouter()
	const socket = useSocket()
	const { roomId, players } = useRoomStore()
	const {
		roundNumber,
		totalRounds,
		timeLeft,
		question,
		setTimeLeft,
		setPhase,
		setAnswers,
	} = useGameStore()

	const [answerInput, setAnswerInput] = useState('')
	const [submitted, setSubmitted] = useState(false)
	const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set())

	useEffect(() => {
		socket.on(
			'phase_changed',
			({ phase, timeLeft: tl, roundNumber: rn, askerIndex }) => {
				setPhase(phase, tl, rn, askerIndex)
				if (phase === 'matching') router.replace('/matching-phase')
				else if (phase === 'round_results') router.replace('/round-leaderboard')
				else if (phase === 'final') router.replace('/final-results')
			},
		)
		socket.on('timer_tick', ({ timeLeft: tl }) => setTimeLeft(tl))
		socket.on('answers_collected', ({ answers }) => {
			setAnswers(answers)
		})
		socket.on('player_answered', ({ playerId }) => {
			setAnsweredIds((prev) => new Set([...prev, playerId]))
		})
		return () => {
			socket.off('phase_changed')
			socket.off('timer_tick')
			socket.off('answers_collected')
			socket.off('player_answered')
		}
	}, [])

	function handleSubmit() {
		if (!answerInput.trim() || !roomId || submitted) return
		emitSubmitAnswer(socket, roomId, answerInput.trim())
		setSubmitted(true)
	}

	const displayPlayers =
		players.length > 0
			? players
			: [
					{ id: 'A', username: 'Alex' },
					{ id: 'S', username: 'Sam' },
					{ id: 'M', username: 'Mia' },
					{ id: 'Y', username: 'You' },
				]

	return (
		<SafeAreaView style={styles.safe}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			>
				<ScrollView
					contentContainerStyle={styles.scroll}
					keyboardShouldPersistTaps='handled'
				>
					{/* Round header */}
					<View style={styles.roundBadge}>
						<Text style={styles.roundText}>
							Round <Text style={{ fontWeight: '700' }}>{roundNumber}</Text> /{' '}
							{totalRounds || '?'}
						</Text>
						<Text style={styles.phaseText}>💬 Answer!</Text>
					</View>

					{/* Question bubble */}
					<View style={styles.questionBubbleWrapper}>
						<View style={styles.questionBubbleShadow} />
						<View style={styles.questionBubble}>
							<View style={styles.askerRow}>
								<View style={styles.smallAvatar}>
									<Text style={styles.smallAvatarText}>A</Text>
								</View>
								<Text style={styles.askerLabel}>Alex asks:</Text>
							</View>
							<Text style={styles.questionText}>
								{question || "What's the weirdest thing you've eaten?"}
							</Text>
						</View>
					</View>

					{/* Timer */}
					<View style={styles.timerArea}>
						<TimerRing
							seconds={timeLeft}
							totalSeconds={30}
							accent={COLORS.accent3}
							size={72}
						/>
					</View>

					{/* Answer input */}
					<View style={styles.inputSection}>
						<SectionLabel text='Your answer' />
						<TextInput
							style={[styles.answerInput, submitted && styles.inputDisabled]}
							value={answerInput}
							onChangeText={setAnswerInput}
							placeholder='Type your answer…'
							placeholderTextColor={COLORS.gray}
							multiline
							textAlignVertical='top'
							maxLength={200}
							editable={!submitted}
						/>

						{/* Player status */}
						<View style={styles.playerStatus}>
							{displayPlayers.map((p, i) => {
								const done = answeredIds.has(p.id)
								const color = getPlayerColor(i)
								return (
									<View key={p.id} style={styles.statusItem}>
										<View
											style={[
												styles.statusAvatar,
												{
													borderColor: done ? color : COLORS.lightGray,
													backgroundColor: done
														? color + '33'
														: COLORS.lightGray + '44',
													width: 32,
													height: 32,
													borderRadius: 16,
												},
											]}
										>
											<Text
												style={[
													styles.statusInitial,
													{ color: done ? color : COLORS.gray },
												]}
											>
												{getInitial(p.username)}
											</Text>
										</View>
										<View
											style={[
												styles.statusDot,
												{
													backgroundColor: done
														? COLORS.green
														: COLORS.lightGray,
												},
											]}
										/>
									</View>
								)
							})}
						</View>
					</View>

					<NeoButton
						label={submitted ? 'Answer Submitted ✓' : 'Submit Answer ✓'}
						bg={submitted ? COLORS.gray : COLORS.accent3}
						onPress={handleSubmit}
					/>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

export default AnswerPhase

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: COLORS.bg },
	scroll: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: 12,
		paddingBottom: 40,
		gap: 14,
	},
	roundBadge: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: COLORS.accent3 + '22',
		borderWidth: 1.5,
		borderColor: COLORS.accent3,
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 14,
	},
	roundText: { fontSize: 15, color: COLORS.fg },
	phaseText: { fontSize: 15, fontWeight: '700', color: COLORS.accent3 },
	questionBubbleWrapper: { position: 'relative' },
	questionBubbleShadow: {
		position: 'absolute',
		top: 4,
		left: 4,
		right: -4,
		bottom: -4,
		borderRadius: 14,
		backgroundColor: COLORS.border,
	},
	questionBubble: {
		backgroundColor: COLORS.white,
		borderWidth: 2,
		borderColor: COLORS.border,
		borderRadius: 14,
		borderTopLeftRadius: 4,
		padding: 14,
		gap: 6,
	},
	askerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	smallAvatar: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: COLORS.accent + '33',
		borderWidth: 1.5,
		borderColor: COLORS.accent,
		alignItems: 'center',
		justifyContent: 'center',
	},
	smallAvatarText: { fontSize: 11, fontWeight: '700', color: COLORS.accent },
	askerLabel: { fontSize: 13, color: COLORS.gray },
	questionText: { fontSize: 20, fontWeight: '700', color: COLORS.fg },
	timerArea: { alignItems: 'center' },
	inputSection: { gap: 10 },
	answerInput: {
		borderWidth: 2,
		borderColor: COLORS.border,
		borderRadius: 12,
		padding: 14,
		fontSize: 17,
		color: COLORS.fg,
		backgroundColor: COLORS.white,
		minHeight: 90,
	},
	inputDisabled: { opacity: 0.7, backgroundColor: COLORS.lightGray },
	playerStatus: {
		flexDirection: 'row',
		gap: 10,
		justifyContent: 'center',
	},
	statusItem: { alignItems: 'center', gap: 4 },
	statusAvatar: {
		borderWidth: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	statusInitial: { fontSize: 12, fontWeight: '700' },
	statusDot: { width: 8, height: 8, borderRadius: 4 },
})