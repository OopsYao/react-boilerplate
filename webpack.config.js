const path = require('path')
const relative = (p) => path.resolve(__dirname, p)

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // Extract css file
const TerserJSPlugin = require('terser-webpack-plugin') // Minify js file
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin') // Minify css file
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = (env, options) => {
  const onProduction = options.mode === 'production'
  // Mute some verbose info. Apply this to `stat` and `devServer` field
  // See https://webpack.js.org/configuration/stats/
  const stats = {
    modules: false,
    children: false,
  }
  return {
    entry: relative('./src/index.js'),
    mode: 'development',
    devtool: !onProduction && 'eval-source-map',
    stats,
    devServer: {
      // https://webpack.js.org/configuration/dev-server/
      open: true,
      hot: true,
      stats,
    },
    optimization: {
      // See https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production
      minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
          exclude: /node_modules/,
          use: ['babel-loader', 'eslint-loader'],
        },
        {
          test: /\.css$/,
          use: [
            {
              // See https://github.com/webpack-contrib/mini-css-extract-plugin#advanced-configuration-example
              loader: MiniCssExtractPlugin.loader,
              options: {
                // only enable hot in development
                hmr: !onProduction,
              },
            },
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader',
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        hash: true,
        title: 'React Boilerplate',
        template: relative('./src/index.html'),
      }),
      new MiniCssExtractPlugin(),
      new CleanWebpackPlugin(),
      new FaviconsWebpackPlugin(relative('./src/logo.svg')),
    ],
  }
}
