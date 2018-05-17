const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');

module.exports = (env) => {
	const isDevBuild = !(env && env.prod);

	const sharedConfig = {
		stats: { modules: false },
		resolve: {
			extensions: ['.js']
		},
		module: {
			rules: [
				{ test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' },
				{
					test: /\.s?[ca]ss$/, use: [
						isDevBuild ? 'style-loader' : MiniCssExtractPlugin.loader,
						isDevBuild ? 'css-loader' : 'css-loader?minimize'
					]
				}
			]
		},
		entry: {
			vendor: [
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
		].concat(isDevBuild ? [

		] : [
			
		]),
		optimization: {
			
		}
	};

	const clientBundleConfig = merge(sharedConfig, {
		mode: 'development',
		output: {
			path: path.join(__dirname, 'wwwroot', 'dist')
		},
		module: {
		},
		plugins: [
			new webpack.DllPlugin({
				path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
				name: '[name]_[hash]'
			})
		].concat(isDevBuild ? [

		] : [
			new webpack.optimize.UglifyJsPlugin({
				sourceMap: true
			})
		])
	});

	const serverBundleConfig = merge(sharedConfig, {
		mode: 'production',
		target: 'node',
		resolve: { mainFields: ['main'] },
		output: {
			path: path.join(__dirname, 'ClientApp', 'dist'),
			libraryTarget: 'commonjs2'
		},
		entry: { vendor: ['aspnet-prerendering'] },
		plugins: [
			new webpack.DllPlugin({
				path: path.join(__dirname, 'ClientApp', 'dist', '[name]-manifest.json'),
				name: '[name]_[hash]'
			})
		],
		optimization: {
			minimizer: [
				new UglifyJsPlugin({
					cache: true,
					parallel: true,
					sourceMap: true
				}),
				new OptimizeCSSPlugin({})
			]
		}
	});

	return [clientBundleConfig, serverBundleConfig];
};
