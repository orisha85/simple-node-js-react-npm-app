const port = process.env.PORT || 3008;
const path = require('path');

module.exports = {
  entry: './server.js',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'wwwwroot')
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

//Between my yml file, my package.json, and my server.js file