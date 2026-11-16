
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))

    if (!currentUser) {
        return <Navigate to="/login" replace />
    }

    if (currentUser.role !== 'user') {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute
