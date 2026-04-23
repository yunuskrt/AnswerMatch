import { COLORS } from '@/utils/constants'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

type Props = {
	roomId: string
}
const CopyButton = ({ roomId }: Props) => {
	const [copied, setCopied] = useState(false)
	async function handleCopy() {
		await Clipboard.setStringAsync(roomId)
		setCopied(true)
		setTimeout(() => {
			setCopied(false)
		}, 1500)
	}
	return (
		<TouchableOpacity onPress={handleCopy} style={styles.copyBtn}>
			<Ionicons
				name={copied ? 'checkmark' : 'copy-outline'}
				size={20}
				color={copied ? COLORS.green : COLORS.gray}
			/>
		</TouchableOpacity>
	)
}

export default CopyButton

const styles = StyleSheet.create({
	copyBtn: { padding: 4 },
})
