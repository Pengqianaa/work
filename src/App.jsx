import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout/index'
import UserLayout from './layouts/UserLayout'
import adminRoutes from './routes/adminRoutes'
import userRoutes from './routes/userRoutes'
import { ThemeProvider } from '@mui/material/styles'
import { lightTheme } from './config/theme'
import LoadingSpinner from './components/common/LoadingSpinner'

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
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/" replace />} />
          
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