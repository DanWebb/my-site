const metalsmith = require('metalsmith');
const postcss = require('metalsmith-with-postcss');

const postcssConfig = {
  plugins: {
    'postcss-preset-env': {
      features: {
        'nesting-rules': true
      }
    }
  }
};

metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .clean(true) // Empty the build folder
  .use(postcss(postcssConfig))
  .build(err => err && console.log(err));