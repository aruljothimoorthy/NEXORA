import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import AppLayout from '../layouts/AppLayout'
import ScrollToTop from '../components/layout/ScrollToTop'
import PageLoader from '../components/ui/PageLoader'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'
import NotFoundPage from '../pages/NotFoundPage'

const HomePage = lazy(() => import('../pages/HomePage'))
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'))
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'))
const ProjectsPage = lazy(() => import('../pages/projects/ProjectsPage'))
const ProjectDetailsPage = lazy(() => import('../pages/projects/ProjectDetailsPage'))
const NotificationsPage = lazy(() => import('../pages/notifications/NotificationsPage'))
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'))
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'))

function LazyPage({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route
            index
            element={
              <LazyPage>
                <HomePage />
              </LazyPage>
            }
          />
        </Route>

        <Route element={<PublicOnlyRoute />}>
          <Route element={<PublicLayout />}>
            <Route
              path="login"
              element={
                <LazyPage>
                  <LoginPage />
                </LazyPage>
              }
            />
            <Route
              path="register"
              element={
                <LazyPage>
                  <RegisterPage />
                </LazyPage>
              }
            />
            <Route
              path="forgot-password"
              element={
                <LazyPage>
                  <ForgotPasswordPage />
                </LazyPage>
              }
            />
          </Route>
        </Route>

        <Route path="app" element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route
              path="dashboard"
              element={
                <LazyPage>
                  <DashboardPage />
                </LazyPage>
              }
            />
            <Route
              path="projects"
              element={
                <LazyPage>
                  <ProjectsPage />
                </LazyPage>
              }
            />
            <Route
              path="projects/:projectId"
              element={
                <LazyPage>
                  <ProjectDetailsPage />
                </LazyPage>
              }
            />
            <Route
              path="notifications"
              element={
                <LazyPage>
                  <NotificationsPage />
                </LazyPage>
              }
            />
            <Route
              path="profile"
              element={
                <LazyPage>
                  <ProfilePage />
                </LazyPage>
              }
            />
            <Route
              path="settings"
              element={
                <LazyPage>
                  <SettingsPage />
                </LazyPage>
              }
            />
            <Route
              path="*"
              element={
                <LazyPage>
                  <NotFoundPage />
                </LazyPage>
              }
            />
          </Route>
        </Route>

        <Route element={<PublicLayout />}>
          <Route
            path="*"
            element={
              <LazyPage>
                <NotFoundPage />
              </LazyPage>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
