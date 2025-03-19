import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CButton } from '@coreui/react'


const BlockButton = props => {
  let { onClick, className } = props
  let [ block, setBlock ] = useState(false)
  let isLoading = useSelector(state => state.view.isLoading)

  let onBtnClick = e => {
    
    if(block || isLoading){
      return
    }
    setBlock(true)
    onClick()
    setTimeout(()=>{
      setBlock(false)
    }, 1500)
  }
  useEffect(() => {
    if(!isLoading) { setBlock(false) }
  }, [isLoading])
  
  return <CButton style={{display: 'block'}} {...props} 
    className={className} 
    block={block || isLoading} 
    onClick={onBtnClick}
    disabled={props.disabled || block}
  >{props.children}
  </CButton>
}

export default BlockButton