// Import Global Style for this page
import './index.scss'

// Import Polyfills and others from Tools (Promise)
import 'Tools/polyfills'


// Vue Dependencies
import Vue from 'vue'
import store from 'Store'
import router from 'Routes'

// Sync router with vuex so we can use this.$store.state.route ... reactively.
import { sync } from 'vuex-router-sync'
sync(store, router)

Vue.config.productionTip = false

// Try to fetch static config file
store.dispatch('context/fetchStaticConfig')


// If running within electron, check for updates.
if (store.state.context.electron) {
    window.electronAPIs.autoUpdater.checkForUpdates()

    // Check every two minutes.
    setInterval(() => {
        window.electronAPIs.autoUpdater.checkForUpdates()
    }, 120000 )


    // Try to fetch static electron config file
    // optional config.json in .../Users/<user>/AppData/Roaming/<app name>/ (Windows)
    store.dispatch('context/setElectronConfig')

    window.electronAPIs.logger.log('Hello from index.js!')
}

// Main Vue Instance and Component
import App from 'Components/App'

new Vue({
    el: '#root',
    store,
    router,
    components: { App },
    render: f => f(App)
})


// Handle browser resize
import debounce from 'lodash.debounce'

const onResize = () => { store.dispatch('context/refreshBreakpoint') }
const onResizeDebounced = debounce(onResize, 150)

window.addEventListener('resize', () => {
    onResizeDebounced()
})
