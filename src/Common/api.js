import { CallApiFunc } from "../Common/commonMethod";
import { CallSmartIt } from "./CallSmartIt";
import { ALL } from "../constants/common";

const doLogTransitionOfRoute = ({ fullUrl, queryString, refererPage }) => {
  return CallApiFunc(
    "GET",
    `/logPageAccess?fullUrl=${fullUrl}&queryString=${queryString}&referPage=${refererPage}`,
    {},
    {}
  );
};

const getCurrentUser = () => {
  return CallApiFunc("GET", `/users/current`);
};

const getAllInstalled = ({ pageNum, pageSize, sourceSystem }) => {
  return CallApiFunc(
    "GET",
    `/users/installedPage`,
    {},
    { pageNum, pageSize, sourceSystem }
  );
};

const getAllRequests = ({
  pageNum,
  pageSize,
  applicant,
  applicantId,
  formStatus,
  formType,
}) => {
  return CallApiFunc(
    "GET",
    `/users/request`,
    {},
    { pageNum, pageSize, applicant, applicantId, formStatus, formType }
  );
};

const addUserToRtc = ({ id, userId }) => {
  return CallApiFunc(
    "POST",
    `/groups/add/` + userId + `?taskId=` + id,
    {},
    null,
    true
  );
};

const getCatalogItems = ({ id }) => {
  return CallApiFunc("GET", `/catalogItems/` + id);
};

const getCategories = () => {
  return CallApiFunc("GET", `/categories/list`);
};

const getSuggestList = ({ q }) => {
  return CallApiFunc("GET", `/suggest`, {}, { q });
};

const searchSoftware = ({
  areaSelected,
  q,
  catId,
  functionId,
  componentTypeId,
  domainId,
  pageNum,
  pageSize,
  brandId,
  isPublic,
  isAvailable,
}) => {
  return CallApiFunc(
    "GET",
    `/search`,
    {},
    {
      areaSelected,
      q,
      catId,
      functionId,
      brandId,
      componentTypeId,
      domainId,
      pageNum,
      pageSize,
      isPublic,
      isAvailable,
    }
  );
};

const getProcessList = () => {
  return CallApiFunc("GET", `/list`, {}, null, true);
};

const doProcessStart = () => {
  return CallApiFunc("POST", `/start`, {}, null, true);
};

const getTask = ({ id }) => {
  return CallApiFunc("GET", `/status?processInstanceId=` + id, {}, null, true);
};

const doProcessComplete = ({ id }) => {
  return CallApiFunc("POST", `/complete?taskId=` + id, {}, null, true);
};

const doProcessGrant = ({
  paName,
  paId,
  teamName,
  teamId,
  member,
  roleName,
  roleId,
  taskId,
}) => {
  return CallApiFunc(
    "POST",
    "/grant",
    {},
    { paName, paId, teamName, teamId, member, roleName, roleId, taskId },
    true
  );
};

const getPaList = ({ id }) => {
  return CallApiFunc("GET", "/pa/" + id, {}, null, true);
};

const getTeamList = ({ id }) => {
  return CallApiFunc("GET", "/team/" + id, {}, null, true);
};

const getRoleList = () => {
  return CallApiFunc("GET", "/roles", {}, null, true);
};

const getFilterItems = ({ q, catId, brandId, isPublic, isAvailable }) => {
  return CallApiFunc(
    "GET",
    "/filterItems",
    {},
    { q, catId, brandId, isPublic, isAvailable }
  );
};

const addCartItem = ({
  assetId,
  brand,
  categoryId,
  categoryName,
  graph,
  id,
  isAvailable,
  refUrl,
  referenceCurrency,
  referencePrice,
  sku,
  softwareDesc,
  softwareName,
  sourceId,
  sourceName,
  userId,
  version,
}) => {
  return CallApiFunc(
    "POST",
    "/cartItems",
    {},
    {
      assetId,
      brand,
      categoryId,
      categoryName,
      graph,
      id,
      isAvailable,
      refUrl,
      referenceCurrency,
      referencePrice,
      sku,
      softwareDesc,
      softwareName,
      sourceId,
      sourceName,
      userId,
      version,
    },
    null
  );
};

const deleteCartItem = ({ id }) => {
  return CallApiFunc("POST", `/cartItems/${id}`);
};

const getdCartItem = ({ id }) => {
  return CallApiFunc("GET", `/cartItems/${id}`);
};

const countCartItem = () => {
  return CallApiFunc("GET", "/cartItems/count");
};

const getCartItemList = () => {
  return CallApiFunc("GET", "/cartItems/list");
};

const sendInstallRequest = ({
  applicant,
  empCode,
  items,
  language,
  reason,
  sendInstallApplicationCategory,
}) => {
  if (sendInstallApplicationCategory === "commercial") {
    return CallApiFunc(
      "POST",
      `/install/start`,
      {},
      { applicant, empCode, items, language, reason },
      true
    );
  } else if (sendInstallApplicationCategory === "freeware") {
    return CallApiFunc(
      "POST",
      `/freeware/install/start`,
      {},
      { applicant, empCode, items, language, reason },
    );
  }
};

const sendUninstallRequest = ({
  applicant,
  empCode,
  items,
  language,
  reason,
}) => {
  return CallApiFunc(
    "POST",
    `/unInstall/start`,
    {},
    { applicant, empCode, items, language, reason },
    true
  );
};

// permission
const getPermissionList = ({ keyWord, pageNum, pageSize, sidx, order }) => {
  return CallApiFunc(
    "GET",
    "/permission/list",
    {},
    { keyWord, pageNum, pageSize, sidx, order }
  );
};

const queryPermissionRole = () => {
  return CallApiFunc("GET", "/permission/roles");
};
const queryPermissionFunction = () => {
  return CallApiFunc("GET", "/permission/functions");
};

const queryPermissionDashboardData = (adaccount) => {
  return CallApiFunc("GET", "/users/dashboard/privilege",{},{adaccount});
};

const doUpdatePermissionRole = ({
  account,
  empCode,
  fullName,
  remark,
  roles,
  userId,
}) => {
  return CallApiFunc(
    "POST",
    `/permission/updateRole`,
    {},
    { account, empCode, fullName, remark, roles, userId }
  );
};

const queryPermissionUser = ({ keyWord }) => {
  return CallApiFunc("GET", "/permission/user", {}, { keyWord });
};

// vip
const getVipList = ({ keyWord, pageNum, pageSize, sidx, order }) => {
  return CallApiFunc(
    "GET",
    "/permission/vip/list",
    {},
    { keyWord, pageNum, pageSize, sidx, order }
  );
};

const getSiteByCode = ({ factoryCode }) => {
  return CallApiFunc("GET", `/sdp/siteConfig/${factoryCode}`);
};

const getSiteList = ({ keyWord, pageNum, pageSize, sidx, order }) => {
  return CallApiFunc(
    "GET",
    "/sdp/siteConfig/list",
    {},
    { keyWord, pageNum, pageSize, sidx, order }
  );
};

const doUpdateVip = ({
  agentEmpCode,
  agentId,
  enabled,
  userEmpCode,
  userId,
}) => {
  return CallApiFunc(
    "POST",
    `/permission/vip/update`,
    {},
    { agentEmpCode, agentId, enabled, userEmpCode, userId }
  );
};

const doUpdateSite = ({
  groupName,
  factoryCode,
  sdpSite,
  technician,
  sdpArea,
}) => {
  return CallApiFunc(
    "POST",
    `/sdp/siteConfig/modify`,
    {},
    { groupName, factoryCode, sdpSite, technician, sdpArea }
  );
};

const deleteSiteBySiteCode = ({ factoryCode }) => {
  return CallApiFunc("POST", `/sdp/siteConfig/del/${factoryCode}`);
};

// e-form
const queryInstallRecords = ({
  areaIds,
  bgIds,
  brandIds,
  buIds,
  costCenters,
  endDate,
  pageNum,
  pageSize,
  startDate,
  type,
}) => {
  return CallApiFunc(
    "POST",
    `/records/list`,
    {},
    {
      areaIds,
      bgIds,
      brandIds,
      buIds,
      costCenters,
      endDate,
      pageNum,
      pageSize,
      startDate,
      type,
    }
  );
};

// filters
const getAreaByIds = ({ areaIds }) => {
  return CallApiFunc("GET", "/area/list", {}, { areaIds });
};
const getBgByIds = ({ bgIds }) => {
  return CallApiFunc("GET", "/bg/list", {}, { bgIds });
};
const getBrandByIds = ({ brandIds }) => {
  return CallApiFunc("GET", "/brand/list", {}, { brandIds });
};

const getTrialwareBrand = () => {
  return CallApiFunc(
    "GET",
    "/trailwareinstallationpath/trialwareBrand",
    {},
    null
  );
};

const getBuByIds = ({ buIds }) => {
  return CallApiFunc("GET", "/bu/list", {}, { buIds });
};
const getCostDept = ({ costDeptCodes }) => {
  return CallApiFunc("GET", "/costDept/list", {}, { costDeptCodes });
};
const getStatus = ({ isProcessing }) => {
  return CallApiFunc("GET", "/status/list", {}, { isProcessing });
};

const getSWRoles = () => {
  return CallApiFunc("GET", "/swcollection/getRoles");
};

// update software info
const updateSoftwareInfo = ({
  assetId,
  graph,
  assetRefUrlEN,
  assetRefUrlTC,
  assetDescTC,
  assetDescEN,
  mainFlag,
  mainSoftDetailList,
}) => {
  return CallApiFunc(
    "POST",
    "/assets/update",
    {},
    {
      assetId,
      graph,
      assetRefUrlEN,
      assetRefUrlTC,
      assetDescTC,
      assetDescEN,
      mainFlag,
      mainSoftDetailList,
    }
  );
};

// image
const uploadImage = (image) => {
  return CallApiFunc(
    "POST",
    "/image/upload",
    { headers: { "Content-Type": "multipart/form-data" } },
    image
  );
};

// stockId suggestion
const suggestStockId = ({ input, catId }) => {
  if (!catId) {
    catId = 5;
  }
  return CallApiFunc("GET", "/assets/stockId/list", {}, { input, catId });
};

// installation path
const getDetail = ({ id }) => {
  return CallApiFunc("GET", `/installationPath/${id}`);
};

const deleteInstallationPath = ({ id }) => {
  return CallApiFunc("POST", `/installationPath/${id}`);
};

const createInstallationPath = ({
  areaId,
  assetId,
  id,
  installationMethod,
  installationPath,
  licensesSn,
  modifiedEmpCode,
  category,
}) => {
  return CallApiFunc(
    "POST",
    `/installationPath/add`,
    {},
    {
      areaId,
      assetId,
      id,
      installationMethod,
      installationPath,
      licensesSn,
      modifiedEmpCode,
      catId: category,
    }
  );
};

const listInstallationPath = ({
  pageNum,
  pageSize,
  area,
  brandIds,
  catId,
  category,
}) => {
  if (category) {
    catId = category;
  }
  let param = { pageNum, pageSize, area, brandIds, catId };
  if (area === "ALL") {
    delete param.area;
  }
  if (brandIds === "_all") {
    delete param.brandIds;
  }
  return CallApiFunc("GET", `/installationPath/list`, {}, param);
};

const updateInstallationPath = ({
  areaId,
  assetId,
  id,
  installationMethod,
  installationPath,
  licensesSn,
  modifiedEmpCode,
  category,
}) => {
  return CallApiFunc(
    "POST",
    `/installationPath/update`,
    {},
    {
      areaId,
      assetId,
      id,
      installationMethod,
      installationPath,
      licensesSn,
      modifiedEmpCode,
      catId: category,
    }
  );
};

const listTrialWareInstallationPath = ({
  pageNum,
  pageSize,
  brands,
  regions,
}) => {
  return CallApiFunc(
    "GET",
    `/trailwareinstallationpath/list`,
    {},
    { pageNum, pageSize, brands, regions }
  );
};

const deleteTrialWare = ({ id }) => {
  return CallApiFunc("POST", `/trailwareinstallationpath/${id}`);
};

const createTrialWare = ({
  approvalInfo,
  brand,
  effectiveDate,
  id,
  installationMethod,
  installationPath,
  licensesSn,
  model,
  productName,
  regionArea,
  sdpId,
  modifiedEmpCode,
}) => {
  return CallApiFunc(
    "POST",
    `/trailwareinstallationpath/add`,
    {},
    {
      approvalInfo,
      brand,
      effectiveDate,
      id,
      installationMethod,
      installationPath,
      licensesSn,
      model,
      productName,
      regionArea,
      sdpId,
      modifiedEmpCode,
    }
  );
};

const updateTrialWare = ({
  approvalInfo,
  brand,
  effectiveDate,
  id,
  installationMethod,
  installationPath,
  licensesSn,
  model,
  productName,
  regionArea,
  sdpId,
  modifiedEmpCode,
}) => {
  return CallApiFunc(
    "POST",
    `/trailwareinstallationpath/update`,
    {},
    {
      approvalInfo,
      brand,
      effectiveDate,
      id,
      installationMethod,
      installationPath,
      licensesSn,
      model,
      productName,
      regionArea,
      sdpId,
      modifiedEmpCode,
    }
  );
};

// ongoing
const getAllForm = ({
  areaIds,
  brandIds,
  buIds,
  costCenters,
  endDate,
  pageNum,
  pageSize,
  processing,
  startDate,
  status,
  type,
}) => {
  return CallApiFunc(
    "POST",
    `/forms/list`,
    {},
    {
      areaIds,
      brandIds,
      buIds,
      costCenters,
      endDate,
      pageNum,
      pageSize,
      processing,
      startDate,
      status,
      type,
    }
  );
};
// {
//   "areaIds": [
//     "string"
//   ],
//   "brandIds": [
//     0
//   ],
//   "buIds": [
//     0
//   ],
//   "costCenters": [
//     "string"
//   ],
//   "endDate": "2022-01-18T06:48:56.145Z",
//   "pageNum": 0,
//   "pageSize": 0,
//   "startDate": "2022-01-18T06:48:56.146Z",
//   "status": [
//     "string"
//   ],
//   "type": "string"
// }
const getAllCategoryInfo = () => {
  return CallApiFunc("GET", `/category/list`, {}, {});
};

const verifyCostCenter = ({ costCenterNumber }) => {
  return CallApiFunc(
    "GET",
    `/verifyCostCenterNumber`,
    {},
    { costCenterNumber }
  );
};

// SDP
const getManualList = ({
  pageNum,
  pageSize,
  keyword,
  applicationRangeE,
  applicationRangeS,
  formType,
}) => {
  return CallApiFunc(
    "GET",
    `/sdp/manualList`,
    {},
    {
      pageNum,
      pageSize,
      keyword,
      applicationRangeE,
      applicationRangeS,
      formType,
    }
  );
};

const saveSdpInfo = ({
  fromTypey,
  sdpAgent,
  sdpApplicant,
  sdpArea,
  sdpBg,
  sdpFloor,
  sdpLocation,
  sdpMemo,
  sdpSubject,
  subId,
}) => {
  return CallApiFunc(
    "POST",
    `/sdp/saveSdpInfo`,
    {},
    {
      fromTypey,
      sdpAgent,
      sdpApplicant,
      sdpArea,
      sdpBg,
      sdpFloor,
      sdpLocation,
      sdpMemo,
      sdpSubject,
      subId,
    }
  );
};

const getUnprocessedList = ({
  pageNum,
  pageSize,
  keyword,
  areaId,
  applicationRangeE,
  applicationRangeS,
  formType,
  isClosedAll,
}) => {
  return CallApiFunc(
    "GET",
    `/sdp/getUnprocessedList`,
    {},
    {
      pageNum,
      pageSize,
      keyword,
      areaId,
      applicationRangeE,
      applicationRangeS,
      formType,
      isClosedAll,
    }
  );
};

const saveUnprocessedNote = ({ noteContent, subId }) => {
  return CallApiFunc(
    "POST",
    `/sdp/saveUnprocessedNote`,
    {},
    { noteContent, subId }
  );
};

const getProcessedList = ({
  pageNum,
  pageSize,
  keyword,
  areaId,
  applicationRangeE,
  applicationRangeS,
  formType,
  isClosedAll,
}) => {
  return CallApiFunc(
    "GET",
    `/sdp/getProcessedList`,
    {},
    {
      pageNum,
      pageSize,
      keyword,
      areaId,
      applicationRangeE,
      applicationRangeS,
      formType,
      isClosedAll,
    }
  );
};

const createSdp = ({ subIds }) => {
  return CallApiFunc("POST", `/sdp/createSdp`, {}, { subIds });
};

const updateSdpFromExternal = ({
  applicantEmpCode,
  applyComputer,
  caseId,
  formId,
  lastUpdateDate,
  sdpResolution,
  sdpTechnician,
  status,
  stockId,
}) => {
  return CallApiFunc(
    "POST",
    `/sdp/updateSdpFromExternal`,
    {},
    {
      applicantEmpCode,
      applyComputer,
      caseId,
      formId,
      lastUpdateDate,
      sdpResolution,
      sdpTechnician,
      status,
      stockId,
    }
  );
};

const bindSDP = ({ subId, caseId }) => {
  return CallApiFunc("GET", `/sdp/bindSdp/${subId}/${caseId}`);
};
const getArea = () => {
  return CallApiFunc("GET", `/sdp/getArea`, {}, {});
};

const getCostCenterAreaList = () =>
  CallApiFunc("GET", "/swcollection/area/list");

const getCostCenterBgBuList = () =>
  CallApiFunc("GET", "/swcollection/bg-bu/list");

const getSwCollectionOrgMgtList = ({
  year,
  areaId = "",
  bgId = "",
  buId = "",
  costCenter = "",
  pageNumber,
  pageSize,
  sort,
}) => {
  const _areaId = areaId === ALL ? "" : areaId;
  const _bgId = bgId === ALL ? "" : bgId;
  const _buId = buId === ALL ? "" : buId;
  return CallApiFunc(
    "GET",
    "/swcollection/list",
    {},
    {
      year,
      areaId: _areaId,
      bgId: _bgId,
      buId: _buId,
      costCenter,
      pageNumber,
      pageSize,
      sort,
      ["un-page"]: false,
    }
  );
};

const exportSwCollectionOrgMgtExcel = (year) =>
  CallApiFunc("GET", "/swcollection/export", {}, year);

// TODO: 是否测试, 多個 test 參數 (代訂)
const uploadSwCollectionOrgMgtExcel = ({ year, file }) => {
  const formData = new FormData();
  formData.append("year", year);
  formData.append("file", file);
  return CallApiFunc("POST", "/swcollection/upload", {}, formData);
};

const uploadSwAuthorityMgtExcel = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return CallApiFunc(
    "POST",
    "/swcollection/authority/import/excel",
    {},
    formData
  );
};

const getOrgStatus = () => {
  return CallApiFunc("POST", "/swcollection/message", {}, {});
};

const getSWBg = ({ userFlag }) => {
  return CallApiFunc(
    "GET",
    "/swcollection/getSWCollectionOrgBg",
    {},
    { userFlag }
  );
};

const getSWBu = ({ bgId, userFlag }) => {
  return CallApiFunc(
    "GET",
    "/swcollection/getSWCollectionOrgBu",
    {},
    { bgId, userFlag }
  );
};

const getSWCostCenter = ({ keyword, userFlag }) => {
  return CallApiFunc(
    "GET",
    "/swcollection/getSWCollectionOrgCostCenter",
    {},
    { keywork: keyword, userFlag: userFlag }
  );
};

const getSWBrandList = () => {
  return CallApiFunc("GET", "/sdp/brand", {}, null);
};

const getNewSWBrandList = () => {
  return CallApiFunc("GET", "/sw-collection/brand", {}, null);
};

const getSWAssetList = ({
  brandId,
  swCollectionBrandId,
  stockId,
  sourceSystemId,
  status,
}) => {
  if (brandId) {
    return CallApiFunc(
      "GET",
      "/sdp/asset",
      {},
      { brandId, stockId, sourceSystemId, status }
    );
  } else {
    return CallApiFunc(
      "GET",
      "/sdp/asset",
      {},
      { swCollectionBrandId, stockId, sourceSystemId, status }
    );
  }
};

const getFreewarereveiver = (params) => {
  return CallApiFunc(
    "GET",
    "/freeware/freeware-review/list",
    {},
    {
      ...params,
      sort: null,
      "un-page": false,
    }
  );
};

const saveFreewareReviewNote = (data) => {
  return CallApiFunc("POST", "/freeware/freeware-review/review-note", {}, data);
};
const editFreewareReview = (data) => {
  return CallApiFunc(
    "POST",
    `/freeware/freeware-review/save?formId=${data.formId}`,
    {},
    data
  );
};
const getSWSoftwareInfoList = ({
  brandId,
  swCollectionBrandId,
  keyword,
  page,
  size,
  sort,
  sourceSystemId,
  year,
  isUnPaged,
  status,
}) => {
  // 由於API設計問題，brandId，swCollectionBrandId不能同時存在。如果改變brandId會影響下拉框，所以只能在這裡處理
  let b = null;
  if (brandId) {
    if (brandId.toString().length > 6) {
      b = null;
    } else {
      b = brandId;
    }
  }
  return CallApiFunc(
    "GET",
    "/sdp/get-software-info",
    {},
    {
      brandId: b,
      swCollectionBrandId,
      keyword,
      page,
      size,
      sort,
      sourceSystemId,
      year,
      isUnPaged,
      status,
    }
  );
};

const updateSWSoftwareInfo = ({
  assetId,
  brandId,
  swCollectionBrandId,
  mainFlag,
  mainSoftDetail,
  oldSoftDetail,
  productName,
  referenceCurrency,
  referencePrice,
  type,
  status,
  swCollectionNewSWId,
}) => {
  let bId = brandId;
  if (brandId) {
    if (brandId.toString().length > 6) {
      bId = null;
    }
  }
  return CallApiFunc(
    "POST",
    "/sdp/update-software-info",
    {},
    {
      assetId,
      brandId: bId,
      swCollectionBrandId,
      mainFlag,
      mainSoftDetail,
      oldSoftDetail,
      productName,
      referenceCurrency,
      referencePrice,
      type,
      status,
      swCollectionNewSWId,
    }
  );
};

// const getAuthorityList = ({ pageNum, pageSize, keyword }) => {
//   let param;
//   if (keyword) {
//     param = { pageNum, pageSize, keyword };
//   } else {
//     param = { pageNum, pageSize };
//   }
//   return CallApiFunc("GET", "/swcollection/authority", {}, param);
// };

const getAuthorityNewList = ({
  bg = "",
  bu = "",
  costCenter = "",
  role,
  keyword,
  pageNum,
  pageSize,
}) => {
  const _bg = bg === ALL ? "" : bg;
  const _bu = bu === ALL ? "" : bu;
  const page = pageNum + 1;
  const _keyword = keyword ?? "";
  const _role = role === ALL ? "" : role;
  return CallApiFunc(
    "GET",
    "/swcollection/authority",
    {},
    {
      bg: _bg,
      bu: _bu,
      costCenter,
      role: _role,
      keyword: _keyword,
      pageNum: page,
      pageSize,
    }
  );
};

const getExportAuthorityNewList = ({ pageSize }) => {
  return CallApiFunc("GET", "/swcollection/authority", {}, { pageSize });
};

const addAuthorityBy = (payload) => {
  return CallApiFunc("POST", "/swcollection/authority", {}, payload.payload);
};

const deleteAuthorityById = ({ id }) => {
  return CallApiFunc(
    "DELETE",
    "/swcollection/authority/delete?id=" + id,
    {},
    null
  );
};

const getReportList = ({
  bg,
  bu,
  costCenter,
  brand,
  year,
  keyword,
  pageNum,
  pageSize,
  userFlag,
}) => {
  let params = {
    bg,
    bu,
    costCenter,
    brand,
    year,
    keyword,
    pageNum,
    pageSize,
    userFlag,
  };
  Object.keys(params).map((key) =>
    params[key] === "" || params[key] === -1 || params[key] === "_all"
      ? delete params[key]
      : ""
  );
  return CallApiFunc("GET", "/report/getReportList", {}, params);
};

const exportReportExcel = ({
  bg,
  bu,
  costCenter,
  brand,
  year,
  keyword,
  userFlag,
}) => {
  let params = { bg, bu, costCenter, brand, year, keyword, userFlag };
  Object.keys(params).map((key) =>
    params[key] === "" || params[key] === -1 || params[key] === "_all"
      ? delete params[key]
      : ""
  );
  return CallApiFunc("GET", "/report/getReportList", {}, params);
};

const getYearPlanList = () => {
  return CallApiFunc("GET", "/sw-collection/plan/list", {}, {});
};
const getYearPlanDetail = ({
  bgId,
  brandId,
  buId,
  planId,
  productName,
  swCollectionNewSWId,
  assetId,
}) => {
  return CallApiFunc(
    "POST",
    "/sw-collection/detail",
    {},
    { bgId, brandId, buId, planId, productName, swCollectionNewSWId, assetId }
  );
};
const updateYearPlan = ({
  assetId,
  bgId,
  bgName,
  brandId,
  buId,
  buName,
  budgetCount,
  costCenterCode,
  installedCount,
  sourceSystemId,
  swCollectionId,
  differenceCount,
}) => {
  return CallApiFunc(
    "POST",
    "/sw-collection/upsert",
    {},
    {
      assetId,
      bgId,
      bgName,
      brandId,
      buId,
      buName,
      budgetCount,
      costCenterCode,
      installedCount,
      sourceSystemId,
      swCollectionId,
      differenceCount,
    }
  );
};

const getYearSwCollectionDetail = ({
  brandId,
  planId,
  swCollectionNewSWId,
  costCenterCode,
  assetId,
}) => {
  let newId = swCollectionNewSWId;
  let aId = assetId;
  if (assetId.toString().length > 6) {
    newId = assetId;
    aId = null;
  }
  return CallApiFunc(
    "POST",
    "/sw-collection/detail",
    {},
    {
      brandId,
      planId,
      swCollectionNewSWId: newId,
      costCenterCode,
      assetId: aId,
    }
  );
};

const uploadYearPlan = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return CallApiFunc("POST", "/sw-collection/upload", {}, formData);
};
const deleteSwCollection = ({ swCollectionId }) => {
  return CallApiFunc(
    "POST",
    "/sw-collection/delete?swCollectionId=" + swCollectionId,
    {},
    null
  );
};
const getFirstSwCollection = () => {
  return CallApiFunc("GET", "/sw-collection/first-system-swcollection", {}, {});
};
const isAddOrUploadSW = () => {
  return CallApiFunc("GET", "/sw-collection/is-swcollection-upsert", {}, {});
};
const getCostcenterAndBgBu = ({ keyword }) => {
  return CallApiFunc(
    "GET",
    "//swcollection/getBgBuByCostCenterWithPrivaleg",
    {},
    { keyword }
  );
};

// SAM function mgt
const getFunctionList = () => {
  return CallApiFunc("GET", "/webFunction/list");
};

const getFunctionItemById = ({ id }) => {
  return CallApiFunc("GET", "/webFunction/get", {}, { functionKey: id });
};

const postFunctionItem = ({
  id,
  parentId,
  level,
  fucntionCode,
  functionName,
  functionDesc,
  management,
  userEnable,
  areaDTOS,
}) => {
  return CallApiFunc(
    "POST",
    "/webFunction/addOrUpdate",
    {},
    {
      id,
      parentId,
      level,
      fucntionCode,
      functionName,
      functionDesc,
      management,
      userEnable,
      areaDTOS,
    }
  );
};

// Tool of switching to different user
const getNewUserToken = ({ id, type }) => {
  return CallApiFunc("GET", `/switchUser`, {}, { id, type });
};

const getFreewareList = ({
  brandList,
  isValid,
  keyword,
  listType,
  pageNum,
  pageSize,
  sort,
  unPage,
}) => {
  const _brandList = brandList !== null ? brandList.join(",") : brandList;
  return CallApiFunc(
    "GET",
    `/freeware/list`,
    {},
    {
      brandList: _brandList,
      isValid,
      keyword,
      listType,
      pageNum,
      pageSize,
      sort,
      unPage,
    }
  );
};
const getFreewareBrand = () => {
  return CallApiFunc("GET", `/freeware/getFreewareBrand`);
};
const deleteFreeware = ({ assetId }) => {
  return CallApiFunc("DELETE", "/freeware/delete?assetId=" + assetId, {}, {});
};
const addFreeware = ({
  applyType,
  brand,
  graph,
  categoryList,
  description,
  descriptionEN,
  edition,
  installType,
  listType,
  reason,
  remark,
  softwareName,
  sourceURL,
  valid,
  version,
}) => {
  return CallApiFunc(
    "POST",
    `/freeware/save`,
    {},
    {
      applyType,
      assetId: null,
      graph,
      brand,
      categoryList,
      description,
      descriptionEN,
      edition,
      installType,
      listType,
      reason,
      remark,
      softwareName,
      sourceURL,
      valid,
      version,
    }
  );
};
const getFreewareCategory = ({}) => {
  return CallApiFunc("GET", `/freeware/product_family`);
};
const addFreewareBrand = ({ brandName }) => {
  return CallApiFunc(
    "POST",
    `/freeware/addBrand`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
    brandName
  );
};
const updateFreeware = ({
  applyType,
  assetId,
  graph,
  brand,
  categoryList,
  description,
  descriptionEN,
  edition,
  installType,
  listType,
  reason,
  remark,
  softwareName,
  sourceURL,
  valid,
  version,
}) => {
  return CallApiFunc(
    "PUT",
    `/freeware/update`,
    {},
    {
      applyType,
      assetId,
      graph,
      brand,
      categoryList,
      description,
      descriptionEN,
      edition,
      installType,
      listType,
      reason,
      remark,
      softwareName,
      sourceURL,
      valid,
      version,
    }
  );
};

const getEFormList = ({ pageNum, pageSize, sort, unPage }) => {
  return CallApiFunc(
    "GET",
    "/monitor/sdp",
    {},
    { pageNum, pageSize, sort, unPage }
  );
};
const queryApplyName = ({ applyName }) => {
  return CallApiFunc(
    "GET",
    "/freeware/freeware-review/freeware-name",
    {},
    { applyName }
  );
};
const queryBrand = (data) => {
  return CallApiFunc("GET", "/freeware/getFreewareBrand", {}, {brandName:data.brandName});
};
const getQueryOrDownloadList = ({
  year,
  bg = "",
  bu = "",
  costCenter = "",
  brand,
  productName,
  keyword,
  pageNum,
  pageSize,
  userFlag,
}) => {
  const _bg = bg === ALL ? "" : bg;
  const _bu = bu === ALL ? "" : bu;
  return CallApiFunc(
    "GET",
    "/report/getReportList",
    {},
    {
      year,
      bg: _bg,
      bu: _bu,
      costCenter,
      brand,
      productName,
      pageNum,
      pageSize,
      userFlag,
      keyword,
    }
  );
};

export default {
  doLogTransitionOfRoute,
  getCurrentUser,
  getAllInstalled,
  getAllRequests,
  addUserToRtc,
  getCatalogItems,
  getCategories,
  getSuggestList,
  searchSoftware,
  getProcessList,
  doProcessStart,
  getTask,
  doProcessComplete,
  doProcessGrant,
  getPaList,
  getTeamList,
  getRoleList,
  getFilterItems,
  addCartItem,
  deleteCartItem,
  getdCartItem,
  countCartItem,
  getCartItemList,
  sendInstallRequest,
  sendUninstallRequest,
  // getDDMAeinfo,

  getPermissionList,
  queryPermissionRole,
  doUpdatePermissionRole,
  queryPermissionUser,
  queryPermissionFunction,

  queryPermissionDashboardData,

  getVipList,
  getSiteByCode,
  getSiteList,
  doUpdateVip,
  doUpdateSite,
  deleteSiteBySiteCode,

  queryInstallRecords,

  getAreaByIds,
  getBgByIds,
  getBrandByIds,
  getTrialwareBrand,
  getBuByIds,
  getCostDept,
  getStatus,
  getSWRoles,

  updateSoftwareInfo,

  uploadImage,

  suggestStockId,

  getDetail,
  deleteInstallationPath,
  createInstallationPath,
  listInstallationPath,
  updateInstallationPath,
  getAllForm,
  listTrialWareInstallationPath,
  deleteTrialWare,
  createTrialWare,
  updateTrialWare,
  getAllCategoryInfo,
  verifyCostCenter,

  getManualList,
  saveSdpInfo,
  getUnprocessedList,
  saveUnprocessedNote,
  getProcessedList,
  createSdp,
  updateSdpFromExternal,
  bindSDP,
  getArea,

  getSWBg,
  getSWBu,
  getSWCostCenter,
  getSWBrandList,
  getNewSWBrandList,
  getSWAssetList,
  getSWSoftwareInfoList,
  updateSWSoftwareInfo,

  getFreewarereveiver,
  queryApplyName,
  queryBrand,
  saveFreewareReviewNote,
  editFreewareReview,
  getOrgStatus,

  getAuthorityNewList,
  getExportAuthorityNewList,
  addAuthorityBy,
  deleteAuthorityById,

  getReportList,
  exportReportExcel,

  getYearPlanDetail,
  updateYearPlan,

  getYearSwCollectionDetail,
  uploadYearPlan,
  getYearPlanList,
  deleteSwCollection,
  getFirstSwCollection,
  getCostcenterAndBgBu,

  getFunctionList,
  getFunctionItemById,
  postFunctionItem,

  getNewUserToken,
  isAddOrUploadSW,
  getFreewareList,
  getFreewareBrand,
  deleteFreeware,
  addFreeware,
  getFreewareCategory,
  addFreewareBrand,
  updateFreeware,
  getEFormList,
  getSwCollectionOrgMgtList,
  exportSwCollectionOrgMgtExcel,
  uploadSwCollectionOrgMgtExcel,
  getCostCenterAreaList,
  getCostCenterBgBuList,
  uploadSwAuthorityMgtExcel,
  getQueryOrDownloadList,
};
