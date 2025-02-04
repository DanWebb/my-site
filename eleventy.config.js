import browserslist from 'browserslist';
import { transform, browserslistToTargets } from 'lightningcss';
import webc from '@11ty/eleventy-plugin-webc';
import { eleventyImagePlugin } from '@11ty/eleventy-img';
import markdownIt from 'markdown-it';
import mdLinkAttr from 'markdown-it-link-attributes';
import renderSvg from './lib/renderSvg.js';

async function transformCSS(content) {
  const targets = browserslistToTargets(browserslist('> 0.25% and not dead'));
  const { code } = transform({
    code: Buffer.from(content),
    minify: true,
    sourceMap: false,
    targets,
  });

  return code;
}

export default function(eleventyConfig) {
  // copy the assets folder to the output directory
  eleventyConfig.addPassthroughCopy('src/assets');
  // eleventy wasn't reloading on css and data file changes
  eleventyConfig.addWatchTarget('src/styles/*.css');
  // make the renderSvg function available globally in templates
  eleventyConfig.addJavaScriptFunction('renderSvg', renderSvg);
  // support eleventy-image https://www.11ty.dev/docs/plugins/image
  eleventyConfig.addPlugin(eleventyImagePlugin, {
		formats: ['webp'],
    widths: [800, 1600],
		urlPath: '/assets/photos/',
		defaultAttributes: {
      sizes: '100vw',
			loading: 'lazy',
		},
	});
  // load all components added to the src/components directory
  eleventyConfig.addPlugin(webc, {
    components: [
      'src/components/**/*.webc',
			'npm:@11ty/eleventy-img/*.webc',
		],
    bundlePluginOptions: {
      transforms: [transformCSS],
    },
  });
  // Support markdown templates in webc using <template webc:type="11ty" 11ty:type="md">
	eleventyConfig.setLibrary('md', markdownIt({
		html: true,
		breaks: true,
		linkify: true,
	}));
  eleventyConfig.amendLibrary('md', (md) => {
    md.use(mdLinkAttr, {
      pattern: /^https:/,
      attrs: { target: '_blank', rel: 'noopener' }
    });
  });

  return {
    dir: {
      layouts: 'layouts',
      includes: 'components',
      data: 'data',
      input: 'src',
      output: 'dist'
    }
  }
};