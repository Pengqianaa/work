import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'

const REASON_LENGTH_LIMIT = 200

const SendDialog = props => {
  let { show, toggle, title, label, save, intl } = props

  let [reasons, setReasons] = useState('')
  let [rValid, setRValid] = useState(false)
  
  useEffect(() => {
    if (show) {
      setRValid(false)
      setReasons('')
    }
  }, [show]) 
  
  let handleEditReasons = e => {
    setReasons(e.target.value)
  }
  let handleSave = e =>{
    if (!reasons || reasons.trim().length > REASON_LENGTH_LIMIT) { 
      setRValid(reasons.trim().length === 0 || reasons.trim().length > REASON_LENGTH_LIMIT)
      return 
    }
    save(reasons)
    toggle(false)
  }

  return (
    <Dialog BackdropComponent={() => null} open={show} style={{zIndex: '99998'}} aria-labelledby="send-dialog-title">
      <DialogContent id="send-dialog-title" style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
        <Typography variant="h6">{title}</Typography>
      </DialogContent>
      <DialogContent style={{ width: '500px'}}>
        <FormControl variant="standard" required style={{ width: '100%', paddingTop: '8px' }}>
          <TextField
            style={{ border: rValid ? '1px solid red' : '0', borderRadius: '4px' }}
            label={''} 
            multiline
            rows={4}
            variant="outlined"
            value={reasons}
            onChange={handleEditReasons}
            onFocus={() => { setRValid(false) }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions style={{ padding: '8px 24px 20px' }}>
        <Button variant="contained" onClick={handleSave} style={{ color:'#fff', backgroundColor: '#00A0E9', fontSize: '0.8rem', }}>
          {intl.formatMessage({ id: 'cart.modal.send' })} 
        </Button>
        <Button variant="contained" onClick={() => { toggle(false) }} style={{ fontSize: '0.8rem' }}>
          {intl.formatMessage({ id: 'cart.modal.cancel' })} 
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SendDialog
