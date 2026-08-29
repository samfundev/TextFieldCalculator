import { readdir, mkdir, rm } from "node:fs/promises";

const OUT = "dist";
const SITE_TITLE = "Text-Field Calculator";

function page(title, content) {
	return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="icon" href="../favicon.ico">
		<title>${title}</title>
		<link rel="stylesheet" href="../pico.min.css">
		<style>
			:root {
				--pico-font-size: 115% !important;
			}

			.container{
				max-width: 80ch !important;
			}
		</style>
	</head>
	<body>
		<header class="container">
			<nav>
				<ul>
					<li><strong>${SITE_TITLE}</strong></li>
				</ul>
				<ul>
					<li><a href="/Calculator-v2.html">Calculator</a></li>
					<li><a href="/Calculator.html">v1</a></li>
					<li><a href="https://github.com/samfundev/TextFieldCalculator">Source</a></li>
				</ul>
			</nav>
		</header>
 		<main class="container">
			${content}
		</main>
	</body>
</html>
`;
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const entrypoints = ["Calculator-v2.html", "Calculator.html", "monaco.worker.js"];

// Markdown pages. documentation.md -> documentation.html, which GitHub Pages
// also serves at the extensionless /documentation.
for (const file of (await readdir(".")).filter(f => f.endsWith(".md"))) {
	const source = await Bun.file(file).text();
	const name = file.replace(/\.md$/, "");

	// Title from the first heading, so /documentation stays "Documentation | ...".
	const heading = source.match(/^#\s+(.+)$/m)?.[1];
	const title = heading ? `${heading} | ${SITE_TITLE}` : SITE_TITLE;

	await Bun.write(`${OUT}/${name}.html`, page(title, Bun.markdown.html(source)));
	entrypoints.push(`${OUT}/${name}.html`);
	console.log(`  ${file} -> ${name}.html`);
}

// Bundle the app
await Bun.build({
	entrypoints,
	outdir: OUT,
	minify: true,
	naming: {
		entry: "[name].[ext]",
		chunk: "[name]-[hash].[ext]",
		asset: "[name]-[hash].[ext]",
	}
});