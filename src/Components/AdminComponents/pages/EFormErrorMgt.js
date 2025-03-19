import {
  CContainer,
  CRow
} from '@coreui/react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { connect } from 'react-redux'
import { TabContainer } from '../uiComponents/AdminCommonUis'
import EFormErrorTab from '../uiComponents/EFormErrorTab'

const EFormErrorMgt = props => {
  const intl = useIntl()
  const [currentTab, setCurrentTab] = useState('1')

  const handleClickTab = (event, newValue) => {
    setCurrentTab(newValue)
  }

  return <CContainer>
    <CRow style={{ marginBottom: '20px' }}>
      <h1><FormattedMessage id="eformerrormgt.title" /></h1>
    </CRow>
    <CRow>
      <TabContainer>
        <Tabs value={currentTab} onChange={handleClickTab} aria-label="simple tabs example">
          <Tab value={'1'} label={intl.formatMessage({ id: 'eformerrormgt.title' })} />
        </Tabs>
      </TabContainer>
      {currentTab === '1' && <EFormErrorTab></EFormErrorTab>}
    </CRow>
  </CContainer>
}

const mapStateToProps = state => ({

})
const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(EFormErrorMgt)
