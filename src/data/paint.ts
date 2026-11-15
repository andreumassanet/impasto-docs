// ╭──────────────────────────────────────────────────────────────────────────╮
// │                                                                          │
// │   P A I N T                                                              │
// │   the wallpapers and the nine palettes · read from the repository        │
// │                                                                          │
// │   github.com/andreumassanet/impasto-docs                                 │
// │                                                                          │
// ╰──────────────────────────────────────────────────────────────────────────╯

// Everything here comes from src/snapshot and src/assets/wallpapers, which
// scripts/refresh.py copies out of impasto: each wallpaper's palette as the
// shell makes it, and the fixed palettes parsed out of Palettes.qml, so the
// site cannot list one the shell does not have.

import { getImage } from 'astro:assets';
import walls from '../snapshot/wallpapers.json';
import palettesQml from '../snapshot/Palettes.qml?raw';

export type Palette = Record<string, string>;

export interface Wallpaper {
	id: string;
	name: string;
	palette: Palette;
	thumb: string;
	medium: string;
	large: string;
}

interface Variant {
	name: string;
	badge: string;
	swatches: string[];
	colors: Palette;
}

// The dark variant, with the light one beside it: Palettes.qml pairs them.
export interface FixedPalette extends Variant {
	id: string;
	light?: Variant;
}

export const DEFAULT_WALLPAPER = 'pagoda-fuji-blossom';

const images = import.meta.glob<{ default: ImageMetadata }>(
	'../assets/wallpapers/*.webp',
	{ eager: true },
);

// The `list` array in Palettes.qml is a JavaScript literal already. An entry
// is `{ id, dark, light }`; one from before the pairing is flat.
function parsePalettes(source: string): FixedPalette[] {
	const start = source.indexOf('[', source.indexOf('property var list'));
	let depth = 0;
	for (let i = start; i < source.length; i++) {
		if (source[i] === '[') depth++;
		else if (source[i] === ']' && --depth === 0) {
			const list = new Function(`return ${source.slice(start, i + 1)}`)();
			return list.map((entry: { id: string; dark?: Variant; light?: Variant } & Partial<Variant>) =>
				entry.dark ? { id: entry.id, ...entry.dark, light: entry.light } : (entry as FixedPalette));
		}
	}
	throw new Error('Palettes.qml: no `list` array');
}

let cache: Promise<{ wallpapers: Wallpaper[]; palettes: FixedPalette[] }> | undefined;

export function loadPaint() {
	cache ??= (async () => {
		const wallpapers = await Promise.all(
			walls.map(async (wall) => {
				const image = images[`../assets/wallpapers/${wall.file}`];
				if (!image) throw new Error(`wallpapers.json names ${wall.file}, which is not in src/assets/wallpapers`);
				const src = image.default;
				const [thumb, medium, large] = await Promise.all([
					getImage({ src, width: 240, format: 'webp', quality: 70 }),
					getImage({ src, width: 1600, format: 'webp', quality: 74 }),
					getImage({ src, width: 1920, format: 'webp', quality: 74 }),
				]);
				return { id: wall.id, name: wall.name, palette: wall.palette, thumb: thumb.src, medium: medium.src, large: large.src };
			}),
		);
		return { wallpapers, palettes: parsePalettes(palettesQml) };
	})();
	return cache;
}
