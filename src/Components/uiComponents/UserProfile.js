import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton
} from '@coreui/react'
import '../../CSS/common.scss'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { showWithDefault } from '../../Common/common'

const ProfileWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`

const ProfileName = styled.div`
  margin: 8px 0;
  width: 30%;
  text-align: right;
`

const ProfileValue = styled.div`
  margin: 8px 0;
  padding-left: 8px; 
  width: 70%;
`

const ProfileClose = styled(CButton)`
  color: #00A0E9;
  font-weight: bold;
`

const UserProfile = (props) => {
  
  let user = useSelector(state => state.user.user) // userStore.getData().user
  let computerNames = useSelector(state => state.user.computerNames)
  computerNames = !!computerNames ? computerNames.join(', ') : '--'

  return (
    <CModal
      backdrop={false}
      show={props.show}
      onClosed={() => { props.toggleFunc(false) }}
    >
      <CModalHeader>
        <CModalTitle><FormattedMessage id={'userProfile.title'}/></CModalTitle>
      </CModalHeader>
      <CModalBody>
        <ProfileWrapper>
          <ProfileName><FormattedMessage id={'userProfile.name'}/> : </ProfileName><ProfileValue>{user.userName}</ProfileValue>
          <ProfileName><FormattedMessage id={'userProfile.organization'}/> : </ProfileName><ProfileValue>{user.department}</ProfileValue>
          <ProfileName><FormattedMessage id={'userProfile.phone'}/> : </ProfileName><ProfileValue>{showWithDefault(user.phone, '--')}</ProfileValue>
          <ProfileName><FormattedMessage id={'userProfile.computer'}/> : </ProfileName><ProfileValue>{computerNames}</ProfileValue>
        </ProfileWrapper>
      </CModalBody>
      <CModalFooter style={{ borderTop: '0px' }}>
        <ProfileClose onClick={() => { props.toggleFunc(false) }}><FormattedMessage id={'userProfile.close'}/></ProfileClose>
      </CModalFooter>
    </CModal>
  )

}

export default UserProfile

