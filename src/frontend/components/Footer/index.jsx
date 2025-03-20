import React from 'react'
import { Box, Typography } from '@mui/material'
import moment from 'moment'

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1.5,
        px: 2,
        backgroundColor: '#B0B6BA',
        borderColor: 'rgba(255, 255, 255, 0)',
        minHeight: '25px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography 
        sx={{ 
          textAlign: 'center', 
          color: '#fff',
          fontSize: '0.875rem'
        }}
      >
        &copy; {moment().format('YYYY')} Delta IT. All Rights Reserved. / version 1.0.0
      </Typography>
    </Box>
  )
}

export default Footer 