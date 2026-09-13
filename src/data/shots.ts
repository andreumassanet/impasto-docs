// ╭──────────────────────────────────────────────────────────────────────────╮
// │                                                                          │
// │   S H O T S                                                              │
// │   every picture a page can name · the README's, and the site's own       │
// │                                                                          │
// │   github.com/andreumassanet/impasto-docs                                 │
// │                                                                          │
// ╰──────────────────────────────────────────────────────────────────────────╯

// A name is a file's name without its extension. The site's own pictures
// win over the README's when both have one, so a better shot can replace
// an old one without the pages changing.

const found = {
	...import.meta.glob<{ default: ImageMetadata }>('../assets/readme/*.{jpg,png,gif}', { eager: true }),
	...import.meta.glob<{ default: ImageMetadata }>('../assets/shots/*.{jpg,png,gif}', { eager: true }),
	...import.meta.glob<{ default: ImageMetadata }>('../assets/site/*.{jpg,png,gif}', { eager: true }),
};

const rank = (path: string) => (path.includes('/assets/site/') ? 0 : path.includes('/assets/shots/') ? 1 : 2);

const byName = new Map<string, { image: ImageMetadata; animated: boolean; rank: number }>();
for (const [path, module] of Object.entries(found)) {
	const match = /\/([^/]+)\.(jpg|png|gif)$/.exec(path)!;
	const entry = { image: module.default, animated: match[2] === 'gif', rank: rank(path) };
	const current = byName.get(match[1]);
	if (!current || entry.rank < current.rank) byName.set(match[1], entry);
}

export function findShot(name: string) {
	const entry = byName.get(name);
	if (!entry) throw new Error(`No picture named "${name}" in src/assets`);
	return entry;
}
