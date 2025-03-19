/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import TextField from '@mui/material/TextField'
import { Autocomplete } from '@mui/material'

const SWCostCenterQuery = props => {

  const { 
    verified,
    setInfo, 
    getSWCostCenter,
    userFlag,
    intl
  } = props

  let [keyword, setKeyword] = useState('')

  useEffect(() => {
    if (typeof keyword !== 'undefined' && keyword.length > 7) {
      getSWCostCenter(keyword,userFlag)
    }
    if (keyword.includes('ALL')) {
      getSWCostCenter(keyword,userFlag)
    }
  }, [keyword])

  let handleKeyUp = e => {
    if (e === null) { return }
    setKeyword(e.target.value)
  }
  let onChange = (e, v) => {
    setInfo(v)
    setKeyword('')
  }
  return <Autocomplete
    size="small"
    options={[...verified]}
    onChange={onChange}
    onInputChange={handleKeyUp}
    isOptionEqualToValue={(option, value) =>
        value === undefined || value === "" || option.id === value.id
    }
    renderInput={(params) => (
      <TextField {...params} value={keyword} variant="standard" label={intl.formatMessage({ id: 'adminCommon.costCenter' })} />
    )}
  />
}

const mapStateToProps = state => ({
  verified: state.swCollection.swCostCenterList
})
const mapDispatchToProps = dispatch => ({
  getSWCostCenter: (keyword,userFlag) => dispatch({
		type: 'getSWCostCenter',
    payload: {keyword,userFlag}
  }),
})

export default connect(mapStateToProps, mapDispatchToProps)(SWCostCenterQuery)

