import NeoButton from '@/components/NeoButton'
import SectionLabel from '@/components/SectionLabel'
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
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}
const AskPhase = ({}: Props) => {
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

export default AskPhase

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