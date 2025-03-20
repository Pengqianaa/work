import React from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Box
} from '@mui/material'
import {
  Notifications as NotificationsIcon
} from '@mui/icons-material'
import UserMenu from './UserMenu'
import LanguageSwitch from '../../common/LanguageSwitch'

const Header = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#1976d2',
        color: '#fff',
        boxShadow: 'none',
        height: '64px'
      }}
    >
      <Toolbar sx={{ minHeight: '64px !important' }}>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            color="inherit" 
            size="small"
            sx={{ color: 'inherit' }}
          >
            <NotificationsIcon fontSize="small" />
          </IconButton>
          <LanguageSwitch />
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header 