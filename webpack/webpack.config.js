const path = require('path')
const config = require('./settings')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CircularDependencyPlugin = require('circular-dependency-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin');
const webpack = require('webpack')


// ** Webpack HTML Plugin **
const htmlWebPackPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "index.html"
})


// ** Webpack imports resolution - Aliases **
// Configure using : config.aliases 
const aliases = config.aliases
for(let a in aliases) {
    aliases[a] = path.resolve(__dirname, aliases[a])
}


// ** Webpack DevServer proxy settings - Test APIs hosted somewhere else through dev server **
// Configure using : config.proxyOptions
const proxySettings = {}
proxySettings[config.proxyOptions.path] = {
    target: config.proxyOptions.url,
    secure: false,
    changeOrigin: true
}


// ** Webpack CSS Module Configuration **
// Configure using : config.useCSSModules
let cssConfig = {}
if(config.useCSSModules) {
    cssConfig = {
        modules: true,
        sourceMap: true,
        importLoaders: 1,
        localIdentName: '[name]_[local]_[hash:base64]',
        minimize: true
    }
}

// ** Webpack CSS Extract Plugin Settings - Extract CSS into an actual file (Loads CSS as early as possible) **
// Should only be used in production as it is heavy in build time for dev workflow.
const extractCSSPlugin = new MiniCssExtractPlugin({
    filename: (config.flattenOutput) ? `./[chunkhash].css` : `${config.outputPaths.styles}/[chunkhash].css`,
    chunkFilename: '[id].[chunkhash].css',
    publicPath: ''
})


// ** Webpack Copy Plugin Settings - Define what we copy directly to output directory **
// Configure using : config.filesToCopy
let copyConfiguration = config.filesToCopy.browser || [] /* Files to copy when building for browser */

// If we are `building` to the output directory in the Electron context,
// we append to the copyConfiguration
if(process.env.electronBuild) copyConfiguration = copyConfiguration.concat((config.filesToCopy.electron || []))

// Create plugin instance with appropriate arguments
const copyPlugin = new CopyWebpackPlugin(copyConfiguration)


// Work Box - Google offline service worker library
const wbPlugin = new WorkboxPlugin.GenerateSW({
    // these options encourage the ServiceWorkers to get in there fast 
    // and not allow any straggling "old" SWs to hang around
    clientsClaim: true,
    skipWaiting: true,
})


// ** Webpack Plugin Config **
const prodPlugins = []
const devPlugins = []

// Prod Plugins 
prodPlugins.push(copyPlugin)
prodPlugins.push(extractCSSPlugin)
prodPlugins.push(htmlWebPackPlugin)
prodPlugins.push(new webpack.DefinePlugin({
    WEBPACK_DEV: JSON.stringify(false)
}))
prodPlugins.push(new webpack.DefinePlugin({
    VERSION: JSON.stringify(require("../package.json").version)
}))
prodPlugins.push(new webpack.DefinePlugin({
    USE_SERVICE_WORKER: JSON.stringify(config.offlineMode)
}))

if(config.offlineMode) {
    prodPlugins.push(wbPlugin)
}

// Dev Pluggins
devPlugins.push(htmlWebPackPlugin)
devPlugins.push(new CircularDependencyPlugin({
    // exclude detection of files based on a RegExp
    exclude: /a\.js|node_modules/,
    // add errors to webpack instead of warnings
    failOnError: true,
    // allow import cycles that include an asyncronous import,
    // e.g. via import(/* webpackMode: "weak" */ './file.js')
    allowAsyncCycles: false,
    // set the current working directory for displaying module paths
    cwd: process.cwd(),
}))
devPlugins.push(new webpack.DefinePlugin({
    WEBPACK_DEV: JSON.stringify(true)
}))
devPlugins.push(new webpack.DefinePlugin({
    VERSION: JSON.stringify(require("../package.json").version)
}))
devPlugins.push(new webpack.DefinePlugin({
    USE_SERVICE_WORKER: JSON.stringify(false)
}))




// Note: Wrapped in a function so that we can obtain argv.mode to know if we are in dev or production mode
// Removes the need for merging webpack configs for small differences, or pointing to different configs depending on npm command being ran.
module.exports = (env, argv) => {
    let webpackConfig = {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, "../dist"),
            filename: (config.flattenOutput) ? `./bundle.[chunkhash].js` : `${config.outputPaths.scripts}/bundle.[chunkhash].js`,
            publicPath: ''
        },
        module: {
            rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: config.useLinter ? ['babel-loader', 'eslint-loader'] : ['babel-loader']
            },
            {
                test: /\.scss|sass|css$/,
                use: [
                    {
                        loader: (config.extractCSSToFile && argv.mode == 'production') ? MiniCssExtractPlugin.loader : 'style-loader', options: (config.extractCSSToFile && argv.mode == 'production' && !config.flattenOutput) ? { publicPath:'../.' } : {}
                    },
                    {   
                        loader: 'css-loader',
                        query: cssConfig
                    },
                    'resolve-url-loader',
                    'sass-loader?sourceMap'
                ]
            },
            { 
                test: /\.(jpe?g|gif|png|svg|ico|woff|ttf|eot|otf|woff|woff2|wav|avi|ogg|mp3|mp4)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            publicPath: '',
                            name: (config.flattenOutput) ? `./[hash].[ext]` : `${config.outputPaths.default}/[hash].[ext]`
                        }
                    }
                ]
            }
        ]
        },

        optimization: {
            minimize: !config.skipMinify && argv.mode == 'production'
        },
        
        devServer: {
            stats: "minimal",
            proxy: proxySettings,
            port: (process.env.electronBuild) ? config.devServerPort.electron : config.devServerPort.browser,
            public: (process.env.electronBuild) ? 'localhost:' + config.devServerPort.electron : 'localhost:' + config.devServerPort.browser,
            overlay: {
                errors: true,
                warnings: true
            },
        },

        // https://webpack.js.org/configuration/devtool/
        devtool: (argv.mode == 'production') ? config.productionSourceMap ? 'nosources-source-map' : 'none' : 'eval-source-map',

        resolve: {
            extensions: ['*', '.js', '.json'],
            alias: aliases
        },

        plugins: (argv.mode == 'production') ? prodPlugins : devPlugins  
    }
    if(config.useLinter) {
        webpackConfig.module.rules.push({
            enforce: 'pre',
            test: /\.(js)$/,
            loader: 'eslint-loader',
            exclude: /node_modules/
        })
    }
    return webpackConfig
}
