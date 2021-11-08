import { dateToString, getDateByIndex } from '@/logic/time'
import { useAppStore } from '@/store/app'
import { activities } from '@/store/variables'

const DaySection: Component<{
	index: number
	data?: boolean
}> = props => {
	const date = getDateByIndex(props.index)

	return (
		<section class="day-section relative grid">
			<p class="absolute write-vertical-right text-red-500">
				{props.index} — {dateToString(date)}
			</p>
			<Show when={props.data}>
				{/* <Suspense> */}
				<Index each={activities}>
					{activity => (
						<div
							class="w-16 h-16 center-child text-gray-500 border-r border-b border-gray-700"
							style={{
								animation: 'fade 300ms both',
							}}
						>
							<div class="w-5 h-5 bg-gray-800 rounded-full"></div>
						</div>
					)}
				</Index>
				{/* </Suspense> */}
			</Show>
		</section>
	)
}

export default DaySection
