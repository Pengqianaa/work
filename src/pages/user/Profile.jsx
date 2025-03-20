import React from 'react'
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon
} from '@mui/icons-material'
import { useAuth } from '../../common/hooks/useAuth'
import { useTranslation } from 'react-i18next'

const Profile = () => {
  const { user } = useAuth()
  const { t } = useTranslation()

  const profileItems = [
    {
      icon: <PersonIcon />,
      label: t('common.name'),
      value: user?.name || 'N/A'
    },
    {
      icon: <EmailIcon />,
      label: t('common.email'),
      value: user?.email || 'N/A'
    },
    {
      icon: <PhoneIcon />,
      label: t('common.phone'),
      value: user?.phone || 'N/A'
    },
    {
      icon: <LocationIcon />,
      label: t('common.location'),
      value: user?.location || 'N/A'
    },
    {
      icon: <WorkIcon />,
      label: t('common.role'),
      value: user?.role || 'N/A'
    }
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: 'primary.main',
                  mb: 2
                }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {user?.name || 'User'}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {user?.role || 'User Role'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              {t('common.profile')}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {profileItems.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    secondary={item.value}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default Profile 