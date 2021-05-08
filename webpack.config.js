var path = require("path");
var webpack = require('webpack');



module.exports = {
    context: __dirname,
    mode: 'production',
    entry: {
        index: path.resolve(__dirname, 'app.js')
    },

    output: {
        path: path.join(__dirname, '.'),
        filename: "pumpkin.js",
    },
    devtool: "source-map",

    plugins: [],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] }
        ],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    }

};