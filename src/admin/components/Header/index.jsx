import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button
} from '@mui/material'
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import UserMenu from './UserMenu'
import LanguageSwitch from '../../common/LanguageSwitch'

const Header = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

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
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '1rem',
            color: 'inherit'
          }}
          onClick={() => navigate('/admin')}
        >
          {t('admin.title')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button 
            color="inherit"
            onClick={() => navigate('/')}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              color: 'inherit'
            }}
          >
            Back to Home
          </Button>
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