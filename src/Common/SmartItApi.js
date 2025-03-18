import { CallSmartIt } from './CallSmartIt'

const AuthenticationKey = process.env.REACT_APP_SMART_IT_AUTH_KEY 
const SCCM_TOKEN = process.env.REACT_APP_SCCM_TOKEN

// SCCM Info
const addSCCMInfo = ({ RegionArea, StockID, SCCMName, SCCMFolderPath, ModifiedBy, Modified }) => {
  return CallSmartIt('POST', '/sccm/Add', {}, { AuthenticationKey, RegionArea, StockID, SCCMName, SCCMFolderPath, ModifiedBy, Modified })
}
const getSCCMInfo = ({ regionArea, stockID }) => {
  return CallSmartIt('GET', '/sccm/Get', {}, { auth: AuthenticationKey, regionArea, stockID })
}
const querySCCMInfo = ({ RegionArea, StockID, SCCMName, SCCMFolderPath, Brand, ProductName,Category }) => {
  return CallSmartIt('POST', '/sccm/GetByCondition', {}, { AuthenticationKey, RegionArea, StockID, SCCMName, SCCMFolderPath, Brand, ProductName })
}
const editSCCMInfo = ({ RegionArea, StockID, SCCMName, SCCMFolderPath, ModifiedBy, Modified }) => {
  return CallSmartIt('POST', '/sccm/Edit', {}, { AuthenticationKey, RegionArea, StockID, SCCMName, SCCMFolderPath, ModifiedBy, Modified })
}
const deleteSCCMInfo = ({ regionArea, stockID }) => {
  return CallSmartIt('GET', '/sccm/Del', {}, { auth: AuthenticationKey, regionArea, stockID })
}

// License Info http
const addLicenseInfo = ({ RegionArea, StockID, ServerName, OPTFilePath, OPTFileIndexKey, ModifiedBy, Modified }) => {
  return CallSmartIt('POST', '/license/Add', {}, { AuthenticationKey, RegionArea, StockID, ServerName, OPTFilePath, OPTFileIndexKey, ModifiedBy, Modified })
}
const getLicenseInfo = ({ regionArea, stockID, serverName }) => {
  return CallSmartIt('GET', '/license/Get', {}, { auth: AuthenticationKey, regionArea, stockID, serverName })
}
const queryLicenseInfo = ({ RegionArea, StockID, ServerName, OPTFilePath, OPTFileIndexKey, Brand, ProductName }) => {
  return CallSmartIt('POST', '/license/GetByCondition', {}, { AuthenticationKey, RegionArea, StockID, ServerName, OPTFilePath, OPTFileIndexKey, Brand, ProductName  })
}
const editLicenseInfo = ({ RegionArea, StockID, ServerName, OPTFilePath, OPTFileIndexKey, ModifiedBy, Modified }) => {
  return CallSmartIt('POST', '/license/Edit', {}, { AuthenticationKey, RegionArea, StockID, ServerName, OPTFilePath, OPTFileIndexKey, ModifiedBy, Modified })
}
const deleteLicenseInfo = ({ regionArea, stockID, serverName }) => {
  return CallSmartIt('GET', '/license/Del', {}, { auth: AuthenticationKey, regionArea, stockID, serverName })
}


const getSystemsbyLastLoggedUser = ({ UserNtAccount }) => {
  return CallSmartIt('GET', '/sccmmw/SCCM/GetSystemsbyLastLoggedOnUserAsync', { 
    headers: { 
      'Authorization': `Basic ${SCCM_TOKEN}`
    }
  }, { UserNtAccount })
}



export default {
  addSCCMInfo,
  getSCCMInfo,
  querySCCMInfo,
  editSCCMInfo,
  deleteSCCMInfo,
  addLicenseInfo,
  getLicenseInfo,
  queryLicenseInfo,
  editLicenseInfo,
  deleteLicenseInfo,
  getSystemsbyLastLoggedUser
}
