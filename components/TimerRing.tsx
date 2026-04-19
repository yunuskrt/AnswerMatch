import { COLORS } from '@/utils/constants'
import { TimerRingProps } from '@/utils/interfaces'
import React from 'react'
import Svg, { Circle, Text as SvgText } from 'react-native-svg'

export default function TimerRing({
	seconds,
	totalSeconds = 30,
	accent = COLORS.accent2,
	size = 72,
}: TimerRingProps) {
	const strokeWidth = 5
	const radius = size / 2 - strokeWidth
	const circumference = 2 * Math.PI * radius
	const pct = Math.max(0, Math.min(1, seconds / totalSeconds))
	const strokeDash = pct * circumference
	const cx = size / 2
	const cy = size / 2

	return (
		<Svg width={size} height={size}>
			{/* Track */}
			<Circle
				cx={cx}
				cy={cy}
				r={radius}
				fill='none'
				stroke={COLORS.lightGray}
				strokeWidth={strokeWidth}
			/>
			{/* Progress */}
			<Circle
				cx={cx}
				cy={cy}
				r={radius}
				fill='none'
				stroke={accent}
				strokeWidth={strokeWidth}
				strokeDasharray={`${strokeDash} ${circumference}`}
				strokeDashoffset={circumference * 0.25}
				strokeLinecap='round'
				rotation={-90}
				originX={cx}
				originY={cy}
			/>
			{/* Label */}
			<SvgText
				x={cx}
				y={cy + 7}
				textAnchor='middle'
				fontSize={size * 0.26}
				fontWeight='700'
				fill={COLORS.fg}
			>
				{seconds}s
			</SvgText>
		</Svg>
	)
}
