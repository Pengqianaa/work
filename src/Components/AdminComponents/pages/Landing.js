import {
  CContainer,
  CRow
} from '@coreui/react'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'


const Landing = props => {
  const { goToAdminPage } = props

  useEffect(() => {
    goToAdminPage(page => props.history.push(page))
  }, [])

  return (
    <CContainer>
      <CRow style={{ marginBottom: '20px' }}>
        {/* LANDING */}
      </CRow>
    </CContainer>
  )

}

const mapStateToProps = state => ({

})
const mapDispatchToProps = dispatch => ({
  goToAdminPage: goToFunc => dispatch({
    type: 'goToAdminPage',
    payload: goToFunc
  })
})

export default connect(mapStateToProps, mapDispatchToProps)(Landing)
