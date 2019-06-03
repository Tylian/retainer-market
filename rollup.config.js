import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

import cssnano from 'cssnano';

export default {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'iife'
  },
  plugins: [
    postcss({
      extensions: [ '.css' ],
      plugins: [cssnano()]
    }),
    (process.env.BUILD == 'production' && terser())
  ]
}