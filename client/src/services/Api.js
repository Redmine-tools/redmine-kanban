import axios from 'axios'

export default () => {
    return axios.create({
        // cors proxy url
        baseURL: process.env.VUE_APP_BACKEND_URL || 'http://localhost:3000/api'
    })
}
