const path = require('path');
const webpack = require('webpack');

const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, '..' ,'client','scripts', 'Core.js'),

    output: {
        path: path.join(__dirname,'public', 'pfc'),
        filename: 'scripts/Core.bundle.js',
        clean: true
    },

    mode :'development',
    devtool :'eval-source-map',

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|gif|svg)/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name : '[name].[ext]',
                            outputPath : 'images'
                        }
                    }
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "../client/index.html",
            filename: "index.html",
            hash: true,
            excludeChunks: ['Core.js','Core','Core.bundle.js','Core.bundle']

        }),
        new HtmlWebpackPlugin({
            template: "../client/pfc.html",
            filename: "pfc.html",
            hash: true
        }),
        new HtmlWebpackPlugin({
            template: "../client/error.html",
            filename: "error.html",
            hash: true,
            excludeChunks: ['Core.js','Core','Core.bundle.js','Core.bundle']


        }),
        new HtmlWebpackPlugin({
            template: "../client/about.html",
            filename: "about.html",
            hash: true,
            excludeChunks: ['Core.js','Core','Core.bundle.js','Core.bundle']

        }),
        new CopyPlugin({
            patterns: [
              {
                from: path.resolve(__dirname, '../client'),
                globOptions: {
                  ignore: ['**/*.js', '**/*.css', '**/*.html'],
                },
                noErrorOnMissing: true,
                to: path.resolve(__dirname, '../server/public/pfc'),
              },
              {
                from: path.resolve(__dirname, '../client/styles'),
                noErrorOnMissing: true,
                to: path.resolve(__dirname, '../server/public/pfc/styles'),
              },
              {
                from: path.resolve(__dirname, '../client/images'),
                noErrorOnMissing: true,
                to: path.resolve(__dirname, '../server/public/pfc/images'),
              },
            ],
          }),
    ],

    // Add the node configuration option to allow the use of __dirname in ES modules
    node: {
        __dirname: true
    }
};
