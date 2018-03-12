const path = require('path')
const webpack = require('webpack')
module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/javascript/index.js')
  },
  devtool: 'inline-source-map',  
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  plugins: [],
	optimization: {
		occurrenceOrder: true
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      }
    ]
  }

}
