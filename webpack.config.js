module.exports = {
    entry: {
        'src': "./src/index.loader.js",
        'test': "./test/index.loader.js"
    },
    output: {
        path: __dirname,
        filename: "./[name]/index.js"
    },
    devtool: 'inline-source-map',
    module: {
        preLoaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel?presets[]=es2015'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "jshint-loader"
        }]
    }
};