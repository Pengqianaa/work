import React, { Suspense } from 'react'
import { Box, Container } from '@mui/material'
import Header from '../../Header'
import Footer from '../../Footer'
import LoadingSpinner from '../../../../common/components/LoadingSpinner'

const UserLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </Container>
      <Footer />
    </Box>
  )
}

export default UserLayout 