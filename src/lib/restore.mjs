// ╭──────────────────────────────────────────────────────────────────────────╮
// │                                                                          │
// │   R E S T O R E                                                          │
// │   the picked wallpaper's palette onto the page · before the first paint  │
// │                                                                          │
// │   github.com/andreumassanet/impasto-docs                                 │
// │                                                                          │
// ╰──────────────────────────────────────────────────────────────────────────╯

// Both functions are inlined into <head> as source text, so neither may use
// anything outside its own body except `paintRoot`, which the same script
// declares.

export function paintRoot(palette, wall) {
	var map = {
		background: '--p-bg', surface: '--p-surface', surfaceHover: '--p-surface-hover',
		border: '--p-border', text: '--p-text', textMuted: '--p-muted',
		accent: '--p-accent', accentHover: '--p-accent-hover', accentText: '--p-accent-text',
		red: '--p-red', green: '--p-green', yellow: '--p-yellow', blue: '--p-blue',
	};
	var root = document.documentElement;
	for (var key in map) if (palette[key]) root.style.setProperty(map[key], palette[key]);
	var lum = function (hex) {
		var n = parseInt(String(hex).slice(1, 7), 16);
		return 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
	};
	var dark = lum(palette.background) < lum(palette.text);
	root.style.setProperty('--p-ink', dark ? palette.background : palette.text);
	root.style.setProperty('--p-light', dark ? palette.text : palette.background);
	root.dataset.paintTone = dark ? 'dark' : 'light';
	if (wall) root.style.setProperty('--im-wall', 'url("' + wall + '")');
}

export function restore() {
	try {
		var paint = JSON.parse(localStorage.getItem('impasto:paint') || 'null');
		if (!paint || !paint.palette) return;
		var big = screen.width * (window.devicePixelRatio || 1) > 1800;
		var wall = paint.wallpaper ? (big ? paint.wallpaper.large : paint.wallpaper.medium) : null;
		paintRoot(paint.palette, wall);
		document.documentElement.dataset.painted = paint.kind + ':' + paint.id;
	} catch (error) {}
}
