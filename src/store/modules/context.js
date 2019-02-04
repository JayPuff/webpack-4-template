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
    // An easy way to configure app without recompiling etc. once deployed.
    config: {},
}


// getters
const getters = {
    lessThan: state => breakpointName => state.breakpoint.value < state.breakpoints[breakpointName].value,
    lessThanOrEqual: state => breakpointName => state.breakpoint.value <= state.breakpoints[breakpointName].value,
    equals: state => breakpointName => state.breakpoint.value == state.breakpoints[breakpointName].value,
    greaterThan: state => breakpointName => state.breakpoint.value > state.breakpoints[breakpointName].value,
    greaterThanOrEqual: state => breakpointName => state.breakpoint.value >= state.breakpoints[breakpointName].value,
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
