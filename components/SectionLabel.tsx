import { COLORS } from '@/utils/constants'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
    text: string
}
const SectionLabel = ({ text }: Props) => {
  return (
    <View style={styles.row}>
        <Text style={styles.text}>{text}</Text>
        <View style={styles.line} />
    </View>
  )
}

export default SectionLabel

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    text: {
        fontSize: 12,
        color: COLORS.gray,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.lightGray,
    },
})