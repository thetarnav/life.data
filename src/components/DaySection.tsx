import { DayData } from '@/logic/api'
import { dateToString, getDateByIndex } from '@/logic/time'
import { useAppStore } from '@/store/app'
import { activities } from '@/store/variables'
import createEventListener from '@/utils/solid/event-listener-rewrite'
createEventListener

const DaySection: Component<{
	index: number
	data?: DayData
}> = props => {
	const date = getDateByIndex(props.index)

	const handleClick = (e: MouseEvent) => {
		// console.log(e.x)
	}

	return (
		<section class="day-section relative grid">
			<p class="absolute z-10 write-vertical-right text-red-500">
				{props.index} — {dateToString(date)}
			</p>
			<Show when={props.data}>
				{data => (
					<For each={activities}>
						{activity => (
							<div
								class={
									activity +
									' cell w-16 h-16 center-child text-gray-500 border-r border-b border-gray-700 hover:bg-orange-400'
								}
								style={{
									animation: 'fade 300ms both',
								}}
								use:createEventListener={['click', handleClick]}
							>
								<Switch>
									<Match when={data.activities[activity] === 0.5}>
										<div class="w-1.5 h-1.5"></div>
									</Match>
									<Match when={data.activities[activity] === 1}>
										<div class="w-3 h-3"></div>
									</Match>
									<Match when={data.activities[activity] === 2}>
										<div class="w-4 h-4"></div>
									</Match>
									<Match when={data.activities[activity] === 3}>
										<div class="w-5 h-5"></div>
									</Match>
								</Switch>
							</div>
						)}
					</For>
				)}
			</Show>
		</section>
	)
}

export default DaySection
