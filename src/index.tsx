import { render } from 'solid-js/web'
import { AppStoreProvider } from './store/app'

import 'virtual:windi.css'
import './index.scss'
import App from './App'

render(
	() => (
		<AppStoreProvider>
			<App />
		</AppStoreProvider>
	),
	document.getElementById('root') as HTMLElement,
)
