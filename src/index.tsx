import { render } from 'solid-js/web'
// import { enableScheduling } from 'solid-js'
import { AppStoreProvider } from './store/app'
import App from './App'

import 'virtual:windi.css'
import './index.scss'

// for startTransition() - concurrent mode, happening "off main thread"
// enableScheduling()

render(
	() => (
		<AppStoreProvider>
			<App />
		</AppStoreProvider>
	),
	document.getElementById('root') as HTMLElement,
)
