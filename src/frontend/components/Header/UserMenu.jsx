import React, { useState } from 'react'
import { 
  Box, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Typography,
  IconButton,
  Avatar
} from '@mui/material'
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  SwitchAccount as SwitchAccountIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../hooks/useAuth'

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, logout } = useAuth()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNavigate = (path) => {
    navigate(path)
    handleClose()
  }

  const handleLogout = () => {
    logout()
    handleClose()
  }

  const menuItems = [
    {
      text: t('common.profile'),
      icon: <PersonIcon fontSize="small" />,
      onClick: () => handleNavigate('/profile')
    },
    {
      text: t('common.myAccount'),
      icon: <SettingsIcon fontSize="small" />,
      onClick: () => handleNavigate('/account')
    },
    {
      text: t('common.switchUser'),
      icon: <SwitchAccountIcon fontSize="small" />,
      onClick: () => handleNavigate('/login')
    },
    {
      text: t('common.adminPanel'),
      icon: <AdminIcon fontSize="small" />,
      onClick: () => handleNavigate('/admin')
    },
    {
      divider: true
    },
    {
      text: t('common.logout'),
      icon: <LogoutIcon fontSize="small" />,
      onClick: handleLogout
    }
  ]

  return (
    <>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          cursor: 'pointer',
          '&:hover': { 
            opacity: 0.8 
          }
        }}
        onClick={handleMenu}
      >
        <Avatar 
          sx={{ 
            width: 32, 
            height: 32,
            bgcolor: 'transparent',
            color: 'inherit'
          }}
        >
          <PersonIcon sx={{ width: 20, height: 20 }} />
        </Avatar>
        <Typography 
          color="inherit" 
          variant="body2"
        >
          {user?.name || 'User'}
        </Typography>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        {menuItems.map((item, index) => (
          item.divider ? (
            <Divider key={`divider-${index}`} />
          ) : (
            <MenuItem key={item.text} onClick={item.onClick}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText>{item.text}</ListItemText>
            </MenuItem>
          )
        ))}
      </Menu>
    </>
  )
}

export default UserMenu