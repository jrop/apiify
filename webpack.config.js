var webpack = require('webpack')

module.exports = {
	devtool: 'inline-source-map',
	entry: {
		client: './src/client.js'
	},
	output: {
		path: './build',
		filename: '[name].js',
		chunkFilename: '[id].js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				stage: 1,
				optional: [ 'runtime' ]
			}
		}]
	},
	// plugins: [ new webpack.optimize.UglifyJsPlugin({
	// 	compress: {
	// 		warnings: false
	// 	}
	// }) ]
}