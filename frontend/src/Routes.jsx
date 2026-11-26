import React from "react";
import { useRoutes, Navigate } from "react-router-dom";

// Pages
import Dashboard  from "./components/dashboard/Dashboard";
import Profile    from "./components/user/Profile";
import Signup     from "./components/auth/Signup";
import Login      from "./components/auth/Login";
import CreateRepo from "./components/repo/CreateRepo";
import RepoDetail from "./components/repo/RepoDetail";

// Auth Context
import { useAuth } from "./authContext";

const ProtectedRoute = ({ children }) => {
    const { currUser } = useAuth();
    return currUser ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const { currUser } = useAuth();
    return !currUser ? children : <Navigate to="/" />;
};

const Routes = () => {
    const routes = useRoutes([
        {
            path: "/",
            element: (
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            ),
        },
        {
            path: "/userProfile/:userId",
            element: (
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            ),
        },
        {
            path: "/repo/create",
            element: (
                <ProtectedRoute>
                    <CreateRepo />
                </ProtectedRoute>
            ),
        },
        {
            path: "/repo/:repoId",
            element: (
                <ProtectedRoute>
                    <RepoDetail />
                </ProtectedRoute>
            ),
        },
        {
            path: "/login",
            element: (
                <PublicRoute>
                    <Login />
                </PublicRoute>
            ),
        },
        {
            path: "/signup",
            element: (
                <PublicRoute>
                    <Signup />
                </PublicRoute>
            ),
        },
        {
            // Catch-all — redirect unknown paths to dashboard
            path: "*",
            element: <Navigate to="/" />,
        },
    ]);

    return routes;
};

export default Routes;
