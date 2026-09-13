// ╭──────────────────────────────────────────────────────────────────────────╮
// │                                                                          │
// │   L A N D I N G                                                          │
// │   the front page · the island's clock, the wipe, copying the command     │
// │                                                                          │
// │   github.com/andreumassanet/impasto-docs                                 │
// │                                                                          │
// ╰──────────────────────────────────────────────────────────────────────────╯

const clock = document.querySelector<HTMLTimeElement>('[data-clock]');
const tick = () => {
	if (!clock) return;
	const now = new Date();
	clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
	clock.dateTime = now.toISOString();
};
tick();
setInterval(tick, 10_000);

// The old wallpaper is laid over the new one and wiped off it, the way the
// desk changes wallpaper.
const leaving = document.querySelector<HTMLElement>('.wall-leaving');
const still = matchMedia('(prefers-reduced-motion: reduce)');
document.addEventListener('impasto:paint', (event) => {
	const { wall } = (event as CustomEvent<{ wall: string | null }>).detail;
	if (!wall || !leaving || still.matches) return;
	leaving.getAnimations().forEach((animation) => animation.cancel());
	leaving.style.backgroundImage = getComputedStyle(document.documentElement).getPropertyValue('--im-wall');
	leaving.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 0 100%)' }], {
		duration: 1100,
		easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
		fill: 'forwards',
	});
});

// A vertical wheel scrolls the dock sideways.
const dock = document.querySelector<HTMLElement>('.dock');
dock?.addEventListener(
	'wheel',
	(event) => {
		if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
		dock.scrollLeft += event.deltaY;
		event.preventDefault();
	},
	{ passive: false },
);

document.addEventListener('click', async (event) => {
	const button = (event.target as Element).closest<HTMLButtonElement>('[data-copy]');
	if (!button) return;
	try {
		await navigator.clipboard.writeText(button.dataset.copy!);
		button.dataset.copied = '';
		setTimeout(() => delete button.dataset.copied, 1600);
	} catch {}
});
