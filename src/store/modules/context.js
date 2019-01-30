import context from 'Tools/context'

// Initial State
const state = {
    // Running Environment 
    electron: context.isElectron(),
    dev: WEBPACK_DEV, /* Global exposed by webpack config, allowed by eslint as well. */

    // Current CSS Breakpoint
    breakpoint: context.getBreakpoint(),
    
    // Initial config from static/public folder `config.js`
    // An easy way to configure app without recompiling etc. once deployed.
    config: {},
}


// getters
const getters = {
}


// actions
const actions = {
    refreshBreakpoint ({ commit, state }) {
        let newBreakpoint = context.getBreakpoint()
        if(state.breakpoint != newBreakpoint) {
            commit('SET_BREAKPOINT', { breakpoint: newBreakpoint})
        }
    },

    fetchStaticConfig({ commit, state }) {
        if(window.staticConfig) {
            commit('SET_STATIC_CONFIG', { config: window.staticConfig })
        } else {
            commit('NO_STATIC_CONFIG', {} )
        }
    }
}


// mutations
const mutations = {
    SET_BREAKPOINT (state, payload) {
        state.breakpoint = payload.breakpoint
    },

    SET_STATIC_CONFIG (state, payload) {
        state.config = payload.config
    },

    NO_STATIC_CONFIG (state, config) {
        state.config = {}
    },

}

// Export
export default {
    namespaced : true,
    state,
    getters,
    actions,
    mutations
}
