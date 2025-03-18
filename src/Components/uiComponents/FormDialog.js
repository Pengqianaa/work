import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import { Actions } from '../../Common/constants'

const FormDialog = props => {
  let { show, toggle, computerNames, assets, formValue, save, edit, intl, currentDetails } = props

  let [computerName, setComputerName] = useState([])
  let [selectedAsset, setSelectedAsset] = useState([])

  let [cValid, setCValid] = useState(false)
  let [sValid, setSValid] = useState(false)

  let [lock, setLock] = useState(false)
  
  useEffect(() => {
    if (show) {
      setCValid(false)
      setSValid(false)
    } else {
      return
    }
    if (!!formValue) {
      setComputerName([formValue])
      let list = currentDetails[formValue]
      let sl = assets.filter(e => list.includes(e.id))
      setSelectedAsset([...sl])
      setLock(true)
    } else {
      setComputerName([])
      setSelectedAsset([])
      setLock(false)
    }
  }, [show]) 

  let handleChangeName = e => {
    setComputerName(e.target.value)
  }
  let handleChangeAsset = e => {
    setSelectedAsset(e.target.value)
  }
  let handleSave = e =>{
    
    if (computerName.length === 0 || selectedAsset.length === 0) { 
      setCValid(computerName.length === 0)
      setSValid(selectedAsset.length === 0)
      return 
    }

    let params = { 
      computerNames: computerName,
      assetIds: selectedAsset.map(e => e.id)
    }
    if (lock) {
      edit(params)
    } else {
      save(params)
    }

    toggle(false)
  }

  return (
    <Dialog BackdropComponent={() => null} open={show} style={{zIndex: '99998'}} aria-labelledby="form-dialog-title">
      <DialogContent id="form-dialog-title" style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
        <Typography variant="h6">{intl.formatMessage({ id: 'cart.modal.title' })} </Typography>
        <IconButton
          aria-label="close"
          style={{ color: '#00A0E9', fontSize: '1rem', padding: '0'}}
          onClick={() => { toggle(false) }}
          size="large">
          {intl.formatMessage({ id: 'cart.modal.close' })} 
        </IconButton>
      </DialogContent>
      <DialogContent style={{ width: '500px'}}>
        <FormControl
          variant="standard"
          disabled={lock}
          required
          error={cValid}
          style={{ width: '100%' }}>
          <InputLabel id="computer-name-select">{intl.formatMessage({ id: 'cart.modal.computerName' })}</InputLabel>
          <Select
            variant="standard"
            labelId="computer-name-select"
            multiple
            value={computerName}
            renderValue={(computerName) => computerName.join(', ')}
            onChange={handleChangeName}
            onFocus={() => { setCValid(false) }}>
            {computerNames.map((el, index) => {
              return <MenuItem key={index} value={el}><Checkbox style={{ color: '#0087DC' }} checked={computerName.includes(el)} />{el}</MenuItem >
            })}
          </Select>
        </FormControl>
        <FormControl variant="standard" required error={sValid} style={{ width: '100%' }}>
          <InputLabel id="asset-name-select">{intl.formatMessage({ id: 'cart.modal.assets' })}</InputLabel>
          <Select
            variant="standard"
            labelId="asset-name-select"
            multiple
            value={selectedAsset}
            renderValue={(selectedAsset) => selectedAsset.map(e => e.assetName).join(', ')}
            onChange={handleChangeAsset}
            onFocus={() => { setSValid(false) }}>
            {assets.map(asset => {
              return <MenuItem key={asset.assetId} value={asset}><Checkbox style={{ color: '#0087DC' }} checked={selectedAsset.filter(e => e.assetId === asset.assetId).length > 0} />{asset.assetName}</MenuItem>
            })}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained" style={{ color:'#fff', backgroundColor: '#00A0E9', fontSize: '0.8rem' }}>
          {intl.formatMessage({ id: 'cart.modal.save' })} 
        </Button>
      </DialogActions>
    </Dialog>
  );
}


const mapStateToProps = state => ({
  currentDetails: state.cart.installationDetails
})
const mapDispatchToProps = dispatch => ({
  save: details => dispatch({
    type: Actions.ADD_INTO_DETAILS,
    payload: details
  }),
  edit: details => dispatch({
    type: Actions.EDIT_DETAILS,
    payload: details
  })
})

export default connect(mapStateToProps, mapDispatchToProps)(FormDialog)