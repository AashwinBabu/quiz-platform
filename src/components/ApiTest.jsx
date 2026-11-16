
import { useEffect } from 'react'
import AxiosConfig from '../services/AxiosConfig'

function ApiTest() {

    const fetchUsers = async () => {
        try {
            const response = await AxiosConfig.get('/users')
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div>
            <h2>API Testing</h2>
        </div>
    )
}

export default ApiTest
