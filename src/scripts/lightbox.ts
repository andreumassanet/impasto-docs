// ╭──────────────────────────────────────────────────────────────────────────╮
// │                                                                          │
// │   L I G H T B O X                                                        │
// │   any [data-full] opens its picture full size · a click or Esc closes    │
// │                                                                          │
// │   github.com/andreumassanet/impasto-docs                                 │
// │                                                                          │
// ╰──────────────────────────────────────────────────────────────────────────╯

let dialog: HTMLDialogElement | undefined;

function box() {
	if (dialog) return dialog;
	dialog = document.createElement('dialog');
	dialog.className = 'im-lightbox';
	dialog.innerHTML = '<img alt="" /><p></p>';
	dialog.addEventListener('click', () => dialog!.close());
	document.body.append(dialog);
	return dialog;
}

document.addEventListener('click', (event) => {
	const trigger = (event.target as Element).closest<HTMLElement>('[data-full]');
	if (!trigger) return;
	const view = box();
	const image = view.querySelector('img')!;
	image.src = trigger.dataset.full!;
	image.alt = (trigger.getAttribute('aria-label') ?? '').replace(/^Enlarge: /, '');
	view.querySelector('p')!.textContent = trigger.dataset.caption ?? '';
	view.showModal();
});
