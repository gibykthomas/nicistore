/**
 * Imports.
 */
let path = require('path');
let webpack = require('webpack');
require('babel-polyfill');

/**
 * Settings
 */
const host = process.env.HOST || '0.0.0.0';
const port = (process.env.PORT + 1) || 3001;
const dist = path.resolve(__dirname, '../static/dist');

console.log(path.resolve('./src'));

/**
 * Development settings.
 */
const config = {
    entry: [
        'babel-polyfill',
        'webpack-dev-server/client?http://' + host + ':' + port,
        'webpack/hot/only-dev-server',
        './src/client.js'
    ],
    output: {
        filename: 'bundle.js',
        chunkFilename: '[name].bundle.js',
        path: dist,
        publicPath: 'http://' + host + ':' + port + '/dist/'
    },
    resolve: {
        root: [
            path.resolve('./src')
        ],
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {test: /\.(jpe?g|png|gif|svg)$/, loader: 'file'},
            {test: /\.(js|jsx)$/, exclude: /(node_modules|bower_components)/, loader: 'babel'},
            {test: /\.scss$/, loaders: ['style', 'css', 'autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true']}
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
                BROWSER: JSON.stringify(true),
                ATLAS_BASE_URL: JSON.stringify(process.env.ATLAS_BASE_URL),
                GOOGLE_ANALYTICS_TRACKING_ID: JSON.stringify(process.env.GOOGLE_ANALYTICS_TRACKING_ID),
                FACEBOOK_PIXEL_ID: JSON.stringify(process.env.FACEBOOK_PIXEL_ID),
                CRISP_WEBSITE_ID: JSON.stringify(process.env.CRISP_WEBSITE_ID),
                MAILCHIMP_SIGNUP_FORM_POST_URL: JSON.stringify(process.env.MAILCHIMP_SIGNUP_FORM_POST_URL),
                SWITCH_PUBLIC_KEY: JSON.stringify(process.env.SWITCH_PUBLIC_KEY)
            }
        }),
        // Protects against multiple React installs when npm linking
        new webpack.NormalModuleReplacementPlugin(/^react?$/, require.resolve('react')),
        // new webpack.NormalModuleReplacementPlugin(/^react(\/addons)?$/, require.resolve('react/addons'))
    ]
};

/**
 * Export.
 */
export {host, port, config};
