import React, { useEffect, useState } from 'react'

import Api from '../../../Common/api'
import { backServerIP } from '../../../Common/common'
import LogoImage from '../../uiComponents/LogoImage'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';

const ImageUpload = props => {
  const { fileName, setFileName, refresh } = props

  const [picture, setPicture] = useState(null)
  const [imgData, setImgData] = useState(null)

  useEffect(() => {
    if (refresh) {
      setPicture(null)
      setImgData(null)
    }
  }, [refresh])

  const onChangePicture = e => {
    if (e.target.files[0]) {
      setPicture(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener("load", async () => {
        setImgData(reader.result)

        let data = new FormData()
        data.append('file', e.target.files[0])
        let res = await Api.uploadImage(data)
        if (res.data.data) { setFileName(res.data.data) }
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  return <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
    <LogoImage style={{ width: '80%' }} src={`${backServerIP}/image/show/${fileName}`}></LogoImage>
    <form id="myForm">
      <label htmlFor="image-upload" className="file-upload-button">
        <AddToPhotosIcon />
      </label>
      <input id="image-upload" name="data" type="file" onChange={onChangePicture}/>
    </form>
  </div>
}

export default ImageUpload