const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    devServer: {
        contentBase: path.resolve(__dirname, './src'),
        historyApiFallback: true
    },
    entry: {
        popup: path.resolve(__dirname, "./src/index-popup.js"),
        options: path.resolve(__dirname, "./src/index-options.js"),
        foreground: path.resolve(__dirname, "./src/index-foreground.js")
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        // publicPath: '/dist'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                                {
                                    'plugins': ['@babel/plugin-proposal-class-properties']
                                }
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                  // Creates `style` nodes from JS strings
                  "style-loader",
                  // Translates CSS into CommonJS
                  "css-loader",
                  // Compiles Sass to CSS
                  "sass-loader",
                ],
              },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'popup.html',
            template: 'src/popup.html',
            chunks: ['popup']
        }),
        new HtmlWebpackPlugin({
            filename: 'options.html',
            template: 'src/options.html',
            chunks: ['options']
        }),
        new HtmlWebpackPlugin({
            filename: 'foreground.html',
            template: 'src/foreground.html',
            chunks: ['foreground']
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/manifest.json', to: '[name].[ext]' },
                { from: 'src/background.js', to: '[name].[ext]' },
                { from: 'src/inject_script.js', to: '[name].[ext]' },
                { from: 'src/icons/*.png', to: 'icons/[name].[ext]' }
            ]
        }),
        new CleanWebpackPlugin()
    ]
}