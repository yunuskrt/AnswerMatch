import { getInitial } from '@/utils/helpers'
import React from 'react'
import Text from '@/components/Text'
import { StyleSheet, View } from 'react-native'

type Props = {
    name: string
	color: string
	size?: number
}
const Avatar = ({ name, color, size = 36 }: Props) => {
  return (
    <View
        style={[
            styles.circle,
            {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderColor: color,
                backgroundColor: color + '33',
            },
        ]}
    >
        <Text style={[styles.initial, { fontSize: size * 0.38, color }]}>
            {getInitial(name)}
        </Text>
    </View>
  )
}

export default Avatar

const styles = StyleSheet.create({
    circle: { borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    initial: { fontWeight: '700' },
})