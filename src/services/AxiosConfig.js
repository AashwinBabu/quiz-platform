
import axios from 'axios'

const AxiosConfig = axios.create({
    baseURL: 'https://quizup-server-wfd1.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    }
})

export default AxiosConfig
