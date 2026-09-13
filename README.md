# impasto-docs

The documentation site for [impasto](https://github.com/andreumassanet/impasto),
published at **https://andreumassanet.github.io/impasto-docs/**.

Astro and Starlight, built and deployed by GitHub Actions on every push to
`main`.

## Working on it

```bash
npm ci
npm run dev        # http://localhost:4321/impasto-docs/
npm run build      # checks every internal link
```

Pages are in `src/content/docs/`, one `.mdx` file each; the front page is
`src/pages/index.astro`.

## Following impasto

What the site shows of impasto itself — the README's pictures, the forty
wallpapers and their palettes, the keybindings, the package lists and the
nine palettes — is a snapshot in `src/snapshot/` and `src/assets/`, taken
from a clone of impasto:

```bash
python3 scripts/refresh.py ~/impasto
```

Run it when impasto releases a version, and commit what changed. The version
the snapshot came from is in `src/snapshot/version.txt` and on the front
page's footer.

## License

[GNU GPL-3.0](LICENSE), like impasto.
