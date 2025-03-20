import React from 'react'
import { 
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  Folder as FolderIcon,
  Info as InfoIcon
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const DRAWER_WIDTH = 256

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

  const menuItems = [
    { 
      text: t('menu.dashboard'), 
      icon: <DashboardIcon />, 
      path: '/admin/' 
    },
    { 
      text: t('menu.freewareReview'), 
      icon: <AssignmentIcon />, 
      path: '/admin/freewarereview' 
    },
    { 
      text: t('menu.eFormQuery'), 
      icon: <DescriptionIcon />, 
      path: '/admin/eformquery' 
    },
    { 
      text: t('menu.swCollection'), 
      icon: <FolderIcon />, 
      path: '/admin/swcollection' 
    },
    { 
      text: t('menu.softwareInfo'), 
      icon: <InfoIcon />, 
      path: '/admin/softwareinfo' 
    }
  ]

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#3c4b64',
          color: 'white',
          borderRight: 'none',
          overflow: 'visible'
        },
      }}
    >
      <Box sx={{ 
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: '#1976d2',
        width: '100%',
        position: 'relative',
        zIndex: 1200
      }}>
        <Typography variant="h6" component="div" sx={{ 
          cursor: 'pointer',
          fontSize: '1.25rem',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          px: 3
        }}>
          Software Asset Management
        </Typography>
      </Box>
      <List sx={{ pt: 0 }}>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.text}>
            <ListItem 
              button 
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                py: 1.5,
                px: 3,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: 'white',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.875rem'
                }}
              />
            </ListItem>
            {index === 0 && (
              <Divider sx={{ 
                backgroundColor: 'rgba(255,255,255,0.6)',
                my: 1
              }} />
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar 