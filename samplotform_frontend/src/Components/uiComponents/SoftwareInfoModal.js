import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CRow, CCol
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import '../../CSS/common.scss'
import styled from 'styled-components'

import { showWithDefault, backServerIP } from '../../Common/common'
import LogoImage from './LogoImage'
import BlockButton from './BlockButton'
import OpenInNew from '@mui/icons-material/OpenInNew'
const ProfileClose = styled(CButton)`
  color: #00A0E9;
  font-weight: bold;
`

const CartItem = styled(CRow)`
  margin: 0 10px;
`
const ItemCol = styled(CCol)`
  padding: 10px;
`

const ItemInfo = styled.p`
  font-size: 12px;
  margin: 4px 8px 4px 8px;
  width: 100%;
  overflow-wrap: break-word;
`

const SoftwareName = styled.p`
  font-weight: bold;
  margin: 4px 8px 4px 8px;
`

const Divider = styled.div`
  width: 100%;
  border-top: 1px solid;
  border-color: #c4c9d0;
`

const CartButton = styled(BlockButton)`
  max-width: 104px;
  border-radius: 0;
  height: 32px;
  font-size: 12px;
  padding: 4px;
`

const SoftwareInfoModal = (props) => {
  let { item, addToCart, cart, i18nRef, deltaLibraryId, categoryMap } = props
  const intl = useIntl()
  let isDeltaLibrary = item.secondCategoryId === deltaLibraryId
  let assetImage = item.graph ? `${backServerIP}/image/show/${item.graph}` : ''

  let [label1, setLabel1] = useState('Function')
  let [label2, setLabel2] = useState('Brand')

  useEffect(() => {
    if (item.secondCategoryId) {
      let categoryInfoObj = Object.values(categoryMap).filter(el => {
        return el.id === item.secondCategoryId
      })[0]
      
      if (categoryInfoObj && categoryInfoObj.label2EN) { setLabel2(categoryInfoObj.label2EN) }
      if (categoryInfoObj && categoryInfoObj.label1EN) { setLabel1(categoryInfoObj.label1EN) }
    }
    
  }, [categoryMap, item])
  
  
  let isEn = props.locale === 'en-US'

  let redUrl = isEn ? item.assetRefUrlEN: item.assetRefUrlTC

  let handleClickAdd = () => {
    addToCart(item)
  }
  let functionType = isEn ? item.categoryNameEN: item.categoryNameTC

  let price = showWithDefault(item.referencePrice, '--')
  if (price !== '--') {
    price = item.referencePrice.toLocaleString()
  }
  let currency = item.referenceCurrency ? item.referenceCurrency : ''
  
  return (
    <CModal
      backdrop={false}
      show={props.show}
      onClosed={() => { props.toggleFunc(false) }}
    >
      <CModalHeader>
        <CModalTitle><FormattedMessage id="search.modal.title" /></CModalTitle>
        <ProfileClose onClick={() => { props.toggleFunc(false) }}>{intl.formatMessage({ id: 'search.modal.close' })}</ProfileClose>
      </CModalHeader>
      <CModalBody>
        
          <CartItem>
            <ItemCol lg="3">
              <LogoImage style={{ width: '100%' }} src={assetImage}></LogoImage>
            </ItemCol>
            <ItemCol lg="9">
              <SoftwareName>{item.assetName}</SoftwareName>
              <ItemInfo>{`${intl.formatMessage({ id: 'search.modal.refSource' })}:   `}{redUrl ? <OpenInNew onClick={() => { window.open(redUrl) }} style={{ margin: '0 0 2px 10px', fontSize: '16px', color: 'green', cursor: 'pointer' }} />: '--'}</ItemInfo>
              <ItemInfo>{`${intl.formatMessage({ id: 'search.modal.price' })}:   `}<span style={{ color: 'green', fontWeight: 'bold' }}>{` ${currency} ${price}`}</span></ItemInfo>
              <Divider></Divider>
              {item.brandName && <ItemInfo>{`${label2}: ${item.brandName}`}</ItemInfo>}
              <ItemInfo>{`${intl.formatMessage({ id: 'search.category' })}: ${isEn ? item.categoryNameEN: item.categoryNameTC}`}</ItemInfo>
              <ItemInfo>{`${label1}: ${showWithDefault(functionType, '--')}`}</ItemInfo>
              <ItemInfo>{`${intl.formatMessage({ id: 'search.modal.stock' })}:   `}<span style={{ color: item.isValid === 1? 'green' : 'red', fontWeight: 'bold' }}>{item.isValid === 1? 'Available' : 'Not Available'}</span></ItemInfo>
            </ItemCol>
          </CartItem>
      </CModalBody>
      {!isDeltaLibrary && <CModalFooter>
        <CartButton color={'info'} disabled={ cart.filter(e => e.assetId === item.assetId).length > 0 || item.isValid !== 1} onClick={handleClickAdd}>
          <CIcon name="cil-cart" />&nbsp;<FormattedMessage id="search.modal.add" /></CartButton>
      </CModalFooter>}
    </CModal>
  )

}


const mapStateToProps = state => ({
  cart: state.cart.cart,
  categoryMap: state.search.categoryMap,
})
const mapDispatchToProps = dispatch => ({
  addToCart: item => dispatch({
    type: 'addIntoCart',
    payload: item
  })
})

export default connect(mapStateToProps, mapDispatchToProps)(SoftwareInfoModal)
