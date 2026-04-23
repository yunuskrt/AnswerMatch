import Text from '@/components/Text'
import { COLORS } from '@/utils/constants'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

type Props = {
	label: string
	active: boolean
	color: string
	onPress: () => void
}
const Chip = ({ label, active, color, onPress }: Props) => {
	return (
		<TouchableOpacity
			style={[
				styles.chip,
				active && { borderColor: COLORS.border, backgroundColor: color + '33' },
			]}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<Text
				style={[styles.text, active && { fontWeight: '700', color: COLORS.fg }]}
			>
				{label}
			</Text>
		</TouchableOpacity>
	)
}

export default Chip

const styles = StyleSheet.create({
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
