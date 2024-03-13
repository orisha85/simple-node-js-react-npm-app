const port = process.env.PORT || 3008;
const path = require('path');

module.exports = {
  entry: './src/App.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
		options: {
			presets: ['@babel/preset-env', "@babel/preset-react"]
        }
      }
    ]
  }
};
