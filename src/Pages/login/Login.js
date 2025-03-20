import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CRow,
  CLink
} from '@coreui/react'

const Login = () => {
    return (
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="8">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm action="">
                      <h1>Login</h1>
                      <p className="text-muted">Single Sign ON</p>
                      <CRow>
                        <CCol xs="6">
                          <CLink href="https://samt.deltaww.com/portal/dologin.jsp">
                            <CButton color="primary" className="px-4">Login in Delta ADFS</CButton>
                          </CLink>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
}

export default Login
