// ╭──────────────────────────────────────────────────────────────────────────╮
// │                                                                          │
// │   P A I N T                                                              │
// │   the picker · any [data-paint] button repaints every page               │
// │                                                                          │
// │   github.com/andreumassanet/impasto-docs                                 │
// │                                                                          │
// ╰──────────────────────────────────────────────────────────────────────────╯

import { paintRoot } from '../lib/restore.mjs';

const KEY = 'impasto:paint';
const DEFAULT = 'pagoda-fuji-blossom';
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

type Wall = { id: string; name: string; palette: Record<string, string>; thumb: string; medium: string; large: string };
type Data = { wallpapers: Record<string, Wall>; palettes: Record<string, { id: string; name: string; palette: Record<string, string> }> };
type Paint = {
	kind: 'wallpaper' | 'palette';
	id: string;
	name: string;
	palette: Record<string, string>;
	wallpaper?: { id: string; thumb: string; medium: string; large: string };
};

let data: Promise<Data> | undefined;
const load = () => (data ??= fetch(`${base}/palettes.json`).then((response) => response.json()));

function stored(): Paint | null {
	try {
		return JSON.parse(localStorage.getItem(KEY) || 'null');
	} catch {
		return null;
	}
}

function preload(url: string) {
	const image = new Image();
	image.src = url;
	return image.decode().catch(() => undefined);
}

function mark(paint: Paint | null) {
	const current = paint ? `${paint.kind}:${paint.id}` : `wallpaper:${DEFAULT}`;
	for (const button of document.querySelectorAll<HTMLElement>('button[data-paint]')) {
		button.setAttribute('aria-pressed', String(button.dataset.paint === current));
	}
	if (paint) {
		for (const cell of document.querySelectorAll<HTMLElement>('[data-token]')) {
			const value = paint.palette[cell.dataset.token!];
			if (value) cell.textContent = value.toLowerCase();
		}
		for (const name of document.querySelectorAll<HTMLElement>('[data-paint-name]')) name.textContent = paint.name;
	}
}

async function pick(button: HTMLElement) {
	const [kind, id] = button.dataset.paint!.split(':') as [Paint['kind'], string];
	button.setAttribute('aria-busy', 'true');
	const { wallpapers, palettes } = await load();
	const previous = stored();
	const keep = previous?.wallpaper ?? wallpapers[DEFAULT];
	const wallOf = (wall: { id: string; thumb: string; medium: string; large: string }) =>
		({ id: wall.id, thumb: wall.thumb, medium: wall.medium, large: wall.large });

	const paint: Paint =
		kind === 'wallpaper'
			? { kind, id, name: wallpapers[id].name, palette: wallpapers[id].palette, wallpaper: wallOf(wallpapers[id]) }
			: { kind, id, name: palettes[id].name, palette: palettes[id].palette, wallpaper: wallOf(keep) };

	const big = screen.width * (window.devicePixelRatio || 1) > 1800;
	const wall = kind === 'wallpaper' ? (big ? paint.wallpaper!.large : paint.wallpaper!.medium) : null;
	if (wall) await preload(wall);

	// Listeners see the page before it changes: the landing page wipes the
	// old wallpaper away over the new one.
	document.dispatchEvent(new CustomEvent('impasto:paint', { detail: { paint, wall } }));
	paintRoot(paint.palette, wall);
	// Not `data-paint`: that marks the buttons, and the root would match them.
	document.documentElement.dataset.painted = `${kind}:${id}`;
	try {
		localStorage.setItem(KEY, JSON.stringify(paint));
	} catch {}
	button.removeAttribute('aria-busy');
	mark(paint);
}

document.addEventListener('click', (event) => {
	const button = (event.target as Element).closest<HTMLElement>('button[data-paint]');
	if (!button) return;
	event.preventDefault();
	pick(button);
});

mark(stored());
if (document.querySelector('button[data-paint]')) {
	('requestIdleCallback' in window ? requestIdleCallback : setTimeout)(() => load());
}
