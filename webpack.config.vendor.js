const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const merge = require('webpack-merge');

module.exports = (env) => {
	const extractCSS = new ExtractTextPlugin('vendor.css');
	const isDevBuild = !(env && env.prod);

	const sharedConfig = {
		stats: { modules: false },
		resolve: {
			extensions: ['.js']
		},
		module: {
			rules: [
				{ test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' },
				{ test: /\.css(\?|$)/, use: extractCSS.extract(['css-loader']) }
			]
		},
		entry: {
			vendor: [
				//'bootstrap',
				//'bootstrap/dist/css/bootstrap.css',
				'mdbootstrap',
				'mdbootstrap/css/bootstrap.min.css',
				'mdbootstrap/css/mdb.min.css',
				'mdbootstrap/css/style.min.css',
				'event-source-polyfill',
				'vue',
				'vuex',
				'axios',
				'vue-router',
				'jquery'
			],
		},
		output: {
			publicPath: 'dist/',
			filename: '[name].js',
			library: '[name]_[hash]',
		},
		plugins: [
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery'
			}),
			new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, require.resolve('node-noop')),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
			})
		]
	};

	const clientBundleConfig = merge(sharedConfig, {
		output: {
			path: path.join(__dirname, 'wwwroot', 'dist')
		},
		module: {
			rules: [
				{
					test: /\.css(\?|$)/,
					use: extractCSS.extract({
						use: isDevBuild ? 'css-loader' : 'css-loader?minimize'
					})
				},
				{
					test: /\s(c|a)ss$/,
					use: extractCSS.extract({
						use: [{
							loader: isDevBuild ? 'css-loader' : 'css-loader?minimize'
						}, {
							loader: 'sass-loader'
						}]
					})
				}
			]
		},
		plugins: [
			extractCSS,
			new webpack.DllPlugin({
				path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
				name: '[name]_[hash]'
			})
		].concat(isDevBuild ? [

		] : [
			new webpack.optimize.UglifyJsPlugin()
		])
	});

	const serverBundleConfig = merge(sharedConfig, {
		target: 'node',
		resolve: { mainFields: ['main'] },
		output: {
			path: path.join(__dirname, 'ClientApp', 'dist'),
			libraryTarget: 'commonjs2'
		},
		module: {
			rules: [{
				test: /\.css(\?|$)/, use: isDevBuild ? 'css-loader' : 'css-loader?minimize'
			}]
		},
		entry: { vendor: ['aspnet-prerendering', 'vue-server-renderer'] },
		plugins: [
			new webpack.DllPlugin({
				path: path.join(__dirname, 'ClientApp', 'dist', '[name]-manifest.json'),
				name: '[name]_[hash]'
			})
		]
	});

	return [clientBundleConfig, serverBundleConfig];
};
