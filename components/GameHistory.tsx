import SectionLabel from '@/components/SectionLabel'
import Text from '@/components/Text'
import { COLORS } from '@/utils/constants'
import { GameHistoryEntry } from '@/utils/interfaces'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

type Props = {
    records: GameHistoryEntry[]
}
const GameHistory = ({ records }: Props) => {
  return (
    <View style={styles.section}>
        <SectionLabel text='Recent games' />
        <ScrollView
            style={styles.scroll}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
        >
            {records.map((entry, i) => (
                <View key={i} style={styles.row}>
                    <Text style={styles.room}>Room #{entry.roomId}</Text>
                    <Text
                        style={[
                            styles.rank,
                            entry.placement.includes('1st') && { color: COLORS.accent },
                        ]}
                    >
                        {entry.placement}
                    </Text>
                </View>
            ))}
        </ScrollView>
    </View>
  )
}

export default GameHistory

const styles = StyleSheet.create({
    section: {
		width: '100%',
		gap: 8,
	},
	scroll: {
		maxHeight: 220,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 8,
		paddingHorizontal: 12,
		backgroundColor: COLORS.white,
		borderWidth: 1.5,
		borderColor: COLORS.lightGray,
		borderRadius: 10,
		marginTop: 4,
	},
	room: {
		fontSize: 15,
		color: COLORS.gray,
	},
	rank: {
		fontSize: 15,
		color: COLORS.gray,
		fontWeight: '600',
	},
})