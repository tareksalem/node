const path = require("path");
const autoprefixer = require('autoprefixer');

module.exports = {
    entry: ['./frontend/styles/app.scss', './frontend/js/src/app.js'],
    output: {
        path: path.resolve(__dirname, "frontend/dist"),
        filename: 'bundle.js',
        publicPath: "/frontend/dist"
    },
    mode: "production",
    module: {
        rules: [{
                test: /\.scss$/,
                use: [{
                        loader: 'file-loader',
                        options: {
                            name: 'bundle.css',
                        },
                    },
                    { loader: 'extract-loader' },
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer()],
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: ['./node_modules'],
                        },
                    }
                ],
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-object-assign']
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ],
    },
};