const port = process.env.PORT || 3008;
const path = require('path');

module.exports = {
  entry: './cpq/app_data.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer:{
	host:'localhost',
	port:port,
	historyApiFallback:true,
	open:true
	},
  module: {
    loaders: [
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