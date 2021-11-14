import { useAppStore } from '@/store/app'
import { activities, cellHeight } from '@/store/variables'

const Aside: Component = () => {
	// const { state } = useAppStore()

	return (
		<aside class="z-50 w-48 h-full fixed left-0 flex flex-col bg-dark-900 bg-opacity-40 backdrop-filter backdrop-blur-lg">
			<div class="my-auto border-b border-t border-dark-100">
				<For each={activities}>
					{activity => (
						<div
							class={
								activity +
								' activity-category pl-6 flex items-center space-x-6 border-b border-r border-dark-100 last:border-b-0'
							}
							style={{ height: cellHeight + 'px' }}
						>
							<div class="w-6 h-6 rounded-full"></div>
							<p>{activity}</p>
						</div>
					)}
				</For>
			</div>
		</aside>
	)
}

export default Aside
