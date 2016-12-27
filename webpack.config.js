const {join} = require('path');
const htmlwebpackplugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: join(__dirname, 'view', 'src', 'index.js'),
        vendor: ['react', 'react-dom']
    },
    output: {
        path: join(__dirname, 'view', 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: ['./node_modules'],
                loader: 'babel-loader',
                options: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    },
    plugins: [new htmlwebpackplugin({
        template: join(__dirname, 'view', 'src', 'index.html'),
        inject: 'body'
    })]
}