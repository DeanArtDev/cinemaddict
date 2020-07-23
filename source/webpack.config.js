const path = require(`path`);
const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  devtool: isProd ? `` : `source-map`,
  devServer: {
    contentBase: path.join(__dirname, `public`),
    compress: false,
    watchContentBase: true
  },
  plugins: [
    // Оставляем только одну локаль
    new MomentLocalesPlugin({
      localesToKeep: [`es-us`],
    }),
  ],
};
