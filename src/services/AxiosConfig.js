
import axios from 'axios'

const AxiosConfig = axios.create({
    baseURL: 'https://quizup-server-wfdl.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    }
})

export default AxiosConfig
