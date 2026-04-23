import Chip from '@/components/Chip'
import NeoButton from '@/components/NeoButton'
import RoomPreviewCard from '@/components/RoomPreviewCard'
import SectionLabel from '@/components/SectionLabel'
import Text from '@/components/Text'
import { useRoomStore } from '@/store/useRoomStore'
import { useUserStore } from '@/store/useUserStore'
import { COLORS, DURATION_OPTIONS, MAX_CAPACITY, MIN_CAPACITY } from '@/utils/constants'
import { generateRoomId } from '@/utils/helpers'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
	LayoutChangeEvent,
	PanResponder,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const THUMB_SIZE = 22
const TRACK_HEIGHT = 8
const TOUCH_HEIGHT = 36
const TRACK_TOP = (TOUCH_HEIGHT - TRACK_HEIGHT) / 2
const THUMB_TOP = (TOUCH_HEIGHT - THUMB_SIZE) / 2

type Props = {}
const CreateRoom = ({}: Props) => {
	const router = useRouter()
	const { username } = useUserStore()
	const { settings, setSettings, setRoom } = useRoomStore()

	const [capacity, setCapacity] = useState(settings.minCapacity)
	const [duration, setDuration] = useState(settings.roundDuration)
	const [rounds, setRounds] = useState(settings.rounds)
	const [roomId] = useState(generateRoomId())
	const [trackWidth, setTrackWidth] = useState(0)

	const sliderRef = useRef<View>(null)
	const trackWidthRef = useRef(0)
	const trackPageXRef = useRef(0)

	const roundOptions = useMemo(
		() => [capacity, capacity * 2, capacity * 3],
		[capacity],
	)

	useEffect(() => {
		setRounds((prev) => {
			const opts = [capacity, capacity * 2, capacity * 3]
			return opts.includes(prev) ? prev : capacity
		})
	}, [capacity])

	function updateCapacityFromX(x: number) {
		const clamped = Math.max(0, Math.min(x, trackWidthRef.current))
		const pct = trackWidthRef.current > 0 ? clamped / trackWidthRef.current : 0
		const raw = MIN_CAPACITY + pct * (MAX_CAPACITY - MIN_CAPACITY)
		setCapacity(Math.round(raw))
	}

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPanResponderGrant: (evt) => {
				updateCapacityFromX(evt.nativeEvent.pageX - trackPageXRef.current)
			},
			onPanResponderMove: (evt) => {
				updateCapacityFromX(evt.nativeEvent.pageX - trackPageXRef.current)
			},
		}),
	).current

	function handleSliderLayout(e: LayoutChangeEvent) {
		const w = e.nativeEvent.layout.width
		setTrackWidth(w)
		trackWidthRef.current = w
		sliderRef.current?.measure((_x, _y, _w, _h, pageX) => {
			trackPageXRef.current = pageX
		})
	}

	function handleCreate() {
		setSettings({ minCapacity: capacity, roundDuration: duration, rounds })
		setRoom(roomId, username)
		router.push('/host-lobby')
	}

	const sliderPct =
		((capacity - MIN_CAPACITY) / (MAX_CAPACITY - MIN_CAPACITY)) * 100
	const thumbLeft =
		trackWidth > 0
			? Math.max(
					0,
					Math.min(
						(sliderPct / 100) * trackWidth - THUMB_SIZE / 2,
						trackWidth - THUMB_SIZE,
					),
				)
			: 0

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
						<View
							ref={sliderRef}
							style={styles.sliderTouch}
							onLayout={handleSliderLayout}
							{...panResponder.panHandlers}
						>
							<View style={styles.sliderTrackBg} />
							<View style={[styles.sliderFill, { width: `${sliderPct}%` }]} />
							<View style={[styles.sliderThumb, { left: thumbLeft }]} />
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
						{roundOptions.map((n) => (
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
				<RoomPreviewCard
					roomId={roomId}
					capacity={capacity}
					rounds={rounds}
					duration={duration}
				/>

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
	sliderTouch: {
		flex: 1,
		height: TOUCH_HEIGHT,
	},
	sliderTrackBg: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: TRACK_TOP,
		height: TRACK_HEIGHT,
		backgroundColor: COLORS.lightGray,
		borderRadius: 4,
	},
	sliderFill: {
		position: 'absolute',
		left: 0,
		top: TRACK_TOP,
		height: TRACK_HEIGHT,
		backgroundColor: COLORS.accent,
		borderRadius: 4,
	},
	sliderThumb: {
		position: 'absolute',
		top: THUMB_TOP,
		width: THUMB_SIZE,
		height: THUMB_SIZE,
		backgroundColor: COLORS.white,
		borderWidth: 2.5,
		borderColor: COLORS.border,
		borderRadius: THUMB_SIZE / 2,
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
	btnWrapper: { marginTop: 8 },
})