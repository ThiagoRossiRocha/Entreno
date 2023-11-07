import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './error-page';
import { Profile } from './pages/profile';
import { Matches } from './pages/matches';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./hooks/AuthContext";
import { Login } from './pages/login';
import { Register } from './pages/register';
import { RequireAuth } from './hooks/RequireAuth';
import { Home } from './pages/home';
import { Confrontations } from './pages/confrontations';
import { SetNewPassword } from './pages/setNewPassword';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/profile",
    element: (
      <RequireAuth>
        <Profile />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: (
      <RequireAuth>
        <Home />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/matches",
    element: (
      <RequireAuth>
        <Matches />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/confrontations",
    element: (
      <RequireAuth>
        <Confrontations />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/reset-password",
    element: <SetNewPassword />,
    errorElement: <ErrorPage />,
  },
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster/>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

