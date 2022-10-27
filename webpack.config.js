const webpack = require('webpack');
const path = require('path');
const meteorExternals = require('webpack-meteor-externals');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const alias = {
	shared: path.join(__dirname, 'shared'),
	client: path.join(__dirname, 'client'),
	server: path.join(__dirname, 'server'),
};


//// Client config

const clientConfig = {
	devtool: 'eval',
	entry: './client/empty.js',
	output: {
		publicPath: '/',
	},
};


//// Server config

const serverPlugins = [];

let tsServerConfig = {
	loader: 'babel-loader',
	options: {
		cacheDirectory: true,
		babelrc: false,
		presets: [
			'@babel/preset-env',
			'@babel/preset-typescript',
		],
	},
};

const serverRules = [
	{
		test: /\.[tj]s$/,
		exclude: [/node_modules/, /\.meteor/, /client/],
		use: tsServerConfig,
	},
];

if (isProd) {
	// tsServerConfig = {
	// 	loader: 'ts-loader',
	// 	options: {configFile: path.resolve(__dirname, './server/tsconfig.json')},
	// };
}
else {
	serverRules.unshift({
		test: /\.(ts|js)$/,
		enforce: 'pre',
		loader: 'prettier-loader',
		exclude: [/node_modules/, /\.meteor/, /client/, /shared/],
	});
}

const serverConfig = {
	entry: './server/main.ts',
	target: 'node',
	module: {
		rules: serverRules,
	},
	resolve: {
		extensions: ['.ts', '.js'],
		alias,
	},
	plugins: serverPlugins,
	externals: [meteorExternals(), nodeExternals()],
	// devServer: {
	// 	hot: true,
	// },
};

module.exports = [clientConfig, serverConfig];
