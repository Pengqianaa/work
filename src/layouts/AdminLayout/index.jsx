import React, { Suspense } from 'react'
import { Box, Container, CssBaseline } from '@mui/material'
import Header from '../../components/admin/Header'
import Sidebar from '../../components/admin/Sidebar'
import Footer from '../../components/admin/Footer'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const AdminLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar />
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: (theme) => theme.palette.grey[100],
            overflow: 'auto'
          }}
        >
          <Container maxWidth="lg">
            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>
          </Container>
        </Box>
        <Footer />
      </Box>
    </Box>
  )
}

export default AdminLayout 