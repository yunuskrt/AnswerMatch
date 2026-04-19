import { useRoomStore } from '@/store/useRoomStore'
import { useUserStore } from '@/store/useUserStore'
import { COLORS, MAX_CAPACITY, MIN_CAPACITY } from '@/utils/constants'
import { generateRoomId } from '@/utils/helpers'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'

const DURATION_OPTIONS = [15, 30, 60]
const ROUND_OPTIONS = [5, 10, 15]

export default function CreateRoom() {
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

function SectionLabel({ text }: { text: string }) {
	return (
		<View style={sl.row}>
			<Text style={sl.text}>{text}</Text>
			<View style={sl.line} />
		</View>
	)
}

function Chip({
	label,
	active,
	color,
	onPress,
}: {
	label: string
	active: boolean
	color: string
	onPress: () => void
}) {
	return (
		<TouchableOpacity
			style={[
				chipStyles.chip,
				active && { borderColor: COLORS.border, backgroundColor: color + '33' },
				active && chipStyles.chipShadow,
			]}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<Text
				style={[
					chipStyles.text,
					active && { fontWeight: '700', color: COLORS.fg },
				]}
			>
				{label}
			</Text>
		</TouchableOpacity>
	)
}

function Tag({ label, color }: { label: string; color: string }) {
	return (
		<View
			style={[
				tagStyles.tag,
				{ backgroundColor: color + '33', borderColor: color },
			]}
		>
			<Text style={tagStyles.text}>{label}</Text>
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

const chipStyles = StyleSheet.create({
	chip: {
		flex: 1,
		height: 40,
		borderWidth: 2,
		borderColor: COLORS.lightGray,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.white,
	},
	chipShadow: {
		shadowColor: COLORS.border,
		shadowOffset: { width: 2, height: 2 },
		shadowOpacity: 1,
		shadowRadius: 0,
		elevation: 2,
	},
	text: { fontSize: 16, color: COLORS.gray },
})

const tagStyles = StyleSheet.create({
	tag: {
		paddingHorizontal: 10,
		paddingVertical: 3,
		borderRadius: 20,
		borderWidth: 1.5,
	},
	text: { fontSize: 13, color: COLORS.fg },
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
