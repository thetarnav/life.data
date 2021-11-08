import { render } from 'solid-js/web'
import { AppStoreProvider } from './store/app'
import App from './App'

import 'virtual:windi.css'
import './index.scss'

render(
	() => (
		<AppStoreProvider>
			<App />
		</AppStoreProvider>
	),
	document.getElementById('root') as HTMLElement,
)
