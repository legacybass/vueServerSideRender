const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const merge = require('webpack-merge');

module.exports = (env) => {
	const isDevBuild = !(env && env.prod);
	const extractCss = new ExtractTextPlugin('site.css');

	const sharedConfig = () => ({
		stats: { modules: false },
		resolve: {
			extensions: ['.js', '.vue'],
			alias: {
				'vue$': 'vue/dist/vue',
				'components': path.resolve(__dirname, './ClientApp/components'),
				'views': path.resolve(__dirname, './ClientApp/views'),
				'utils': path.resolve(__dirname, './ClientApp/utils'),
				'api': path.resolve(__dirname, './ClientApp/store/api')
			}
		},
		output: {
			filename: '[name].js',
			publicPath: 'dist/'
		},
		module: {
			rules: [
				{ test: /\.vue$/, include: /ClientApp/, use: 'vue-loader' },
				//{ test: /\.tsx?$/, include: /ClientApp/, use: 'awesome-typescript-loader?silent=true' },
				{ test: /\.jsx?$/, include: /ClientApp/, use: 'babel-loader' },
				{ test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' },
				{ test: /\.woff2?(\?v=[0-9]\.[0-9])?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
				{ test: /font.*\.(tff|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'file-loader' }
			]
		},
		//plugins: [new CheckerPlugin()]
	});

	const clientBundleOutputDir = './wwwroot/dist';
	const clientBundleConfig = merge(sharedConfig(), {
		entry: { 'main': './ClientApp/boot-app.js' },
		module: {
			rules: [
				{
					test: /\.css$/,
					use: extractCss.extract({
						use: {
							loader: isDevBuild ? 'css-loader' : 'css-loader?minimize',
							options: {
								sourceMap: true
							}
						}
					})
				},
				{
					test: /\.s(c|a)ss$/,
					use: extractCss.extract({
						use: [{
							loader: isDevBuild ? 'css-loader' : 'css-loader?minimize',
							options: {
								sourceMap: true
							}
						}, {
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						}]
					})
				}
			]
		},
		output: {
			path: path.join(__dirname, clientBundleOutputDir)
		},
		plugins: [
			extractCss,
			new webpack.DllReferencePlugin({
				context: __dirname,
				mainfest: require('./wwwroot/dist/vendor-manifest.json')
			}),
			new webpack.SourceMapDevToolPlugin({
				filename: '[file].map',
				moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]')
			})
		].concat(isDevBuild ? [

		] : [
			new webpack.optimize.UglifyJsPlugin({
				sourceMap: true
			})
		])
	});

	const serverBundleConfig = merge(sharedConfig(), {
		resolve: { mainFields: ['main'] },
		entry: {
			'main-server': './ClientApp/boot-server.js'
		},
		plugins: [
			new webpack.DllReferencePlugin({
				context: __dirname,
				manifest: require('./ClientApp/dist/vendor-manifest.json'),
				sourceType: 'commonjs2',
				name: './vendor'
			})
		],
		output: {
			libraryTarget: 'commonjs',
			path: path.join(__dirname, './ClientApp/dist')
		},
		target: 'node',
		devtool: 'inline-source-map'
	});

	return [clientBundleConfig, serverBundleConfig];
};
