import context from 'Tools/context'
import Api from 'Api'
const mobileThreshold = 600 

// Initial State
const state = {
    mobile: context.isMobile(mobileThreshold),
    electron: context.isElectron(),
    dev: WEBPACK_DEV, /* Global exposed by webpack config, allowed by eslint as well. */
    config: {},
}


// getters
const getters = {
}


// actions
const actions = {
    refreshMobileState ({ commit, state }) {
        let isMobile = context.isMobile(mobileThreshold)
        if(state.mobile != isMobile) {
            if(isMobile) {
                commit('SET_MOBILE', {})
            } else {
                commit('SET_DESKTOP', {})
            }
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
    SET_MOBILE (state, payload) {
        state.mobile = true
    },

    SET_DESKTOP (state, payload) {
        state.mobile = false
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
