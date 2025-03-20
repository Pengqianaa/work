import React, { useState } from 'react'
import { 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material'
import { useAuth } from '../../../hooks/useAuth'
import { useTranslation } from 'react-i18next'

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { logout } = useAuth()
  const { t } = useTranslation()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleClose()
  }

  const menuItems = [
    {
      text: t('common.profile'),
      icon: <PersonIcon fontSize="small" />,
      onClick: handleClose
    },
    {
      text: t('common.settings'),
      icon: <SettingsIcon fontSize="small" />,
      onClick: handleClose
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
      <IconButton
        onClick={handleMenu}
        color="inherit"
        size="small"
        sx={{ ml: 2 }}
      >
        <Avatar 
          sx={{ 
            width: 32, 
            height: 32,
            bgcolor: 'primary.main'
          }}
        >
          A
        </Avatar>
      </IconButton>
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
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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