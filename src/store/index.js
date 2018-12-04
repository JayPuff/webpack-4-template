import context from './modules/context'
import VueX from 'vuex'
import Vue from 'vue'

Vue.use(VueX)

const store = {
    modules: {
        context,
    }
}

export default new VueX.Store(store)