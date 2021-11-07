import { dateToString, getDateByIndex } from '@/logic/time'
import { useAppStore } from '@/store/app'
import { activities } from '@/store/variables'
import { random } from 'lodash'

const DaySection: Component<{
	index: number
}> = props => {
	const { daysOpacity } = useAppStore()
	const date = getDateByIndex(props.index)

	const [showDots, setShowdots] = createSignal(false)
	setTimeout(() => setShowdots(true), 500)

	return (
		<section
			class="relative grid border-r border-orange-400 "
			style={{
				opacity: daysOpacity(),
				'grid-template-rows': `repeat(${activities.length}, minmax(0, 1fr))`,
			}}
		>
			<p class="absolute write-vertical-right text-red-500">
				{props.index} — {dateToString(date)}
			</p>
			<For each={activities}>
				{activity => (
					<Show when={showDots() && daysOpacity() > 0.9}>
						<div
							class="center-child text-gray-500"
							style={{
								animation: 'fade 300ms both',
							}}
						>
							<div class="w-5 h-5 bg-gray-800 rounded-full"></div>
						</div>
					</Show>
				)}
			</For>
		</section>
	)
}

export default DaySection
