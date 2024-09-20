import browserslist from 'browserslist';
import { transform, browserslistToTargets } from 'lightningcss';
import webc from '@11ty/eleventy-plugin-webc';
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

  eleventyConfig.addJavaScriptFunction('renderSvg', renderSvg);

  eleventyConfig.addPlugin(webc, {
    components: 'src/components/**/*.webc',
    bundlePluginOptions: {
      transforms: [transformCSS],
    },
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