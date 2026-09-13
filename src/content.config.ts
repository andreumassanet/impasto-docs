// ╭──────────────────────────────────────────────────────────────────────────╮
// │                                                                          │
// │   C O N T E N T . C O N F I G                                            │
// │   the docs collection · Starlight's loader and schema                    │
// │                                                                          │
// │   github.com/andreumassanet/impasto                                      │
// │                                                                          │
// ╰──────────────────────────────────────────────────────────────────────────╯

import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
