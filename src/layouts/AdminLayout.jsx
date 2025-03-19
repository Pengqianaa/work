import React, { Suspense } from 'react'
import { Container, Box } from '@mui/material'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

const AdminLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </Container>
      </Box>
    </Box>
  )
}

export default AdminLayout 