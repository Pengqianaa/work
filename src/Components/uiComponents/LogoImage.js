import React, { useEffect, useState } from 'react'
import img from '../../assets/icons/DeltaAsset@4x.png'
import styled from 'styled-components'

const Img = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  height: auto;
`

export default props => {
  let { src } = props
  let [image, setImage] = useState(src)
  let onError = e => {
    setImage(img)
  }
  useEffect(() => {
    setImage(src)
  }, [src])
  return <Img {...props} src={image} onError={onError}></Img>
}