import CustomText from '@/components/Text'
import { COLORS } from '@/utils/constants'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

type Props = {
    label: string
    bg: string
    onPress: () => void
}
const NeoButton = ({ label, bg, onPress }: Props) => {
  return (
    <View style={styles.wrapper}>
        <View style={[styles.shadow, { backgroundColor: COLORS.border }]} />
            <TouchableOpacity
                style={[styles.btn, { backgroundColor: bg }]}
                onPress={onPress}
                activeOpacity={0.85}
            >
                <CustomText style={styles.label} numberOfLines={1}>{label}</CustomText>
            </TouchableOpacity>
    </View>
  )
}

export default NeoButton

const styles = StyleSheet.create({
	wrapper: {
		position: 'relative',
		width: '100%',
		height: 52,
	},
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
	label: {
		fontSize: 17,
		fontWeight: '700',
		color: COLORS.white,
		lineHeight: 17,
		includeFontPadding: false,
		textAlignVertical: 'center',
	},
})