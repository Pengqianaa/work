import Api from "../Common/api";
import SWReportApi from "src/api/admin/SWCollection/SWReportApi";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { Actions } from "src/constants/common";
import AdminTableFields from "../Common/AdminTableFields";

import { exportToExcel, generateTable } from "../Common/commonMethod";
const swInfoMaintainTabTabCols = [...AdminTableFields.SwInfoMaintainTabTabCols];

const initialState = {
  currentPage: 0,
  total: 0,
  pageSize: 10,
  totalPages: 0,

  viewRateList: [],
  swAuthorityPrevQuery: {},
  swAuthorityMgtList: [],
  exportSwAuthorityMgtList: [],
  swinfoList: [],
  authority: [],
  swCollection: [],
  swBrandList: [],
  swBgList: [],
  swBuList: [],
  swCostCenterList: [],
  swRolesList: [],
  swAssetList: [],
  swStockList: [],
  swSoftwareInfoList: { content: [], page: {} },
  swSoftwareInfoExportList: { content: [], page: {} },
  authorityList: { list: [], total: 0 },
  reportList: { list: [], total: 0 },
  reportList1: { list: [], total: 0 },
  reportExportList: [],
  swYearPlanList: [],
  swYearPlanList: "",
  swPlanDate: { beginDate: "", endDate: "" },
  yearSwCollectionDetailList: [],
  swImportMsg: "",
  selectedBrandId: "",
  swProductNameList: [],
  swYearExportList: [],
  swExampleList: [],
  costcenterAndBgbu: [],
  isDisableAddOrUpload: false,
  // 用於QueryOrDownload
  swQueryOrDownloadList: [],
  swReportList: [],
};

const SwCollectionReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.SET_RATE_LIST:
      return {
        ...state,
        rateList: payload.list,
      };
    case Actions.SET_SWIMPORT_MSG:
      return {
        ...state,
        swImportMsg: payload.msg,
      };
    case Actions.SET_RATE_CODE:
      return {
        ...state,
        rateCode: payload.code,
      };
    case Actions.SET_VIEWRATE_LIST:
      return {
        ...state,
        currentPage: payload.currentPage,
        total: payload.total,
        pageSize: payload.pageSize,
        totalPages: payload.totalPages,
        viewRateList: payload.viewList,
      };
    case Actions.SET_QUERY_FILTERS:
      return {
        ...state,
        ...payload,
      };
    case Actions.SET_SW_AUTHORITY_MGT_LIST:
      return {
        ...state,
        pageNum: payload.pageNum,
        total: payload.total,
        pageSize: payload.pageSize,
        totalPages: payload.totalPages,
        swAuthorityMgtList: payload.list,
        swAuthorityPrevQuery: { ...payload },
      };
    case Actions.SET_EXPORT_SW_AUTHORITY_MGT_LIST:
      return {
        ...state,
        exportSwAuthorityMgtList: payload.list,
      };
    default:
      return state;
  }
};
function* refreshAuthority() {
  let prevParam = yield select(
    (state) => state.swCollection.swAuthorityPrevQuery
  );
  // 提取keyword属性
  let keyword = prevParam.swAuthorityPrevQuery.keyword;
  let role = "";
  // 删除原来的swAuthorityPrevQuery属性（如果你不再需要它的话）
  delete prevParam.swAuthorityPrevQuery;

  // 将keyword属性添加到第一层
  prevParam.keyword = keyword;
  prevParam.pageNum = 0;
  let res = yield call(Api.getAuthorityNewList, prevParam);

  if (res.data) {
    yield put({
      type: Actions.SET_SW_AUTHORITY_MGT_LIST,
      payload: {
        pageNum: res.data.data.pageNum,
        total: res.data.data.total,
        pageSize: res.data.data.pageSize,
        totalPages: res.data.data.pages,
        list: res.data.data.list,
        swAuthorityPrevQuery: { ...prevParam },
      },
    });
  }
}

function* uploadSwAuthorityMgtExcel({ payload }) {
  const { file } = payload;
  let msgType = "success";
  let msg = "";
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    const { status, data } = yield call(Api.uploadSwAuthorityMgtExcel, file);
    msg = data.message;
    if (status !== 200 || data.code !== 0) {
      msgType = "error";
      msg = data.message;
      return;
    }
  } catch (error) {
    throw new Error(`[uploadSwAuthorityMgtExcel]: ${error.message}`);
  } finally {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: msg,
          msgType: msgType,
          autoHideDuration: null,
        },
      },
    });

    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
  }
}

function* getSWBrandList() {
  let res = yield call(Api.getSWBrandList, {});
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      swBrandList: res.data.data,
    },
  });
}

function* setSelectedBrandId({ payload }) {
  let { brandId } = payload;
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      selectedBrandId: brandId,
    },
  });
}

function* getSWBg({ payload }) {
  let { userFlag } = payload;
  let res = yield call(Api.getSWBg, { userFlag });
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      swBgList: res.data.data,
    },
  });
}

function* getSWBu({ payload }) {
  let { bgId, userFlag } = payload;
  let res = yield call(Api.getSWBu, { bgId, userFlag });
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      swBuList: res.data.data,
    },
  });
}

function* getSWCostCenter({ payload }) {
  let res = yield call(Api.getSWCostCenter, {
    keyword: payload.keyword,
    userFlag: payload.userFlag,
  });
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      swCostCenterList: res.data.data,
    },
  });
}

function* getSWRoles() {
  let res = yield call(Api.getSWRoles);
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      swRolesList: res.data.data,
    },
  });
}

function* getSWAssetList({ payload }) {
  let { brandId, stockId, sourceSystemId, status } = payload;
  let res = yield call(Api.getSWAssetList, {
    brandId,
    stockId,
    sourceSystemId,
    status,
  });
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      swAssetList: res.data.data,
    },
  });
}

function* getSWStockList({ payload }) {
  let { brandId, stockId, sourceSystemId, status } = payload;
  let res = yield call(Api.getSWAssetList, {
    brandId,
    stockId,
    sourceSystemId,
    status,
  });
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      swStockList: res.data.data,
    },
  });
}

function* getSWSoftwareInfoList({ payload }) {
  let {
    brandId,
    swCollectionBrandId,
    keyword,
    pageNum,
    pageSize,
    sort,
    sourceSystemId,
    year,
    status,
  } = payload;
  let b = "";
  let s = "";
  let st = "";
  if (brandId !== "_all") {
    b = brandId;
  }
  if (sourceSystemId !== "_all") {
    s = sourceSystemId;
  }
  if (status !== "_all") {
    st = status;
  }
  year = year.getFullYear();
  let res = yield call(Api.getSWSoftwareInfoList, {
    brandId: b,
    swCollectionBrandId: swCollectionBrandId,
    keyword,
    page: pageNum,
    size: pageSize,
    sort,
    sourceSystemId: s,
    year,
    status: st,
  });
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      swSoftwareInfoList: res.data.data,
    },
  });
}

function* getSoftwareInfoExport({ payload }) {
  let {
    brandId,
    swCollectionBrandId,
    keyword,
    sort,
    sourceSystemId,
    year,
    status,
  } = payload;
  let b = "";
  let s = "";
  let st = "";
  if (brandId !== "_all") {
    b = brandId;
  }
  if (sourceSystemId !== "_all") {
    s = sourceSystemId;
  }
  if (status !== "_all") {
    st = status;
  }
  year = year.getFullYear();
  let res = yield call(Api.getSWSoftwareInfoList, {
    brandId: b,
    swCollectionBrandId: swCollectionBrandId,
    keyword,
    sort,
    sourceSystemId: s,
    year,
    isUnPaged: 1,
    status: st,
  });
  if (res.data.code !== 0) {
    return;
  }
  exportToExcel(generateTable(swInfoMaintainTabTabCols, res.data.data.content));
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      swSoftwareInfoExportList: res.data.data,
    },
  });
}

function* updateSWSoftwareInfo({ payload }) {
  let {
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
  } = payload;
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
  try {
    let res = yield call(Api.updateSWSoftwareInfo, {
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
    });
    if (res.data.code === -1) {
      yield put({
        type: Actions.SET_QUERY_FILTERS,
        payload: {
          rateResult: res.data,
        },
      });
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.data.message,
            msgType: "error",
            autoHideDuration: null,
          },
        },
      });
    } else {
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.data.message,
            msgType: "success",
            autoHideDuration: 6000,
          },
        },
      });
    }
    yield put({
      type: "getSWSoftwareInfoList",
      payload: {
        pageNum: 0,
        pageSize: 10,
        year: new Date(),
        brandId: "",
        swCollectionBrandId: "",
        keyword: "",
        sourceSystemId: "",
      },
    });
  } catch (e) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: e,
          msgType: "error",
          autoHideDuration: null,
        },
      },
    });
    console.error("Error", e);
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
  }
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}

function* getRateList2({ payload }) {
  let { year } = payload;
  let res = yield call(Api.getRateList2, { year });
  if (res.data.data.content) {
    yield put({
      type: Actions.SET_RATE_LIST,
      payload: {
        list: res.data.data.content,
      },
    });
  }
}

// function* getAuthorityList({ payload }) {
//   let { pageNum, pageSize, keyword } = payload;
//   let page = pageNum + 1
//   let res = yield call(Api.getAuthorityNewList, { page, pageSize, keyword });
//   if (res.data.code !== 0) {
//     return;
//   }
//   yield put({
//     type: Actions.SET_QUERY_FILTERS,
//     payload: {
//       authorityList: res.data.data,
//     },
//   });
// }

function* getAuthorityNewList({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    const { status, data } = yield call(Api.getAuthorityNewList, payload);

    if (status !== 200 || data.code === -1) {
      return;
    }

    const { pageNum, pageSize, pages, total, list } = data.data;

    yield put({
      type: Actions.SET_SW_AUTHORITY_MGT_LIST,
      payload: {
        pageNum: pageNum,
        totalPages: pages,
        total,
        pageSize,
        list,
        swAuthorityPrevQuery: { keyword: payload.keyword },
      },
    });
  } catch (error) {
    throw new Error(`[getAuthorityNewList]: ${error.message}`);
  } finally {
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
  }
}

function* getExportSwAuthorityMgtList({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    const { status, data } = yield call(Api.getExportAuthorityNewList, payload);

    if (status !== 200 || data.code === -1) {
      return;
    }

    yield put({
      type: Actions.SET_EXPORT_SW_AUTHORITY_MGT_LIST,
      payload: {
        list: data.data,
      },
    });
  } catch (error) {
    throw new Error(`[getExportSwAuthorityMgtList]: ${error.message}`);
  } finally {
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
  }
}

function* setSWImportMsg({ payload }) {
  let { msg } = payload;
  yield put({
    type: Actions.SET_SWIMPORT_MSG,
    payload: {
      msg: msg,
    },
  });
}

function* updateAuthority(payload) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
  let msg = "";
  try {
    let res = yield call(Api.addAuthorityBy, payload);
    msg = res.data.message;
    if (res.data.code === -1) {
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: msg,
            msgType: "error",
            autoHideDuration: null,
          },
        },
      });
    } else {
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: msg,
            msgType: "success",
            autoHideDuration: 6000,
          },
        },
      });
    }
    yield put({
      // type: "getAuthorityNewList",
      // payload: {
      //   pageNum: 0,
      //   pageSize: 10,
      // },
      type: "refreshAuthority",
    });
  } catch (e) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: e,
          msgType: "error",
          autoHideDuration: null,
        },
      },
    });
    console.error("Error", e);
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
  }
}

function* deleteAuthorityById({ payload }) {
  let { id } = payload;
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    let res = yield call(Api.deleteAuthorityById, { id });
    if (res.data.code === -1) {
      yield put({
        type: Actions.SET_QUERY_FILTERS,
        payload: {
          rateResult: res.data,
        },
      });
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.data.message,
            msgType: "error",
            autoHideDuration: null,
          },
        },
      });
    } else {
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.data.message,
            msgType: "success",
            autoHideDuration: 6000,
          },
        },
      });
    }
  } catch (e) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: "error while delete sw authority",
          msgType: "error",
          autoHideDuration: null,
        },
      },
    });
    console.log("error", e);
  }
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
  yield put({
    // type: "getAuthorityNewList",
    // payload: {
    //   pageNum: 0,
    //   pageSize: 10,
    //   keyword: "",
    // },
    type: "refreshAuthority",
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}

function* getReportList({ payload }) {
  let {
    bg,
    bu,
    costCenter,
    brand,
    year,
    keyword,
    pageNum,
    pageSize,
    userFlag,
  } = payload;
  let res = yield call(Api.getReportList, {
    bg,
    bu,
    costCenter,
    brand,
    year: year.year(),
    keyword,
    pageNum,
    pageSize,
    userFlag,
  });
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      reportList: res.data.data,
    },
  });
}

function* getYearSwCollectionDetail({ payload }) {
  let { brandId, planId, swCollectionNewSWId, costCenterCode, assetId } =
    payload;
  let res = yield call(Api.getYearSwCollectionDetail, {
    brandId,
    planId,
    swCollectionNewSWId,
    costCenterCode,
    assetId,
  });
  if (res.data.code !== 0) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: res.data.message,
          msgType: "error",
          autoHideDuration: null,
        },
      },
    });
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      yearSwCollectionDetailList: res.data.data,
    },
  });
}
function* getSWProductNameList({ payload }) {
  let { brandId, swCollectionBrandId } = payload;
  let res = yield call(Api.getSWAssetList, {
    brandId,
    swCollectionBrandId,
    status: true,
  });
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      swProductNameList: res.data.data,
    },
  });
}
function* updateYearPlanList({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    yield call(Api.updateYearPlan, payload);
  } catch (e) {
    console.error("Error while update or add sw", e);
  }
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
  yield put({
    type: "getReportList",
    payload: {
      pageNum: 1,
      pageSize: 10,
      year: new Date(),
      userFlag: 1,
    },
  });
}

function* uploadYearPlan({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    let res = yield call(Api.uploadYearPlan, payload);
    yield put({
      type: Actions.SET_SWIMPORT_MSG,
      payload: {
        msg: res.data.message,
      },
    });
  } catch (e) {
    console.log("error while delete sw rate", e);
  }
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}
function* getYearPlanList() {
  let res = yield call(Api.getYearPlanList, {});
  let currentYear = new Date().getFullYear();
  if (res.data.code !== 0) {
    return;
  }
  let planId;
  res.data.data.forEach((el) => {
    if (Number(el.year) === currentYear) {
      planId = el.planId;
    }
  });
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      swYearPlanList: planId,
    },
  });
}
function* deleteSwCollection({ payload }) {
  let { swCollectionId } = payload;
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    yield call(Api.deleteSwCollection, { swCollectionId });
  } catch (e) {
    console.log("error", e);
  }
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
  yield put({
    type: "getReportList",
    payload: {
      pageNum: 1,
      pageSize: 10,
      year: new Date(),
      userFlag: 1,
    },
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}
function* getTotalReportList({ payload }) {
  let res = yield call(Api.getReportList, payload);
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      swYearExportList: res.data.data,
    },
  });
}
function* getExampleList() {
  let res = yield call(Api.getFirstSwCollection, {});
  if (res.data.code !== 0) {
    return;
  }
  let arr = [];
  arr.push(res.data.data);
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      swExampleList: arr,
    },
  });
}
function* getCostcenterAndBgBu({ payload }) {
  let { keyword } = payload;
  let res = yield call(Api.getCostcenterAndBgBu, { keyword });
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      costcenterAndBgbu: res.data.data.costCenterMessageList,
    },
  });
}
function* isAddOrUploadSW() {
  let res = yield call(Api.isAddOrUploadSW);
  if (res.data.code === 0) {
    yield put({
      type: Actions.SET_QUERY_FILTERS,
      payload: {
        isDisableAddOrUpload: !res.data.data,
      },
    });
  }
}
function* getQueryOrDownloadList({ payload }) {
  let res = yield call(SWReportApi.getSwReportList, payload);
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      queryOrDownloadList: res.data.data,
    },
  });
}
const SWSaga = [
  takeEvery("getSWBrandList", getSWBrandList),
  takeEvery("getSWBg", getSWBg),
  takeEvery("getSWBu", getSWBu),
  takeEvery("getSWCostCenter", getSWCostCenter),
  takeEvery("getSWRoles", getSWRoles),
  takeEvery("getSWAssetList", getSWAssetList),
  takeEvery("getSWStockList", getSWStockList),
  takeEvery("getSWSoftwareInfoList", getSWSoftwareInfoList),
  takeEvery("getSoftwareInfoExport", getSoftwareInfoExport),
  takeEvery("updateSWSoftwareInfo", updateSWSoftwareInfo),
  takeEvery("getAuthorityNewList", getAuthorityNewList),
  takeEvery("refreshAuthority", refreshAuthority),
  takeEvery("getExportSwAuthorityMgtList", getExportSwAuthorityMgtList),
  takeEvery("setSWImportMsg", setSWImportMsg),
  takeEvery("updateAuthority", updateAuthority),
  takeEvery("deleteAuthorityById", deleteAuthorityById),
  takeEvery("getQueryOrDownloadList", getQueryOrDownloadList),
  takeEvery("updateYearPlanList", updateYearPlanList),
  takeEvery("getYearPlanList", getYearPlanList),
  takeEvery("getYearSwCollectionDetail", getYearSwCollectionDetail),
  takeEvery("getSWProductNameList", getSWProductNameList),
  takeEvery("deleteSwCollection", deleteSwCollection),
  takeEvery("uploadYearPlan", uploadYearPlan),
  takeEvery("getTotalReportList", getTotalReportList),
  takeEvery("getExampleList", getExampleList),
  takeEvery("getCostcenterAndBgBu", getCostcenterAndBgBu),
  takeEvery("isAddOrUploadSW", isAddOrUploadSW),
  takeEvery("uploadSwAuthorityMgtExcel", uploadSwAuthorityMgtExcel),
  takeEvery("setSelectedBrandId", setSelectedBrandId),
];
export { SwCollectionReducer, SWSaga };
