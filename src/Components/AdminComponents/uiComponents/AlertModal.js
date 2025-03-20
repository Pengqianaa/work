import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import { Actions } from '../../Common/constants'


const AlertModal = props => {
  let { show, toggle, alertProps = {} } = props
  let { title, message, hasCancel, callback } = alertProps
  const intl = useIntl()

  let handleConfirm = e =>{
    callback()
    toggle(false)
  }

  return <Dialog BackdropComponent={() => null} open={show} style={{zIndex: '99999'}} aria-labelledby="send-dialog-title">
    <DialogContent id="send-dialog-title" style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
      <Typography variant="h6">{title}</Typography>
    </DialogContent>
    <DialogContent style={{ width: '500px'}}>
      <Typography variant="p">{message}</Typography>
    </DialogContent>
    <DialogActions style={{ padding: '8px 24px 20px' }}>
      <Button variant="contained" onClick={handleConfirm} style={{ color:'#fff', backgroundColor: '#00A0E9', fontSize: '0.8rem', }}>
        {intl.formatMessage({ id: 'adminCommon.confirm' })} 
      </Button>
      {hasCancel && <Button variant="contained" onClick={() => { toggle(false) }} style={{ fontSize: '0.8rem' }}>
        {intl.formatMessage({ id: 'adminCommon.cancel' })} 
      </Button>}
    </DialogActions>
  </Dialog>
}

const mapStateToProps = state => ({
  show: state.view.alertShow,
  alertProps: state.view.alertProps
})
const mapDispatchToProps = dispatch => ({
  toggle: bool => dispatch({
    type: Actions.TOGGLE_ALERT,
		payload: bool
  }),
})

export default connect(mapStateToProps, mapDispatchToProps)(AlertModal)
