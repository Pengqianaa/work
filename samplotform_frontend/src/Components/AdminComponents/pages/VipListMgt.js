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
import VipListMgtTab from '../uiComponents/VipListMgtTab'
import TechnicianMgtTab from '../uiComponents/TechnicianMgtTab'

const VipListMgt = props => {
  const intl = useIntl()
  const [currentTab, setCurrentTab] = useState('1')

  const handleClickTab = (event, newValue) => {
    setCurrentTab(newValue)
  }

  return <CContainer>
    <CRow style={{ marginBottom: '20px' }}>
      <h1><FormattedMessage id="peoplecontrolsetting.title" /></h1>
    </CRow>
    <CRow>
      <TabContainer>
        <Tabs value={currentTab} onChange={handleClickTab} aria-label="simple tabs example">
          <Tab value={'1'} label={intl.formatMessage({ id: 'vipmgt.title' })} />
          <Tab value={'2'} label={intl.formatMessage({ id: 'technicianmgt.title' })} />
        </Tabs>
      </TabContainer>
      {currentTab === '1' && <VipListMgtTab></VipListMgtTab>}
      {currentTab === '2' && <TechnicianMgtTab></TechnicianMgtTab>}
    </CRow>
  </CContainer>
}

const mapStateToProps = state => ({

})
const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(VipListMgt)
