const HtmlWebpackPlugin = require('html-webpack-plugin')

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
            'style-loader',
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
    ],
  }
}
