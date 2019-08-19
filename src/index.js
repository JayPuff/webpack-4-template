// Import Global Style for this page
import './index.scss'

// Import Polyfills and others from Tools (Promise)
import 'Tools/polyfills'


// if ('serviceWorker' in navigator) {
//     if(!store.state.context.dev) { 
//         if(USE_SERVICE_WORKER) {
//             window.addEventListener('load', () => {
//                 navigator.serviceWorker.register('./service-worker.js').then(registration => {
//                     console.log('Service Worker registered successfully. (For website offline access)', registration);
//                 }).catch(registrationError => {
//                     console.log('Service Worker for offline mode could not register or is not supported on this browser. (Are you not on HTTPS?)', registrationError);
//                 });
//             });
//         } else {
//             console.log('Trying to Remove any existing service workers.');
//             navigator.serviceWorker.getRegistrations().then((registrations) => {
//                 let removedWorkers = 0
//                 for(let registration of registrations) {
//                     removedWorkers += 1
//                     registration.unregister()
//                     console.log('Removed a service worker.');
//                 }
//                 if(removedWorkers == 0) {
//                     console.log('No service workers found.');
//                 }
//             })
//         }
//     } else {
//         console.log('Service Worker for offline mode will not register since we are running on DEV mode.')
//     }
// } else {
//     console.warn('Service Worker for offline mode could not register or is not supported on this browser. (Are you not on HTTPS?)')
// }



// Try to fetch static config file
// store.dispatch('context/fetchStaticConfig')


// If running within electron, check for updates.
// if (store.state.context.electron) {
//     window.electronAPIs.autoUpdater.checkForUpdates()

//     // Check every two minutes.
//     setInterval(() => {
//         window.electronAPIs.autoUpdater.checkForUpdates()
//     }, 120000 )


//     // Try to fetch static electron config file
//     // optional config.json in .../Users/<user>/AppData/Roaming/<app name>/ (Windows)
//     store.dispatch('context/setElectronConfig')

//     window.electronAPIs.logger.log('Hello from index.js!')
// }

// Main Vue Instance and Component
import React from "react";
import ReactDOM from "react-dom";

import App from "Components/App"
ReactDOM.render(<App />, document.getElementById("root"))


// // Handle browser resize
// import debounce from 'lodash.debounce'

// const onResize = () => { store.dispatch('context/refreshBreakpoint') }
// const onResizeDebounced = debounce(onResize, 150)

// window.addEventListener('resize', () => {
//     onResizeDebounced()
// })
