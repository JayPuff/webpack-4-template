// Initial State
const initialState = () => ({
    
})

// State
const state = initialState()


// getters
const getters = {
    
}


// actions
const actions = {
    reset ({ commit, state }) {
        commit('RESET')
    }
}


// mutations
const mutations = {
    RESET (state) {
        const newState = initialState()
        Object.keys(newState).forEach(key => {
            state[key] = newState[key]
        })
    }
}

// Export
export default {
    namespaced : true,
    state,
    getters,
    actions,
    mutations
}
