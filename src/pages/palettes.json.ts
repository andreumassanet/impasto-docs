// ╭──────────────────────────────────────────────────────────────────────────╮
// │                                                                          │
// │   P A L E T T E S . J S O N                                              │
// │   every wallpaper and palette · fetched by the picker on first use       │
// │                                                                          │
// │   github.com/andreumassanet/impasto-docs                                 │
// │                                                                          │
// ╰──────────────────────────────────────────────────────────────────────────╯

import { loadPaint } from '~/data/paint';

export async function GET() {
	const { wallpapers, palettes } = await loadPaint();
	const body = {
		wallpapers: Object.fromEntries(wallpapers.map((wall) => [wall.id, wall])),
		palettes: Object.fromEntries(
			palettes.map((palette) => [palette.id, { id: palette.id, name: palette.name, palette: palette.colors }]),
		),
	};
	return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
}
