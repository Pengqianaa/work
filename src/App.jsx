import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './admin/layouts/AdminLayout'
import UserLayout from './frontend/components/layout/UserLayout'
import adminRoutes from './admin/routes/adminRoutes'
import userRoutes from './frontend/routes/userRoutes'
import { ThemeProvider } from '@mui/material/styles'
import { lightTheme } from './common/config/theme'
import LoadingSpinner from './common/components/LoadingSpinner'

const App = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Admin Routes */}
          {adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <AdminLayout>
                  <route.component />
                </AdminLayout>
              }
            />
          ))}
          
          {/* User Routes */}
          {userRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <UserLayout>
                  <route.component />
                </UserLayout>
              }
            />
          ))}

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/permissions" replace />} />
          <Route path="/permissions" element={<Navigate to="/permissions/" replace />} />
          
          {/* 404 page */}
          <Route
            path="*"
            element={
              <div>404 Not Found</div>
            }
          />
        </Routes>
      </Suspense>
    </ThemeProvider>
  )
}

export default App 