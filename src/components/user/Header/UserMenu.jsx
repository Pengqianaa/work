import React, { useState } from 'react'
import { 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem 
} from '@mui/material'
import { useAuth } from '../../../hooks/useAuth'

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { logout } = useAuth()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton onClick={handleMenu} color="inherit">
        <Avatar sx={{ width: 32, height: 32 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  )
}

export default UserMenu 