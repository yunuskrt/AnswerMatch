import { COLORS } from '@/utils/constants'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    label: string
    bg: string
    onPress: () => void
    dark?: boolean
}
const ToggleNeoButton = ({ label, bg, onPress, dark }: Props) => {
  return (
    <View style={styles.wrapper}>
        <View style={[styles.shadow, { backgroundColor: COLORS.border }]} />
        <TouchableOpacity
            style={[styles.btn, { backgroundColor: bg }]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <Text style={[styles.label, dark && { color: COLORS.fg }]}>
                {label}
            </Text>
        </TouchableOpacity>
    </View>
  )
}

export default ToggleNeoButton

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
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: { fontSize: 18, fontWeight: '700', color: COLORS.white },
})