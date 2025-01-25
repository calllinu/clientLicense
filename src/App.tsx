import {Route, Routes} from 'react-router-dom';
import Login from './auth/login/Login.tsx';
import Register from './auth/register/Register.tsx';
import Dashboard from './components/dashboard/Dashboard.tsx';
import AdminProtectedRoute from './ProtectedRoutes/AdminProtectedRoute.tsx';
import EmployeeDetails from "./components/employee-details/EmployeeDetails.tsx";


function App() {
    return (
        <Routes>
            <Route
                path="/dashboard"
                element={
                    <AdminProtectedRoute>
                        <Dashboard/>
                    </AdminProtectedRoute>
                }
            />
            <Route
                path="/dashboard/:subsidiaryId"
                element={
                    <AdminProtectedRoute>
                        <EmployeeDetails/>
                    </AdminProtectedRoute>
                }
            />
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
        </Routes>
    );
}

export default App;
