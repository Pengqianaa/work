import React from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

export default props => {
  const { open } = props

  return <Backdrop
    style={{ color: '#fff', zIndex: '99999' }}
    open={open}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
}