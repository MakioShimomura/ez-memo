module.exports = {
    configureWebpack: {
        module: {
            rules: [
                { test: /\.(woff|woff2|eot|ttf|cur)$/, loader: 'url-loader?limit=100000' }
            ]
        }
    }
}