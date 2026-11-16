
import { Routes, Route } from 'react-router-dom'

import Landing from './Pages/Landing'
import Login from './Pages/auth/Login'
import Signup from './Pages/auth/Signup'

import UserDashboard from './Pages/UserDashboard'
import AdminDashboard from './Pages/AdminDashboard'

import ManageQuestions from './Pages/ManageQuestions'
import FetchQuestions from './Pages/FetchQuestions'
import AddQuestion from './Pages/AddQuestion'

import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'

import Quiz from './Pages/Quiz'
import Result from './Pages/Result'

import MyAttempts from './Pages/MyAttempts'
import Leaderboard from './Pages/Leaderboard'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <UserDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/dashboard"
                element={
                    <AdminProtectedRoute>
                        <AdminDashboard />
                    </AdminProtectedRoute>
                }
            />

            <Route
                path="/admin/questions"
                element={
                    <AdminProtectedRoute>
                        <ManageQuestions />
                    </AdminProtectedRoute>
                }
            />

            <Route
                path="/admin/questions/fetch"
                element={
                    <AdminProtectedRoute>
                        <FetchQuestions />
                    </AdminProtectedRoute>
                }
            />

            <Route
                path="/admin/questions/add"
                element={
                    <AdminProtectedRoute>
                        <AddQuestion />
                    </AdminProtectedRoute>
                }
            />
            <Route
    path="/quiz"
    element={
        <ProtectedRoute>
            <Quiz />
        </ProtectedRoute>
    }
/>

<Route
    path="/result"
    element={
        <ProtectedRoute>
            <Result />
        </ProtectedRoute>
    }
/>
<Route
    path="/my-attempts"
    element={
        <ProtectedRoute>
            <MyAttempts />
        </ProtectedRoute>
    }
/>
<Route
    path="/leaderboard"
    element={
        <ProtectedRoute>
            <Leaderboard />
        </ProtectedRoute>
    }
/>
        </Routes>
    )
}

export default App
