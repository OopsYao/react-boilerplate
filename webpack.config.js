const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (env, options) => {
  const onProduction = options.mode === 'production'
  return {
    entry: './src/index.js',
    mode: 'development',
    devtool: !onProduction && 'eval-source-map',
    devServer: {
      clientLogLevel: 'silent',
      open: true,
      hot: true,
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
        template: './src/index.html',
      }),
      new MiniCssExtractPlugin(),
      new CleanWebpackPlugin(),
    ],
  }
}
