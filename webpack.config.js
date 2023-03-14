const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//const CompressionPlugin = require('compression-webpack-plugin');

// Node Modules
const path = require('path');

// Configurations
const envconfig = (env) => require(`./env-config/webpack.${env}`)(env);
const modulePresets = require('./env-config/modulePresets');

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) => {
    return webpackMerge(
        {
            mode,
            performance: {
                hints: false,
                maxEntrypointSize: 512000,
                maxAssetSize: 512000,
            },
            output: {
                path: path.resolve(process.cwd(), 'build'),
                filename: 'assets/js/bundle.js',
            },

            resolve: {
                extensions: ['.scss', '.mjs', '.js', '.json', '.jsx'],
            },

            module: {
                rules: [
                    {
                        test: /\.jsx|js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                    },

                    {
                        test: /\.s[ac]ss$/i,
                        use: [
                            'style-loader',
                            {
                                loader: MiniCssExtractPlugin.loader,
                                options: {
                                    //publicPath: 'css',
                                },
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    url: true,
                                },
                            },
                            {
                                loader: 'postcss-sass-loader',
                                options: {
                                    config: {
                                        path: path.resolve(
                                            process.cwd(),
                                            'postcss.config'
                                        ),
                                    },
                                },
                            },
                            {
                                loader: 'sass-loader',
                            },
                        ],
                    },
                    {
                        test: /\.html$/,
                        use: [
                            {
                                loader: 'html-loader',
                            },
                        ],
                    },

                    {
                        test: /\.(png|jpe?g|gif|svg|ico)$/i,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[contenthash].[ext]',
                                    outputPath: 'assets/images',
                                    //      limit: 8196,
                                },
                            },
                        ],
                    },
                    {
                        test: /\.(mov|mp4|MOV|m4v)$/i,
                        use: 'file-loader?name=videos/[name].[ext]',
                    },
                    {
                        test: /\.hbs$/,
                        use: [
                            {
                                loader: 'handlebars-loader',
                            },
                        ],
                    },

                    { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
                ],
            },
            plugins: [
                new webpack.ProgressPlugin(),
                new CleanWebpackPlugin({
                    verbose: true,
                }),
                new OptimizeCSSAssetsPlugin({
                    assetNameRegExp: /\.optimize\.css$/g,
                    cssProcessor: require('cssnano'),
                    cssProcessorOptions: {
                        discardComments: { removeAll: true },
                    },
                    canPrint: true,
                }),
                new HtmlWebpackPlugin({
                    meta: {
                        viewport:
                            'width=device-width, initial-scale=1, shrink-to-fit=no',
                    },
                    title: 'Home',
                    inject: true,
                    filename: 'index.html',
                    template: './src/index.hbs',
                }),
                new MiniCssExtractPlugin({
                    filename: 'assets/css/bundle.min.css',
                    chunkFilename: '[id].css',
                }),
            ],
        },

        envconfig(mode),
        modulePresets({ mode, presets })
    );
};
