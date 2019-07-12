# Project Template Structure and Details

Last README update: 12th July, 2019 by Nicolas Correa
-----

## Overview
My all purpose project template tailored towards the Vue framework.

It uses Webpack 4
Currently tested on: Windows 10 (Some package.json commands might need to be tweaked at most on Linux and Mac)
Currently working with: VS Code IDE, Vetur extension (For vue), eslint extension (For linter)

This project has my own VS Code settings under .vscode in root, you can just comment this or rename the file out so it doesn't affect your vs code themes.

-----

## Setup and how it works

Before we begin: You can clone the entire project template, on a new folder with a new git history by running the following (You will be prompted for a project name):
If the script doesn't work: you might need to go into *webpack/scripts/clone* and run the command *npm install*
(Note that this should be removed into its own module to lighten the overall complexity of this boilerplate, also it is not necessary: You can just manually copy this folder and delete the .git directory if you cloned this.)

```javascript
// In project root
npm run clone
```

You will need node and npm in your system in order to develop and build
First of all, in order to install dependencies that are not committed to this template but are needed for development and building, run:

```javascript
// The package.json in each of these directories contains the dependencies for each part of the project.

// In project root
npm install

// in /electron-app folder if electron is relevant to this app
npm install

```

To run in development mode:

```javascript
// Will open a browser window using webpack dev server on localhost:8080 (Or a different port based on the settings.js file in /webpack)
npm start

// Same but will not open a new browser window
npm run dev
```

To build in order to deploy somewhere:

```javascript
// Output will be in the /dist folder
npm run build
```

In order to test within electron:

```javascript
// Will open an electron browser window using webpack dev server on localhost:8080 (Or a different port based on the settings.js file in /webpack)
// Can use ctrl+shift+I to open inspector.
npm run electron
```

In order to create an installer:

```javascript
// Creates /dist with the appropriate electron files, and then /installer
// you can move the installer.exe anywhere by itself and that will be enough to install.
// For auto update, create a higher version of the app by changing the app version in the package.json in /electron-app and then move that same installer and the latest.yaml file into whatever URL you have setup in the "build" property within the root package.json
npm run installer
```



-----

## Folder Structure

While folder structure can be created as needed per project and technology, Ex: You might want a components folder within */src* in a react or vue projects.

```text
|-- /src   
|------ index.html  
|------ index.scss  
|------ index.js  
|------ ...  
|-- /electron-app  
|-- /static  
|-- /webpack  
|-- .babelrc  
|-- .eslintrc
|-- .gitignore  
|-- package-lock.json  
|-- package.json  
|-- README.md  
```


-----

### /electron-app

```text
|-- /electron-app  
|------ main.js  
|------ package.json  
|------ package-lock.json  
|------ preload.js  
```

The electron folder contains the main js file to be ran when running the application as an electron app. Unless you need any functionality in particular you shouldn't need to touch this, preload.js loads all the node/electron functionality we need into the global scope of the browser window, it safely exposes node APIs to the browser renderer window.

When building for electron, the contents of this folder are basically copied over to /dist. (You can see the settings for this on webpack/settings.js)

**Important: When creating an installer, the version of the app, the name, description, and author, will be determined from this package.json's version field, while the URL the app will try to use to auto update as well as the app id or icon is pulled from the package.json at the root of our project under the build field.**


-----

### /static

```text
|-- /static  
|------ some_file_001.png  
```

While we normally import things through JS and let webpack solve the paths and URLs, the static folder is copied entirely to the root of our build, so it is a great folder to use for assets we don't know about when programming, or files to be added dynamically later. (Ex: our index.html uses static/favicon.ico directly, even from the /dist folder once built. if we were to include it through js, it would enter our project dependencies and create a file with a hashname within our assets in our build folder)

-----

### /webpack

```text
|-- /webpack  
|------ settings.js    
|------ webpack.config.js
```  

*webpack/settings.js* is just a config file imported by the actual webpack config, Be careful with messing with webpack.config.js unless you know what you are doing, as there is a lot of intricate setup! It makes it easier to configure project settings without having to mess with the raw webpack config.

settings.js has aliases for imports for example which is extremely useful.
(This lets us do *import someAsset from 'Assets/someAsset.png'* no matter where we are nested in)

-----



### /.babelrc
```text
|-- .babelrc
```  

Babel settings for code transpilation. (Ex: With its current settings, we can right arrow functions, let, const, and other JS features not available globally on all browsers)

-----



### /.eslintrc
```text
|-- .eslintrc
```  

Eslint settings. Not very strict settings at all. just some basic things, and the essential vue rules that will be usually code breaking.
If you do not want to use a linter, or want to use another linting tool, simply set *useLinter* to *false* in *webpack/settings.js*



-----

## Folder Structure - /src

```text
|-- /src  
|------- index.html
|------- index.scss
|------- index.js
|------- ...
```

Contains all our source code we will be working on. The root index.html is used as template for the vue SPA, the index.scss is globally scoped to cover anything on our page, and index.js is the entry point to our entire application.

-----

### src/api

This folder is ready to use axios and qs to easily create requests to the server or third party services.
You can simply *import Api from 'Api'* anywhere else, and use functions defined on the api object. Note that axios methods return a promise already, so you can do:

```javascript
import Api from 'Api'

Api.apiCall().then(response => {
    console.log(response.data)
}).catch(error => {
    console.error(error)
})
```


-----

### src/assets

Folder meant for assets, fonts, images, videos. etc.



-----

### src/components (Vue Specific)

Folder meant for Vue components, including the main start component App.js



-----

### src/routes (Vue Specific)

Here the routing for our front end is defined. We can set what URL route loads up what components, page titles. etc.
(Vue router is used for this behaviour)



-----

### src/store (Vue Specific)

This the folder where our store/global state is defined, as well as all the actions that modify it.
As a starting point, there's only a context module, which handles and passes down to components that need it, the context of our web app.
(Are we running in electron, which breakpoint are we on (Mobile vs Desktop), Initial config from *static/config.js*, are we in webpack development mode?)

App specific modules can be made and included in *store/index.js* - Ex: User



-----

### src/styles

Any css or scss files should go here. Arrange as you like.
In this case I have *fonts.scss* which imports and sets any needed fonts from *assets/fonts/*;
A very simple *reset.scss* which sets margins and padding to 0
*globals.scss* and *mixins.scss* are for just that. (Note that they need to be included everytime in scoped css vue component style sections, and that they only appear once on minified code.)


-----

### src/tools

The tools folder contains our polyfills (Promise, fetch), tools to obtain window size cross browser, check whether we are currently running in electron, etc.
The folder is meant for... tools; Things like parsers, validators, or any generic functionality or helpers can go here.












