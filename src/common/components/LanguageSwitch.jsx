import React from 'react'
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemText 
} from '@mui/material'
import { Language as LanguageIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' }
]

const LanguageSwitch = () => {
  const { i18n } = useTranslation()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const changeLanguage = async (code) => {
    try {
      await i18n.changeLanguage(code)
      localStorage.setItem('language', code)
      document.documentElement.lang = code
      handleClose()
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  return (
    <>
      <IconButton 
        color="inherit" 
        onClick={handleClick}
        size="small"
      >
        <LanguageIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            selected={i18n.language === lang.code}
          >
            <ListItemText>{lang.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default LanguageSwitch 