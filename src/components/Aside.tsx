import { useAppStore } from '@/store/app'
import { cellHeight } from '@/store/variables'

const Aside: Component = () => {
	const { state } = useAppStore()

	return (
		<aside class="z-10 w-48 h-full fixed left-0 flex flex-col bg-gray-100 bg-opacity-20 backdrop-filter backdrop-blur">
			<div class="my-auto border-b border-t border-dark-100">
				<For each={state.activities}>
					{activity => (
						<div
							class="border-b border-r border-dark-100 last:border-b-0"
							style={{ height: cellHeight + 'px' }}
						>
							{activity}
						</div>
					)}
				</For>
			</div>
		</aside>
	)
}

export default Aside
