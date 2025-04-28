// src/components/ProtectedRoute.jsx
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { logout } from "../utils/userSlice";
import { jwtDecode } from "jwt-decode";

const ProtectedRoutes = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.user.token);

    if (!token) {
        return <Navigate to="/" replace />;
    }

    try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
            // Token expired
            dispatch(logout());
            return <Navigate to="/" replace />;
        }
    } catch (error) {
        // Token invalid or corrupted
        dispatch(logout());
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};  

export default ProtectedRoutes;
