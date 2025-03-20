import React from 'react'
import {
  CCol,
  CContainer,
  CRow
} from '@coreui/react'
import forbidden from '../../assets/images/forbidden.png'

const Page404 = function() {
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          
        </CRow>
        <CRow className="justify-content-center">
          <CCol md="4">
            <img src={forbidden}/>
          </CCol>
          <CCol md="6">
            <div className="clearfix">
              <h1 className="float-left display-3 mr-4">You{'\''}re not allowed to be here</h1>
              <h4 className="pt-3">The page you are looking for is forbidden.</h4>
              <p className="text-muted float-left"></p>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404
