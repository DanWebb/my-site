import path from 'node:path';
import browserslist from 'browserslist';
import { bundle, browserslistToTargets } from 'lightningcss';

async function compileCSS(_inputContent, inputPath) {
  const parsed = path.parse(inputPath);

  if (parsed.name.startsWith('_')) {
    return;
  }

  const targets = browserslistToTargets(browserslist('> 0.25% and not dead'));

  return () => {
    const { code } = bundle({
      filename: inputPath,
      minify: true,
      sourceMap: false,
      targets,
    });
    return code;
  };
}

export default function(eleventyConfig) {
  // copy the assets folder to the output directory
  eleventyConfig.addPassthroughCopy('src/assets');

  // Recognize CSS as a "template language"
  eleventyConfig.addTemplateFormats('css');

  // Process CSS with LightningCSS
  eleventyConfig.addExtension('css', {
    outputFileExtension: 'css',
    compile: compileCSS,
  });

  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
  }
};