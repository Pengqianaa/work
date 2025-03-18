import CallSamApiFunc from "../utils/methods/CallSamApiFunc";

//CurrentUser Controller
//獲取當前user信息
const getCurrentUser = () => {
  return CallSamApiFunc("GET", `/current-user`);
};

//Login Controller
//獲取所有組織和租戶
const getOrgNTenantList = () => {
  return CallSamApiFunc("GET", `/login/org-tenant`);
}
//判斷當前user是否可以登錄
const checkUserLogin = ({ orgName, tenantName }) => {
  return CallSamApiFunc("GET", `/login/${orgName}/${tenantName}`);
};

//TaskInfo Controller 
//查询當前用戶 license申請單
const getTaskInfoList = ({  startDate, endDate, applicationStatus , page = 0, size = 10, sort = 'applyDate,DESC' }) => {
  const params = {
    page,
    size,
    sort
  };
  // 添加有值的参数
  // 检查 applicationStatus 是否既不为 null 也不为空数组
  if (applicationStatus && applicationStatus !== null) {
    params.applicationStatus = applicationStatus;
  }
  if (startDate) {
    params.startDate = startDate;
  }
  if (endDate) {
    params.endDate = endDate;
  }

  // 构建查询字符串
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return CallSamApiFunc("GET", `/task/search?${queryString}`);
};

//申請人釋放自己的license
const releaseTaskInfo = ({ id }) => {
  return CallSamApiFunc("POST", `/task/release/${id}`, {}, {});
};

//檢查當前申請人是否有已核准的單子
const checkTaskStatus = () => {
  return CallSamApiFunc("GET", `/task/check/application/status`);
};

//Permission Controller
//獲取當前用戶  
const findUser = ({ keyword }) => {
  return CallSamApiFunc("GET", `/permission/user/${keyword}`);
};
//獲取可選擇的role
const getPermissionRoleList = ({ isGlobal }) => {
  return CallSamApiFunc("GET", `/permission/role`);
};
//獲取用戶對應的菜單欄
const getPermissionMenu = ({ orgName }) => {
  return CallSamApiFunc("GET", `/permission/menu/${orgName}`);
};
//獲取user在對應Org下的userKey
const getPermissionUserKey = ({ orgName, userCode, userAccount }) => {
  return CallSamApiFunc("GET", `/permission/user/${orgName}/${userCode}/${userAccount}`);
};
//獲取用戶對應的菜單欄
const postPermissionUser = ({ orgName, userInfo }) => {
  return CallSamApiFunc("POST", `/permission/user/add-update/${orgName}`, {}, userInfo);
};
//展示用户<分global 和非global>
const getPermissionList = ({ orgName, isGlobal, page, size, sort = 'lastModified,DESC' }) => {
  return CallSamApiFunc("GET", `/permission/user/list/${isGlobal}/${orgName}?page=${page}&size=${size}&sort=${sort}`);
};
//删除用户及其角色
const deletePermission = ({ orgName, userInfo }) => {
  return CallSamApiFunc("DELETE", `/permission/user/delete/${orgName}`, {}, userInfo);
};

//Auto Approved Mgt Controller
//獲取OrgList
const getOrgList = ({ page = 0, size = 10, sort = 'lastModified,DESC' }) => {
  return CallSamApiFunc("GET", `/rpaOrg/getOrgList?page=${page}&size=${size}&sort=${sort}`);
};
//從API獲取Org數據
const getReloadOrgList = () => {
  return CallSamApiFunc("GET", `/rpaOrg/reloadOrgList`);
};
//根據RpaOrg ID查詢是否存在applicationStatus為To Be Confirmed
const isApplicationStatusExist = ({ rpaOrgId }) => {
  return CallSamApiFunc("GET", `rpaOrg/${rpaOrgId}/license-applications/statuses`);
};
//根據ID更新isAutoApproved屬性
const isAutoApproved = ({ id, flag }) => {
  return CallSamApiFunc("PUT", `/rpaOrg/${id}/isAutoApproved`, {}, flag);
};

//License Controller
//申請License
const applyLicense = ({ orgName, params }) => {
  return CallSamApiFunc("POST", `/license/apply/license/${orgName}`, {}, params);
};
//根據License ID獲取明細
const findLicenseById = ({ licenseId }) => {
  return CallSamApiFunc("GET", `/license/find/license/${licenseId}`);
};
//查找對應Org下的申請人
const findApplicantByOrg = ({ orgName }) => {
  return CallSamApiFunc("GET", `license/find/applicant/${orgName}`);
};
//判斷是否有對應數量license的api
const checkLicenseEnough = ({ orgName }) => {
  return CallSamApiFunc("GET", `license/check/license/${orgName}`);
};
//指派用戶授權 排程
const assignUserSchedule = ({ }) => {
  return CallSamApiFunc("GET", `/license/accountant/user/license`);
};

//License Controller LicenseMgt
//多条件查询 license申请单
const getLicenseList = ({ applicationStatus, startDate, endDate, keyword, orgName, page = 0, size = 10, sort = 'applyDate,DESC' }) => {
  const params = {
    page,
    size,
    sort
  };
  // 添加有值的参数
  // 检查 applicationStatus 是否既不为 null 也不为空数组
  if (applicationStatus && applicationStatus !== null) {
    params.applicationStatus = applicationStatus;
  }
  if (startDate) {
    params.startDate = startDate;
  }
  if (endDate) {
    params.endDate = endDate;
  }
  if (keyword) {
    params.keyword = keyword;
  }
  if (orgName) {
    params.orgName = orgName;
  }

  // 构建查询字符串
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return CallSamApiFunc("GET", `/license/search/license?${queryString}`);
};

//审核 License 申请单
const reviewLicense = ({ licenseApplicationId, reviewResult, reviewReason }) => {
  // {
  //   "licenseApplicationId": 0,
  //   "reviewResult": true,
  //   "reviewReason": "string"
  // }
  return CallSamApiFunc("POST", `/license/review/license`, {}, { licenseApplicationId, reviewResult, reviewReason });
};

//retry application
const retryLicense = ({ licenseApplicationId }) => {
  return CallSamApiFunc("POST", `/license/retry?licenseApplicationId=${licenseApplicationId}`, {}, {});
};

//提前释放release application
const releaseLicense = ({ licenseApplicationId, reason }) => {
  return CallSamApiFunc("POST", `/license/release?licenseApplicationId=${licenseApplicationId}&reason=${reason}`, {}, {});
};

//reloadLicenseUsage
const reloadLicenseUsage = ({ orgName }) => {
  return CallSamApiFunc("POST", `/license/usage/${orgName}/reload`, {}, {});
};

//getLicenseUsage
const getLicenseUsage = ({ orgName }) => {
  return CallSamApiFunc("GET", `/license/usage/${orgName}`);
};

export default {
  //CurrentUser Controller
  getCurrentUser,

  //Login Controller
  getOrgNTenantList,
  checkUserLogin,

  //Task Controller 
  getTaskInfoList,
  releaseTaskInfo,
  checkTaskStatus,

  //Permission Controller
  findUser,
  getPermissionRoleList,
  getPermissionMenu,
  getPermissionUserKey,
  postPermissionUser,
  getPermissionList,
  deletePermission,

  //Auto Approved Mgt Controller
  getOrgList,
  getReloadOrgList,
  isApplicationStatusExist,
  isAutoApproved,

  //License Controller
  applyLicense,
  findLicenseById,
  findApplicantByOrg,
  checkLicenseEnough,
  assignUserSchedule,
  //License Mgt
  getLicenseList,
  reviewLicense,
  retryLicense,
  releaseLicense,
  getLicenseUsage,
  reloadLicenseUsage,
};
