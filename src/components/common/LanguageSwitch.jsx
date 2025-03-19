import React from 'react'
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
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

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('language', code)
    handleClose()
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <LanguageIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
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