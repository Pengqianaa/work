import React from 'react'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button 
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import UserMenu from './UserMenu'
import LanguageSwitch from '../../common/LanguageSwitch'

const Header = () => {
  const navigate = useNavigate()

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          sx={{ 
            flexGrow: 1,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/')}
        >
          Software Asset Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            color="inherit"
            onClick={() => navigate('/admin')}
          >
            Admin Panel
          </Button>
          <LanguageSwitch />
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header 