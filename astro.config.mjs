// ╭──────────────────────────────────────────────────────────────────────────╮
// │                                                                          │
// │   A S T R O . C O N F I G                                                │
// │   the documentation site · Starlight, served from GitHub Pages           │
// │                                                                          │
// │   github.com/andreumassanet/impasto-docs                                 │
// │                                                                          │
// ╰──────────────────────────────────────────────────────────────────────────╯

import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import { unified } from '@astrojs/markdown-remark';
import remarkBase from './src/plugins/remark-base.mjs';
import { paintRoot, restore } from './src/lib/restore.mjs';

const site = 'https://andreumassanet.github.io';
const base = '/impasto-docs';
const repository = 'https://github.com/andreumassanet/impasto';

export default defineConfig({
	site,
	base,
	trailingSlash: 'always',
	markdown: { processor: unified({ remarkPlugins: [[remarkBase, { base }]] }) },
	integrations: [
		starlight({
			title: 'impasto',
			description: 'A Hyprland shell whose colours come from a painting — the island, the desk under the windows, and every program around it.',
			logo: { src: './src/assets/mark.png', alt: '' },
			favicon: '/favicon.png',
			social: [{ icon: 'github', label: 'GitHub', href: repository }],
			editLink: { baseUrl: 'https://github.com/andreumassanet/impasto-docs/edit/main/' },
			lastUpdated: true,
			customCss: [
				'@fontsource-variable/inter',
				'@fontsource-variable/jetbrains-mono',
				'@fontsource/grape-nuts',
				'./src/styles/theme.css',
			],
			components: {
				Header: './src/components/Header.astro',
			},
			head: [
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: `${base}/apple-touch-icon.png` } },
				{ tag: 'meta', attrs: { property: 'og:image', content: `${site}${base}/og.jpg` } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'script', content: `${paintRoot.toString()}\n(${restore.toString()})();` },
			],
			expressiveCode: {
				themes: ['github-dark-default', 'github-light-default'],
				styleOverrides: {
					borderRadius: '0.75rem',
					borderColor: 'var(--im-code-border)',
					codeBackground: 'var(--im-code-bg)',
					codeFontFamily: 'var(--sl-font-mono)',
					uiFontFamily: 'var(--sl-font)',
					frames: {
						editorBackground: 'var(--im-code-bg)',
						terminalBackground: 'var(--im-code-bg)',
						terminalTitlebarBackground: 'var(--im-code-bar)',
						editorTabBarBackground: 'var(--im-code-bar)',
						editorActiveTabBackground: 'var(--im-code-bg)',
						terminalTitlebarBorderBottomColor: 'transparent',
						editorTabBarBorderBottomColor: 'transparent',
						frameBoxShadowCssValue: 'none',
					},
				},
			},
			sidebar: [
				{ label: 'Start here', items: [{ autogenerate: { directory: 'start' } }] },
				{ label: 'The shell', items: [{ autogenerate: { directory: 'shell' } }] },
				{ label: 'Colour', items: [{ autogenerate: { directory: 'theming' } }] },
				{ label: 'Reference', items: [{ autogenerate: { directory: 'reference' } }] },
				{ label: 'Help', items: [{ autogenerate: { directory: 'help' } }] },
			],
			plugins: [starlightLinksValidator()],
		}),
	],
});
