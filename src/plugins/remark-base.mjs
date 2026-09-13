// ╭──────────────────────────────────────────────────────────────────────────╮
// │                                                                          │
// │   R E M A R K - B A S E                                                  │
// │   root-relative links in the pages · prefixed with the site's base       │
// │                                                                          │
// │   github.com/andreumassanet/impasto-docs                                 │
// │                                                                          │
// ╰──────────────────────────────────────────────────────────────────────────╯

// Pages link to `/shell/island/`, which reads the same wherever the site is
// served; the base is added here, once, for Markdown links and for `href`
// on components such as LinkCard.

export default function remarkBase({ base }) {
	const prefix = base.replace(/\/$/, '');
	const rebase = (url) =>
		typeof url === 'string' && url.startsWith('/') && !url.startsWith('//') && !url.startsWith(prefix + '/')
			? prefix + url
			: url;

	const walk = (node) => {
		if (node.type === 'link' || node.type === 'definition') node.url = rebase(node.url);
		if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.attributes) {
			for (const attribute of node.attributes) {
				if (attribute.name === 'href') attribute.value = rebase(attribute.value);
			}
		}
		if (node.children) node.children.forEach(walk);
	};

	return (tree) => walk(tree);
}
