const config = {

    // Tell webpack to use linter (Config should be at .eslintrc)
    useLinter: true,

    // Dev Server Ports for Browser / Electron
    devServerPort: {
        browser: 8080,
        electron: 8080
    },

    // What files/folders do we directly copy when building for Browser / Electron
    filesToCopy: {
        browser: [
            {from: './static', to: './static'},
            {from: './src/server', to: './server'}
        ],

        electron: [
            {from: './electron-app/main.js', to: './main.js'},
            {from: './electron-app/package.json', to: './package.json'},
            {from: './electron-app/package-lock.json', to: './package-lock.json'},
            {from: './electron-app/preload.js', to: './preload.js'}
        ]
    },


    // output paths for keeping everything organized on dist (unless flatten output is set to true...)
    flattenOutput: false,
    outputPaths: {
        styles: './assets/styles',
        scripts: './assets/scripts',
        default: './assets'
    },

    // CSS options:
    useCSSModules: false, // CSS Modules
    extractCSSToFile: true, // Extract CSS and inject into head? (Lets CSS load as early as possible)

    // If dev server receives a match for url, redirect request to:
    // Useful for testing APIs
    proxyOptions: {
        path: '/api/**',
        url: 'http://localhost:3000'
    },

    // Aliases for importing files within Webpack.
    // Append any other alias needed specific to projects.
    aliases: {
        Components: '../src/components',
        Store: '../src/store',
        Routes: '../src/routes',
        Api: '../src/api',
        Assets: '../src/assets',
        Tools: '../src/tools',
        Styles: '../src/styles',
    },

    // For potential debugging or special cases?
    skipMinify: false,
    productionSourceMap: false,
}



module.exports =  config