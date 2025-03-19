import {
  CContainer,
  CRow
} from '@coreui/react'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { SDP_MGT_TABS, ADMIN_ROLES } from '../../../Common/constants'
import SdpManualTab from '../uiComponents/SdpManualTab'
import SdpProcessedTab from '../uiComponents/SdpProcessedTab'
import SdpUnprocessedTab from '../uiComponents/SdpUnprocessedTab'





const menuStyle =  {
  borderRadius: '3px',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
  background: 'rgba(255, 255, 255, 0.9)',
  padding: '2px 0',
  fontSize: '90%',
  position: 'fixed',
  overflow: 'auto',
  maxHeight: '100%',
  left: '15',
  top: '75',
  zIndex: '2000'
}

const AddButton = styled(Button)`
  background-color: #0087DC !important; 
  color: #fff !important;
  cursor: pointer !important;
  display: block;
`
const TableHeadContainer = styled.div`
  margin: 16px;
  display: flex;
  justify-content: space-between;
`


const SoftwareSdpMgt = props => {
  const { permissions } = props

  const isClientTeam = !!permissions && permissions.includes(ADMIN_ROLES.CLIENT_TEAM)
  
  const intl = useIntl()
  const [tab, setTab] = useState('1')

  const handleClickTab = (event, newValue) => {
    setTab(newValue)
  }

  return (
    <CContainer>
      <CRow style={{ marginBottom: '20px' }}>
        <h1><FormattedMessage id="softwaresdpmgt.title" /></h1>
      </CRow>
      <CRow>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <Tabs value={tab} onChange={handleClickTab} aria-label="simple tabs example">
              <Tab value={SDP_MGT_TABS.MANUAL} label={intl.formatMessage({ id: `softwaresdpmgt.tab1` })} />
              <Tab value={SDP_MGT_TABS.UNPROCESSED} label={intl.formatMessage({ id: `softwaresdpmgt.tab2` })} />
              <Tab value={SDP_MGT_TABS.PROCESSED} label={intl.formatMessage({ id: `softwaresdpmgt.tab3` })} />
            </Tabs>
        </div>
        {tab === SDP_MGT_TABS.MANUAL && <SdpManualTab isClientTeam={isClientTeam}></SdpManualTab>}
        {tab === SDP_MGT_TABS.UNPROCESSED && <SdpUnprocessedTab isClientTeam={isClientTeam}></SdpUnprocessedTab>}
        {tab === SDP_MGT_TABS.PROCESSED && <SdpProcessedTab isClientTeam={isClientTeam}></SdpProcessedTab>}
      </CRow>
    </CContainer>
  )

}

const mapStateToProps = state => ({
  permissions: state.user.permissionIds
  
})
const mapDispatchToProps = dispatch => ({
 
})

export default connect(mapStateToProps, mapDispatchToProps)(SoftwareSdpMgt)
