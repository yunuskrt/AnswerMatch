import { COLORS } from '@/utils/constants'
import React from 'react'
import Text from '@/components/Text'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

type Props = {
    label: string
	bg: string
	disabled?: boolean
	onPress: () => void
}
const BorderlessNeoButton = ({ label, bg, disabled, onPress }: Props) => {
  return (
    <View style={styles.wrapper}>
        {!disabled && (
            <View style={[styles.shadow, { backgroundColor: COLORS.border }]} />
        )}
        <TouchableOpacity
            style={[
                styles.btn,
                {
                    backgroundColor: bg,
                    borderColor: disabled ? COLORS.lightGray : COLORS.border,
                },
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.85}
        >
            <Text style={[styles.label, disabled && { color: COLORS.gray }]}>
                {label}
            </Text>
        </TouchableOpacity>
    </View>
  )
}

export default BorderlessNeoButton

const styles = StyleSheet.create({
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
		alignItems: 'center',
		justifyContent: 'center',
	},
	label: { fontSize: 18, fontWeight: '700', color: COLORS.white },
})
