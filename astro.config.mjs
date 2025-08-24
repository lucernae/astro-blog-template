import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { remarkReadingTime } from './src/utils/readTime.ts'
import { RemarkMermaidClient } from './src/plugins/mermaid'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

// https://astro.build/config
export default defineConfig({
	site: 'https://astro-blog-template.maulana.id/', // Write here your website url
	vite: {
		assetsInclude: [
			'**/*.fit',
		],
	},
	markdown: {
		remarkPlugins: [remarkReadingTime, RemarkMermaidClient, remarkMath],
		rehypePlugins: [rehypeKatex],
		drafts: true,
		shikiConfig: {
			theme: 'material-theme-palenight',
			wrap: true,
			transformers: []
		}
	},
	integrations: [
		react({
			experimentalReactChildren: true,
		}),
		// starlight({
		//     title: 'astro-blog-template',
		//     plugins: [
		//         starlightDocSearch({
		//             indexName: "Pages",
		//             appId: process.env.GATSBY_ALGOLIA_APP_ID ?? '',
		//             apiKey: process.env.GATSBY_ALGOLIA_WRITE_KEY ?? '',
		//         })
		//     ]
		// }),
		mdx({
			syntaxHighlight: 'shiki',
			shikiConfig: {
				experimentalThemes: {
					light: 'vitesse-light',
					dark: 'material-theme-palenight'
				},
				wrap: true,
				transformers: []
			},
			drafts: true
		}),
		sitemap(),
		tailwind()
	],
	experimental: {
		contentLayer: true,
	},
})
