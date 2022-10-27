const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const meteorExternals = require('webpack-meteor-externals');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
require('dotenv').config({path: './client/.env'});

const isProd = process.env.NODE_ENV === 'production';

// Хак, не работает на samsung tv tizen 3.0 без него
const pathToMeteorClient = './client/meteor-client.js';
const meteorClientContent = fs.readFileSync(pathToMeteorClient).toString();
const findToPlaceAfter = 'if (useGetOwnPropDesc) {';
const findToPlaceAfterPosition = meteorClientContent.indexOf(findToPlaceAfter);
const posToInsert = findToPlaceAfterPosition + findToPlaceAfter.length;
const fixCode = 'if (key === \'frameElement\') {return;}';

if (findToPlaceAfterPosition > 0) {
	// Проверяем наличие фикса (применен или нет)
	if (meteorClientContent.indexOf(fixCode) === -1) {
		const fixedMeteorClient = meteorClientContent.substring(0, posToInsert) +
			'\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t' +
			fixCode +
			meteorClientContent.substring(posToInsert);

		fs.writeFileSync(pathToMeteorClient, fixedMeteorClient);
	}
}
else {
	throw Error('Не найдена позиция для применения фикса для TV');
}


const clientConfig = {
	mode: isProd ? 'production' : 'development',
	devtool: isProd ? 'source-map' : 'eval',
	entry: {
		editor: ['./client/entrypoints/editor.tsx'],
		slideshow: ['./client/entrypoints/slideshow.tsx'],
	},
	output: {
		filename: isProd ? '[name].[hash:5].bundle.js': '[name].bundle.js',
		chunkFilename: isProd ? '[name].[chunkhash:5].chunk.js' : '[name].chunk.js',
		publicPath: '/',
		path: path.resolve('./build/client'),
	},
	module: {
		rules: [
			!isProd && {
				test: /\.(ts|js)x?$/,
				enforce: 'pre',
				loader: 'prettier-loader',
				exclude: [/node_modules/, /\.meteor/, /server/],
			},
			{
				oneOf: [
					{
						test: /\.[tj]sx?$/,
						exclude: [/\.meteor/, /server/],
						include: [/node_modules/, /client/, /shared/],
						use: {
							loader: 'babel-loader',
							options: {
								cacheDirectory: true,
								babelrc: false,
								presets: [
									['@babel/preset-env', {useBuiltIns: false}],
									'@babel/preset-typescript',
									'@babel/preset-react',
								],
								plugins: [
									['@babel/plugin-proposal-decorators', { legacy: true }],
									['@babel/plugin-proposal-class-properties', { loose: true }],
									'@babel/plugin-syntax-dynamic-import',
									'react-hot-loader/babel',
								],
							},
						},
					},
					{
						test: /\.pcss$/,
						use: [
							{
								loader: require.resolve('style-loader'),
								options: {hmr: false},
							},
							{
								loader: require.resolve('css-loader'),
								options: {
									modules: true,
									localIdentName: '[local]--[hash:base64:5]'
								},
							},
							{
								loader: require.resolve('postcss-loader'),
								options: {
									// Necessary for external CSS imports to work
									// https://github.com/facebookincubator/create-react-app/issues/2677
									ident: 'postcss',
									plugins: () => [
										require('postcss-nested'),
										require('lost'),
										require('postcss-simple-vars'),
										require('postcss-flexbugs-fixes'),
										require('postcss-preset-env')({
											stage: 2,
											features: {
												'custom-media-queries': true,
											},
										}),
									],
								},
							},
						],
					},
					{
						test: /\.scss$/,
						use: [
							{
								loader: require.resolve('style-loader'),
								options: {hmr: false},
							},
							{
								loader: require.resolve('css-loader'),
								options: {
									importLoaders: 1,
									url: false,
								},
							},
							{
								loader: require.resolve('postcss-loader'),
								options: {
									// Necessary for external CSS imports to work
									// https://github.com/facebookincubator/create-react-app/issues/2677
									ident: 'postcss',
									plugins: () => [
										require('postcss-nested'),
										require('lost'),
										require('postcss-flexbugs-fixes'),
										require('postcss-preset-env')({
											stage: 2,
											features: {
												'custom-media-queries': true,
											},
										}),
									],
								},
							},
						],
					},
					{
						test: /\.css$/,
						use: ['style-loader', 'css-loader'],
					},
					{
						test: /\.(png|svg|jpe?g|gif)$/,
						include: /images/,
						use: [
							{
								loader: 'file-loader',
								options: {
									name: '[name].[ext]',
									outputPath: 'images/',
									publicPath: 'images/'
								}
							}
						]
					},
				],
			},
		].filter(Boolean),
	},
	plugins: [
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new HtmlWebpackPlugin({
			template: './client/entrypoints/editor.html',
			chunks: ['editor'],
			BRANCH: process.env.BRANCH,
		}),
		new HtmlWebpackPlugin({
			filename: 'slideshow.html',
			template: './client/entrypoints/slideshow.html',
			chunks: ['slideshow'],
			BRANCH: process.env.BRANCH,
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				BRANCH: JSON.stringify(process.env.BRANCH),
				YANDEX_GEOCODER_API_KEY: JSON.stringify(process.env.YANDEX_GEOCODER_API_KEY),
				CITYGUIDE_ACCESS_KEY: JSON.stringify(process.env.CITYGUIDE_ACCESS_KEY),
				VK_APP_ID: JSON.stringify(process.env.VK_APP_ID),
				GOOGLE_CLIENT_ID: JSON.stringify(process.env.GOOGLE_CLIENT_ID),
				GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY),
				FACEBOOK_APP_ID: JSON.stringify(process.env.FACEBOOK_APP_ID),
				TWITTER_CONSUMER_KEY: JSON.stringify(process.env.TWITTER_CONSUMER_KEY),
				VIMEO_API_URL: JSON.stringify(process.env.VIMEO_API_URL),
				VIMEO_USER_ID: JSON.stringify(process.env.VIMEO_USER_ID),
				VIMEO_ACCESS_TOKEN: JSON.stringify(process.env.VIMEO_ACCESS_TOKEN),
			},
		}),
		// new BundleAnalyzerPlugin(),
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.pcss'],
		alias: {
			shared: path.join(__dirname, './shared'),
			client: path.join(__dirname, './client'),
		},
	},
	externals: [meteorExternals()],
	devServer: {
		hot: true,
		clientLogLevel: 'none',
		compress: true,
		historyApiFallback: true,
		watchContentBase: true,
		publicPath: '/',
		host: '0.0.0.0',
		port: 3007,
		watchOptions: {
			watch: true,
			aggregateTimeout: 500,
			ignored: ['node_modules', 'server'],
		},
		before: function(app) {
			// Редирект на страницу слайдшоу
			app.get(/^\/(stream\/)?\d+$/, function(req, res, next) {
				req.url = '/slideshow.html';
				next();
			});
		},
	},
};

module.exports = clientConfig;
