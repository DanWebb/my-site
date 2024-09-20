import Image from '@11ty/eleventy-img';
import { optimize } from 'svgo';

function addAttributes(svgString, attributes) {
	const attributesString = attributes
		.map(({ name, value }) => `${name}="${value}"`)
		.join(' ');

	return svgString.replace('<svg', `<svg ${attributesString}`);
}

/**
 * Get an SVG string from a file using @11ty/eleventy-img and compress it with svgo
 *
 * @param {String} path svg file to load, relative to the root directory
 * @param {Array<{ name, value }>} attributes additional attributes to add to the SVG tag
 */
export default async function renderSvg(path, attributes = []) {
	const metadata = await Image(path, {
		formats: ['svg'],
		dryRun: true, // Don’t write to the file system
	});

	const svgString = addAttributes(metadata.svg[0].buffer.toString(), attributes);

	const result = optimize(svgString, {
		plugins: [
			{
				name: 'preset-default',
				params: {
					overrides: {
						removeViewBox: false,
					},
				},
			},
		],
	});

	return result.data;
}