import Chip from '@/components/Chip'
import NeoButton from '@/components/NeoButton'
import SectionLabel from '@/components/SectionLabel'
import Tag from '@/components/Tag'
import { useRoomStore } from '@/store/useRoomStore'
import { useUserStore } from '@/store/useUserStore'
import { COLORS, DURATION_OPTIONS, MAX_CAPACITY, MIN_CAPACITY, ROUND_OPTIONS } from '@/utils/constants'
import { generateRoomId } from '@/utils/helpers'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import Text from '@/components/Text'
import {
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}
const CreateRoom = ({}: Props) => {
	const router = useRouter()
	const { username } = useUserStore()
	const { settings, setSettings, setRoom } = useRoomStore()

	const [capacity, setCapacity] = useState(settings.minCapacity)
	const [duration, setDuration] = useState(settings.roundDuration)
	const [rounds, setRounds] = useState(settings.rounds)
	const [roomId] = useState(generateRoomId())

	function handleCreate() {
		setSettings({ minCapacity: capacity, roundDuration: duration, rounds })
		setRoom(roomId, username)
		router.push('/host-lobby')
	}

	const sliderPct =
		((capacity - MIN_CAPACITY) / (MAX_CAPACITY - MIN_CAPACITY)) * 100

	return (
		<SafeAreaView style={styles.safe}>
			<ScrollView
				contentContainerStyle={styles.scroll}
				keyboardShouldPersistTaps='handled'
			>
				<View style={styles.header}>
					<Text style={styles.title}>Create Room</Text>
					<Text style={styles.subtitle}>Configure your game settings</Text>
				</View>

				{/* Min Capacity */}
				<View style={styles.section}>
					<SectionLabel
						text={`Min. capacity  (${MIN_CAPACITY}–${MAX_CAPACITY})`}
					/>
					<View style={styles.sliderRow}>
						<View style={styles.sliderTrack}>
							<View style={[styles.sliderFill, { width: `${sliderPct}%` }]} />
							<View
								style={[
									styles.sliderThumb,
									{ left: `${Math.max(0, sliderPct - 3)}%` },
								]}
							/>
						</View>
						<View style={styles.capacityBox}>
							<Text style={styles.capacityNum}>{capacity}</Text>
						</View>
					</View>
					<View style={styles.capacityBtns}>
						{Array.from(
							{ length: MAX_CAPACITY - MIN_CAPACITY + 1 },
							(_, i) => i + MIN_CAPACITY,
						).map((val) => (
							<TouchableOpacity
								key={val}
								style={[
									styles.capacityDot,
									capacity === val && styles.capacityDotActive,
								]}
								onPress={() => setCapacity(val)}
							/>
						))}
					</View>
				</View>

				{/* Round duration */}
				<View style={styles.section}>
					<SectionLabel text='Round duration' />
					<View style={styles.chipRow}>
						{DURATION_OPTIONS.map((t) => (
							<Chip
								key={t}
								label={`${t}s`}
								active={duration === t}
								color={COLORS.accent}
								onPress={() => setDuration(t)}
							/>
						))}
					</View>
				</View>

				{/* Number of rounds */}
				<View style={styles.section}>
					<SectionLabel text='Number of rounds' />
					<View style={styles.chipRow}>
						{ROUND_OPTIONS.map((n) => (
							<Chip
								key={n}
								label={String(n)}
								active={rounds === n}
								color={COLORS.accent3}
								onPress={() => setRounds(n)}
							/>
						))}
					</View>
				</View>

				{/* Room preview card */}
				<View style={styles.cardWrapper}>
					<View style={styles.cardShadow} />
					<View style={styles.card}>
						<View style={styles.cardHeader}>
							<Text style={styles.cardLabel}>Room ID</Text>
							<Text style={styles.cardRoomId}>#{roomId}</Text>
						</View>
						<View style={styles.tagRow}>
							<Tag label={`${capacity} players`} color={COLORS.accent} />
							<Tag label={`${rounds} rounds`} color={COLORS.accent3} />
							<Tag label={`${duration}s`} color={COLORS.accent2} />
						</View>
					</View>
				</View>

				<View style={styles.btnWrapper}>
					<NeoButton
						label='✨  Create Room'
						bg={COLORS.accent2}
						onPress={handleCreate}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default CreateRoom

const styles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: COLORS.bg },
	scroll: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: 16,
		paddingBottom: 40,
		gap: 20,
	},
	header: { gap: 4 },
	title: { fontSize: 26, fontWeight: '700', color: COLORS.fg },
	subtitle: { fontSize: 14, color: COLORS.gray },
	section: { gap: 10 },
	sliderRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	sliderTrack: {
		flex: 1,
		height: 8,
		backgroundColor: COLORS.lightGray,
		borderRadius: 4,
		position: 'relative',
		justifyContent: 'center',
	},
	sliderFill: {
		position: 'absolute',
		left: 0,
		top: 0,
		height: '100%',
		backgroundColor: COLORS.accent,
		borderRadius: 4,
	},
	sliderThumb: {
		position: 'absolute',
		width: 20,
		height: 20,
		backgroundColor: COLORS.white,
		borderWidth: 2.5,
		borderColor: COLORS.border,
		borderRadius: 10,
		top: -6,
	},
	capacityBox: {
		width: 44,
		height: 40,
		borderWidth: 2,
		borderColor: COLORS.border,
		borderRadius: 8,
		backgroundColor: COLORS.white,
		alignItems: 'center',
		justifyContent: 'center',
	},
	capacityNum: { fontSize: 18, fontWeight: '700', color: COLORS.fg },
	capacityBtns: {
		flexDirection: 'row',
		gap: 6,
		paddingHorizontal: 2,
	},
	capacityDot: {
		flex: 1,
		height: 6,
		borderRadius: 3,
		backgroundColor: COLORS.lightGray,
	},
	capacityDotActive: {
		backgroundColor: COLORS.accent,
	},
	chipRow: {
		flexDirection: 'row',
		gap: 10,
	},
	cardWrapper: {
		position: 'relative',
		marginTop: 4,
	},
	cardShadow: {
		position: 'absolute',
		top: 4,
		left: 4,
		right: -4,
		bottom: -4,
		borderRadius: 12,
		backgroundColor: COLORS.border,
	},
	card: {
		backgroundColor: COLORS.white,
		borderWidth: 2,
		borderColor: COLORS.border,
		borderRadius: 12,
		padding: 14,
		gap: 8,
	},
	cardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	cardLabel: { fontSize: 14, color: COLORS.gray },
	cardRoomId: {
		fontSize: 24,
		fontWeight: '700',
		color: COLORS.accent,
		letterSpacing: 2,
	},
	tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
	btnWrapper: { marginTop: 8 },
})