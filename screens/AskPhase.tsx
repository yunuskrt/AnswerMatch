import TimerRing from '@/components/TimerRing'
import { useSocket } from '@/hooks/useSocket'
import { useGameStore } from '@/store/useGameStore'
import { useRoomStore } from '@/store/useRoomStore'
import { emitSubmitQuestion } from '@/utils/callbacks'
import { COLORS } from '@/utils/constants'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'

export default function AskPhase() {
	const router = useRouter()
	const socket = useSocket()
	const { roomId } = useRoomStore()
	const {
		roundNumber,
		totalRounds,
		timeLeft,
		setTimeLeft,
		setPhase,
		setQuestion,
	} = useGameStore()

	const [questionInput, setQuestionInput] = useState('')

	useEffect(() => {
		socket.on(
			'phase_changed',
			({ phase, timeLeft: tl, roundNumber: rn, askerIndex }) => {
				setPhase(phase, tl, rn, askerIndex)
				if (phase === 'answer') router.replace('/answer-phase')
				else if (phase === 'matching') router.replace('/matching-phase')
				else if (phase === 'round_results') router.replace('/round-leaderboard')
				else if (phase === 'final') router.replace('/final-results')
			},
		)
		socket.on('timer_tick', ({ timeLeft: tl }) => {
			setTimeLeft(tl)
		})
		return () => {
			socket.off('phase_changed')
			socket.off('timer_tick')
		}
	}, [])

	function handleSend() {
		if (!questionInput.trim() || !roomId) return
		setQuestion(questionInput.trim())
		emitSubmitQuestion(socket, roomId, questionInput.trim())
		setQuestionInput('')
	}

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
						<Text style={styles.yourTurnText}>🎤 Your Turn!</Text>
					</View>

					{/* Timer */}
					<View style={styles.timerArea}>
						<TimerRing
							seconds={timeLeft}
							totalSeconds={30}
							accent={COLORS.accent2}
							size={80}
						/>
						<Text style={styles.timerLabel}>Time to ask a question</Text>
					</View>

					{/* Question input */}
					<View style={styles.inputSection}>
						<SectionLabel text='Type your question' />
						<TextInput
							style={styles.questionInput}
							value={questionInput}
							onChangeText={setQuestionInput}
							placeholder="What's the weirdest thing you've eaten?"
							placeholderTextColor={COLORS.gray}
							multiline
							textAlignVertical='top'
							maxLength={200}
						/>
						<View style={styles.hintBox}>
							<Text style={styles.hintText}>
								💡 Everyone (including you) will answer this question!
							</Text>
						</View>
					</View>

					<NeoButton
						label='Send Question →'
						bg={COLORS.accent2}
						onPress={handleSend}
					/>
				</ScrollView>
			</KeyboardAvoidingView>
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

function NeoButton({
	label,
	bg,
	onPress,
}: {
	label: string
	bg: string
	onPress: () => void
}) {
	return (
		<View style={btnStyles.wrapper}>
			<View style={[btnStyles.shadow, { backgroundColor: COLORS.border }]} />
			<TouchableOpacity
				style={[btnStyles.btn, { backgroundColor: bg }]}
				onPress={onPress}
				activeOpacity={0.85}
			>
				<Text style={btnStyles.label}>{label}</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: COLORS.bg },
	scroll: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: 12,
		paddingBottom: 40,
		gap: 16,
	},
	roundBadge: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: COLORS.accent2 + '22',
		borderWidth: 1.5,
		borderColor: COLORS.accent2,
		borderRadius: 10,
		paddingVertical: 10,
		paddingHorizontal: 14,
	},
	roundText: { fontSize: 15, color: COLORS.fg },
	yourTurnText: { fontSize: 15, fontWeight: '700', color: COLORS.accent2 },
	timerArea: {
		alignItems: 'center',
		gap: 8,
		paddingVertical: 8,
	},
	timerLabel: { fontSize: 14, color: COLORS.gray },
	inputSection: { gap: 10, flex: 1 },
	questionInput: {
		borderWidth: 2,
		borderColor: COLORS.border,
		borderRadius: 12,
		padding: 14,
		fontSize: 17,
		color: COLORS.fg,
		backgroundColor: COLORS.white,
		minHeight: 110,
	},
	hintBox: {
		backgroundColor: COLORS.accent + '22',
		borderWidth: 1.5,
		borderColor: COLORS.accent,
		borderStyle: 'dashed',
		borderRadius: 10,
		padding: 10,
	},
	hintText: { fontSize: 13, color: COLORS.gray },
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
