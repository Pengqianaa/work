/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import TextField from '@mui/material/TextField'
import { Autocomplete } from '@mui/material'

const SWStockQuery = props => {

  const { 
    swStockList,
    setInfo, 
    getSWStockList,
    isDisabled,
    intl
  } = props

  let [keyword, setKeyword] = useState('')

  useEffect(() => {
    if (typeof keyword !== 'undefined' && keyword.length > 10) {
      getSWStockList(keyword)
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
    disabled={isDisabled}
    size="small"
    options={swStockList}
    getOptionLabel={(option) => {
      if (!option) { return '' }
      return option.stockId
    }}
    isOptionEqualToValue={(option, value) =>
        value === undefined || value === "" || option.id === value.id
    }    
    onChange={onChange}
    onInputChange={handleKeyUp}
    renderInput={(params) => (
      <TextField {...params} value={keyword} variant="standard" label={'StockId'} />
    )}
  />
}

const mapStateToProps = state => ({
  swStockList: state.swCollection.swStockList,
})
const mapDispatchToProps = dispatch => ({
  getSWStockList: (stockId) => dispatch({
    type: 'getSWStockList',
    payload:{stockId},
  }),
})

export default connect(mapStateToProps, mapDispatchToProps)(SWStockQuery)

