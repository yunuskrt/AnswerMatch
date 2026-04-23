import { COLORS } from '@/utils/constants'
import { StyleSheet } from 'react-native'

export const globalStyles = StyleSheet.create({
	safe: { flex: 1, backgroundColor: COLORS.bg },
	scroll: {
		flexGrow: 1,
		paddingHorizontal: 24,
		paddingTop: 12,
		paddingBottom: 40,
		gap: 16,
	},
	title: { fontSize: 26, fontWeight: '700', color: COLORS.fg },
	subtitle: { fontSize: 14, color: COLORS.gray },
})
