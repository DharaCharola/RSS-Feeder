import axios from 'axios'

const API = axios.create({
  baseURL: 'http://ec2-52-91-35-54.compute-1.amazonaws.com/api',
  headers: {
    'Content-Type': 'application/json',
    'access-control-allow-origin': '*',
  },
})

API.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default API
