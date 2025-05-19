import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router";
import Homepage from "./routes/Homepage.jsx";
import PostListPage from "./routes/PostListPage.jsx";
import Write from "./routes/Write.jsx";
import LoginPage from "./routes/LoginPage.jsx";
import RegisterPage from "./routes/RegisterPage.jsx";
import SinglePostPage from "./routes/SinglePostPage.jsx";
import SavedPostList from "./components/SavedPostList.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient()

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY; // Clerk'i avalik võti .env failist

// Kui Clerk võti puudub, viskab errori
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Brauserirouteri defineerimine koos erinevate lehtedega
const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/posts",
        element: <PostListPage />,
      },
      {
        path: "/:slug",
        element: <SinglePostPage />,
      },
      {
        path: "/write",
        element: <Write />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/saved",
        element: <SavedPostList />,
      },
    ],
  },
]);

// Rakenduse käivitamine
createRoot(document.getElementById('root')).render(
  <StrictMode>                                        {/* Arendusrežiim, aitab leida probleeme */}
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>  {/* Clerk autentimise pakkuja */}
      <QueryClientProvider client={queryClient}>      {/* React Query pakkuja */}
        <RouterProvider router={router} />            {/* Routeri pakkuja */}
        <ToastContainer position='bottom-right'/>      {/* Teavituste konteiner */}
      </QueryClientProvider>      
    </ClerkProvider>
  </StrictMode>,
)