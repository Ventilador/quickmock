module.exports = {
    entry: {
        'src': "./src/quickmock.js",
        'test': "./test/index.loader.js"
    },
    output: {
        path: __dirname,
        filename: "./[name]/index.js"
    },
    module: {
        preLoaders: [{
            test: /\.js$/, // include .js files
            exclude: /node_modules/, // exclude any and all files in the node_modules folder
            loader: "jshint-loader"
        }]
    }
};