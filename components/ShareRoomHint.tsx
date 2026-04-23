import Text from '@/components/Text'
import { COLORS } from '@/utils/constants'
import React from 'react'
import { Share, StyleSheet, TouchableOpacity } from 'react-native'

type Props = {
	roomId: string
}
const ShareRoomHint = ({ roomId }: Props) => {
	async function handleShare() {
		await Share.share({
			message: `Join my game room! Room ID: ${roomId}`,
		})
	}
	return (
		<TouchableOpacity style={styles.hint} onPress={handleShare}>
			<Text style={styles.icon}>📋</Text>
			<Text style={styles.text}>Share room ID with friends</Text>
		</TouchableOpacity>
	)
}

export default ShareRoomHint

const styles = StyleSheet.create({
	hint: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		backgroundColor: COLORS.accent + '22',
		borderWidth: 1.5,
		borderColor: COLORS.accent,
		borderStyle: 'dashed',
		borderRadius: 10,
		padding: 10,
	},
	icon: { fontSize: 18 },
	text: { fontSize: 14, color: COLORS.fg },
})
