import context from 'Tools/context'

const initialBreakpoint = context.getCurrentBreakpoint()

// Initial State
const state = {
    // Running Environment 
    electron: context.isElectron(),
    dev: WEBPACK_DEV, /* Global exposed by webpack config, allowed by eslint as well. */

    // Current CSS Breakpoint
    breakpoint: initialBreakpoint,
    breakpoints: context.getDefaultBreakpoints(),

    
    // Initial config from static/public folder `config.js`
    // An easy way to configure app without recompiling etc. once deployed..
    config: {},
    // Should maybe be null for the context of non-vue or simply checking this without observing it? Other wise can't tell if its loaded yet.
    electronConfig: {}
}


// getters
const getters = {
    lessThan: state => breakpointName => state.breakpoint.value < state.breakpoints[breakpointName].value,
    lessThanOrEquals: state => breakpointName => state.breakpoint.value <= state.breakpoints[breakpointName].value,
    equals: state => breakpointName => state.breakpoint.value == state.breakpoints[breakpointName].value,
    greaterThan: state => breakpointName => state.breakpoint.value > state.breakpoints[breakpointName].value,
    greaterThanOrEquals: state => breakpointName => state.breakpoint.value >= state.breakpoints[breakpointName].value,
}


// actions
const actions = {
    setBreakpoints ({ commit, state }, newBreakpoints) {
        commit('SET_BREAKPOINTS', { breakpoints: newBreakpoints } )
    },

    refreshBreakpoint ({ commit, state }) {
        let newBreakpoint = context.getCurrentBreakpoint(state.breakpoints)
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
    },

    setElectronConfig({ commit, state }, payload) {
        if(window.electronAPIs && window.electronAPIs.config) {
            commit('SET_ELECTRON_CONFIG', { config: window.electronAPIs.config })
        } else {
            commit('NO_ELECTRON_CONFIG', {} )
        }
    }
}


// mutations
const mutations = {
    SET_BREAKPOINT (state, payload) {
        state.breakpoint = payload.breakpoint
    },

    SET_BREAKPOINTS (state, payload) {
        state.breakpoints = payload.breakpoints
    },

    SET_STATIC_CONFIG (state, payload) {
        state.config = payload.config
    },

    SET_ELECTRON_CONFIG (state, payload) {
        state.electronConfig = payload.config
    },

    NO_STATIC_CONFIG (state, payload) {
        state.config = {}
    },

    NO_ELECTRON_CONFIG (state, payload) {
        state.electronConfig = { _notFound: true }
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
