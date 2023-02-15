import { transform } from 'esbuild'
import { readFile } from 'fs/promises'
import postcss from 'postcss'
export const CSSMinifyPlugin = (plugins = []) => ({
  name: 'CSSMinifyPlugin',
  setup(build) {
    build.onLoad({ filter: /\.(string|min).css$/ }, async (args) => {
      const f = await readFile(args.path)
      const contentFile = f.toString()
      const result = await postcss(plugins).process(contentFile, { from: args.path })
      const css = await transform(result.css, { loader: 'css', minify: true })
      return { loader: 'text', contents: css.code }
    })
  },
})
