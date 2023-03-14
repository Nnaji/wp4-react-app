const TerserPlugin = require('terser-webpack-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg'); // Webpack Plugins
const ImageminPlugin = require('imagemin-webpack-plugin').default;
module.exports = () => ({
    output: {
        filename: 'assets/js/bundle.min.js',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new ImageminPlugin({
            plugins: [imageminMozjpeg({ quality: 50 })],
        }),
    ],
});
