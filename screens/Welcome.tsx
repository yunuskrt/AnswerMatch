import GameHistory from '@/components/GameHistory'
import NeoButton from '@/components/NeoButton'
import SectionLabel from '@/components/SectionLabel'
import Text from '@/components/Text'
import { useUserStore } from '@/store/useUserStore'
import { globalStyles } from '@/styles/global'
import { COLORS } from '@/utils/constants'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}
const Welcome = ({}: Props) => {
	const router = useRouter()
	const { username, setUsername, gameHistory } = useUserStore()
	const [inputValue, setInputValue] = useState(username)

	function validateUsername(name: string) {
		const trimmed = name.trim()
		if (!trimmed) {
			Alert.alert('Error', 'Please enter a valid username.')
			return false
		}
		setUsername(trimmed)
		return true
	}

	function handleCreate() {
		if (!validateUsername(inputValue)) return
		router.push('/create-room')
	}

	function handleJoin() {
		if (!validateUsername(inputValue)) return
		router.push('/guest-lobby')
	}

	return (
		<SafeAreaView style={globalStyles.safe}>
			<ScrollView
				contentContainerStyle={styles.scroll}
				keyboardShouldPersistTaps='handled'
			>
				<View style={styles.main}>
					<View style={styles.logoContainer}>
						<View style={styles.logoBox}>
							<Text style={styles.logoEmoji}>🎭</Text>
						</View>
						<Text style={styles.appName}>AnswerMatch</Text>
						<Text style={styles.tagline}>Ask · Answer · Match!</Text>
					</View>

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

					<View style={styles.ctaGroup}>
						<NeoButton
							label='🎲 Create a Room'
							bg={COLORS.accent}
							onPress={handleCreate}
						/>
						<NeoButton
							label='🔗 Join a Room'
							bg={COLORS.accent3}
							onPress={handleJoin}
						/>
					</View>
				</View>

				{/* Recent games — independently scrollable */}
				{gameHistory.length > 0 && <GameHistory records={gameHistory} />}
			</ScrollView>
		</SafeAreaView>
	)
}

export default Welcome

const styles = StyleSheet.create({
	scroll: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingBottom: 40,
	},
	main: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		gap: 24,
		paddingVertical: 32,
	},
	logoContainer: {
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
})
