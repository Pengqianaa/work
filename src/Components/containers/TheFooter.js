import React from 'react'
import {
  CFooter
} from '@coreui/react'
import pjson from '../../../package.json'
import moment from 'moment'

const TheFooter = props => {
  
  return (
    <CFooter style={{ backgroundColor: '#B0B6BA', borderColor: 'rgba(255, 255, 255, 0)' }} fixed={false}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
          <span style={{ textAlign: 'center', color: '#fff'}}>&copy; { moment().format('YYYY') } Delta IT. All Rights Reserved. / version {pjson.version}</span>
      </div>  
    </CFooter>
  )
}

export default React.memo(TheFooter)
