import { Route, Routes } from 'react-router-dom';
import Login from './auth/login/Login.tsx';
import Register from './auth/register/Register.tsx';
import Dashboard from './components/dashboard/Dashboard.tsx';
import AuthProtectedRoute from "./AuthProtectedRoute.tsx";

function App() {

    return (
        <Routes>

            <Route
                path="/"
                element={
                    <AuthProtectedRoute>
                        <Dashboard />
                    </AuthProtectedRoute>
                }
            />
            <Route path="/login" element={ <Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    );
}

export default App;
