import axios from 'axios'
import qs from 'qs'
axios.defaults.withCredentials = true

const isDev = WEBPACK_DEV /* Check whether we are in webpack dev mode through exposed global. Importing store/context causes circular dependency */
const api = {}
const baseURL = isDev ? 'http://something.dev.com/api' : 'https://something.com/api'

// External API calls
api.apiCall = (objectToSend) => {
    return axios.post(`${baseURL}/api-endpoint`, qs.stringify(objectToSend))
}

export default api