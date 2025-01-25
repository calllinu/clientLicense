import {Route, Routes} from 'react-router-dom';
import Login from './auth/login/Login.tsx';
import Register from './auth/register/Register.tsx';
import Dashboard from './components/dashboard/Dashboard.tsx';
// import AdminProtectedRoute from './ProtectedRoutes/AdminProtectedRoute.tsx';
import EmployeeDetails from "./components/employee-details/EmployeeDetails.tsx";
import AuthProtectedRoute from "./ProtectedRoutes/AuthProtectedRoute.tsx";


function App() {
    return (
        <Routes>
            <Route
                path="/dashboard"
                element={
                    <AuthProtectedRoute>
                        <Dashboard/>
                    </AuthProtectedRoute>
                }
            />
            <Route
                path="/dashboard/:subsidiaryId"
                element={
                    <AuthProtectedRoute>
                        <EmployeeDetails/>
                    </AuthProtectedRoute>
                }
            />
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
        </Routes>
    );
}

export default App;
