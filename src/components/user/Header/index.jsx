import React from 'react'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import UserMenu from './UserMenu'
import LanguageSwitch from '../../common/LanguageSwitch'

const Header = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

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
          {t('common.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <LanguageSwitch />
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header 