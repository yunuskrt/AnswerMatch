import { COLORS } from '@/utils/constants'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
    label: string
    color: string
}
const Tag = ({ label, color }: Props) => {
  return (
    <View
        style={[
            styles.tag,
            { backgroundColor: color + '33', borderColor: color },
        ]}
    >
        <Text style={styles.text}>{label}</Text>
    </View>
  )
}

export default Tag

const styles = StyleSheet.create({
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    text: { fontSize: 13, color: COLORS.fg },
})