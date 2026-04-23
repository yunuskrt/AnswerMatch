import CopyButton from '@/components/CopyButton'
import Tag from '@/components/Tag'
import { COLORS } from '@/utils/constants'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
	roomId: string
	capacity: number
	rounds: number
	duration: number
}
const RoomPreviewCard = ({ roomId, capacity, rounds, duration }: Props) => {
	return (
		<View style={styles.cardWrapper}>
			<View style={styles.cardShadow} />
			<View style={styles.card}>
				<View style={styles.cardHeader}>
					<Text style={styles.cardLabel}>Room ID</Text>
					<View style={styles.cardRoomIdRow}>
						<Text style={styles.cardRoomId}>#{roomId}</Text>
						<CopyButton roomId={roomId} />
					</View>
				</View>
				<View style={styles.tagRow}>
					<Tag label={`${capacity} players`} color={COLORS.accent} />
					<Tag label={`${rounds} rounds`} color={COLORS.accent3} />
					<Tag label={`${duration}s`} color={COLORS.accent2} />
				</View>
			</View>
		</View>
	)
}

export default RoomPreviewCard

const styles = StyleSheet.create({
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
	cardRoomIdRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	cardRoomId: {
		fontSize: 24,
		fontWeight: '700',
		color: COLORS.accent,
		letterSpacing: 2,
	},
	tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
})
