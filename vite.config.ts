import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import WindiCSS from 'vite-plugin-windicss'
const path = require('path')

export default defineConfig({
	plugins: [
		solidPlugin(),
		Icons({ compiler: 'solid' }),
		WindiCSS({
			scan: {
				fileExtensions: ['html', 'js', 'ts', 'jsx', 'tsx'],
			},
		}),
		AutoImport({
			imports: [
				{
					'solid-js': [
						// lifecycle
						'onMount',
						'onCleanup',
						// reactivity
						'createEffect',
						'createSignal',
						'createComputed',
						'createMemo',
						'on',
						'untrack',
						// utils
						'createRoot',
						'splitProps',
						'lazy',
						// components
						'Suspense',
						'For',
						'Show',
						'Switch',
						'Match',
					],
					'solid-js/store': ['createStore', 'produce'],
				},
			],
			resolvers: [
				IconsResolver({
					prefix: 'Icon',
					extension: 'jsx',
					enabledCollections: ['carbon'],
				}),
			],
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	build: {
		target: 'esnext',
		polyfillDynamicImport: false,
	},
})
