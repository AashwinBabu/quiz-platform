
import { Navigate } from 'react-router-dom'

function AdminProtectedRoute({ children }) {
    const savedUser = localStorage.getItem('currentUser')
    const currentUser = savedUser ? JSON.parse(savedUser) : null

    if (!currentUser) {
        return <Navigate to="/login" replace />
    }

    if (currentUser.role !== 'admin') {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

export default AdminProtectedRoute
