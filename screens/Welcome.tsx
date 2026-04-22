import NeoButton from '@/components/NeoButton'
import SectionLabel from '@/components/SectionLabel'
import { useUserStore } from '@/store/useUserStore'
import { COLORS } from '@/utils/constants'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import Text from '@/components/Text'
import {
	ScrollView,
	StyleSheet,
	TextInput,
	View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}
const Welcome = ({}: Props) => {
	const router = useRouter()
	const { username, setUsername, gameHistory } = useUserStore()
	const [inputValue, setInputValue] = useState(username)

	function handleCreate() {
		const trimmed = inputValue.trim()
		if (!trimmed) return
		setUsername(trimmed)
		router.push('/create-room')
	}

	function handleJoin() {
		const trimmed = inputValue.trim()
		if (!trimmed) return
		setUsername(trimmed)
		router.push('/guest-lobby')
	}

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView
				contentContainerStyle={styles.scroll}
				keyboardShouldPersistTaps='handled'
			>
				{/* Logo */}
				<View style={styles.logoContainer}>
					<View style={styles.logoBox}>
						<Text style={styles.logoEmoji}>🎭</Text>
					</View>
					<Text style={styles.appName}>AnswerMatch</Text>
					<Text style={styles.tagline}>Ask · Answer · Match!</Text>
				</View>

				{/* Username */}
				<View style={styles.section}>
					<SectionLabel text='Your name' />
					<TextInput
						style={styles.input}
						value={inputValue}
						onChangeText={setInputValue}
						placeholder='Enter your username…'
						placeholderTextColor={COLORS.gray}
						maxLength={20}
						autoCapitalize='none'
						autoCorrect={false}
					/>
				</View>

				{/* CTAs */}
				<View style={styles.ctaGroup}>
					<NeoButton
						label='🎲  Create a Room'
						bg={COLORS.accent}
						onPress={handleCreate}
					/>
					<NeoButton
						label='🔗  Join a Room'
						bg={COLORS.accent3}
						onPress={handleJoin}
					/>
				</View>

				{/* Recent games */}
				{gameHistory.length > 0 && (
					<View style={styles.section}>
						<SectionLabel text='Recent games' />
						{gameHistory.slice(0, 3).map((entry, i) => (
							<View key={i} style={styles.historyRow}>
								<Text style={styles.historyRoom}>Room #{entry.roomId}</Text>
								<Text
									style={[
										styles.historyRank,
										entry.placement.includes('1st') && { color: COLORS.accent },
									]}
								>
									{entry.placement}
								</Text>
							</View>
						))}
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	)
}

export default Welcome

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: COLORS.bg },
	scroll: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingBottom: 40,
		alignItems: 'center',
		gap: 24,
	},
	logoContainer: {
		marginTop: 32,
		alignItems: 'center',
		gap: 8,
	},
	logoBox: {
		width: 80,
		height: 80,
		borderRadius: 20,
		borderWidth: 2.5,
		borderColor: COLORS.border,
		backgroundColor: COLORS.accent + '33',
		alignItems: 'center',
		justifyContent: 'center',
	},
	logoEmoji: { fontSize: 38 },
	appName: {
		fontSize: 32,
		fontWeight: '700',
		color: COLORS.fg,
		letterSpacing: -0.5,
	},
	tagline: {
		fontSize: 16,
		color: COLORS.gray,
	},
	section: {
		width: '100%',
		gap: 8,
	},
	input: {
		width: '100%',
		height: 48,
		borderWidth: 2,
		borderColor: COLORS.border,
		borderRadius: 10,
		paddingHorizontal: 14,
		fontSize: 16,
		color: COLORS.fg,
		backgroundColor: COLORS.white,
	},
	ctaGroup: {
		width: '100%',
		gap: 12,
	},
	historyRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 8,
		paddingHorizontal: 12,
		backgroundColor: COLORS.white,
		borderWidth: 1.5,
		borderColor: COLORS.lightGray,
		borderRadius: 10,
		marginTop: 4,
	},
	historyRoom: {
		fontSize: 15,
		color: COLORS.gray,
	},
	historyRank: {
		fontSize: 15,
		color: COLORS.gray,
		fontWeight: '600',
	},
})
