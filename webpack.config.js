const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
//const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const merge = require('webpack-merge');

module.exports = (env) => {
	const isDevBuild = !(env && env.prod);

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
				{ test: /font.*\.(tff|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'url-loader?limit=100000' },
				{
					test: /\.s?[ca]ss$/, use: [
						isDevBuild ? 'style-loader' : MiniCssExtractPlugin.loader,
						isDevBuild ? 'css-loader' : 'css-loader?minimize',
						'sass-loader'
					]
				}
			]
		},
		plugins: [
			//new CheckerPlugin(),
			new VueLoaderPlugin()
		]
	});

	const clientBundleOutputDir = './wwwroot/dist';
	const clientBundleConfig = merge(sharedConfig(), {
		mode: 'development',
		entry: { 'main': './ClientApp/boot-app.js' },
		module: {
			rules: [
				
			]
		},
		output: {
			path: path.join(__dirname, clientBundleOutputDir)
		},
		plugins: [
			new webpack.DllReferencePlugin({
				context: __dirname,
				manifest: require('./wwwroot/dist/vendor-manifest.json')
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
		mode: 'production',
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
