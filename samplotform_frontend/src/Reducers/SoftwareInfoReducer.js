import Api from "../Common/api";
import SmartItApi from "../Common/SmartItApi";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { Actions, ALL } from "../Common/constants";
import {
  DEFAULT_SORTING_COL,
  initSortingAndPaging,
  sortingAndPaginationController,
} from "../Common/TableSorting";
import AdminTableFields from "../Common/AdminTableFields";

const initialState = {
  sccm: {
    currentPage: 1,
    total: 0,
    pageSize: 10,
    totalPages: 0,
    list: [],
    viewList: [],
  },
  license: {
    currentPage: 1,
    total: 0,
    pageSize: 10,
    totalPages: 0,
    list: [],
    viewList: [],
  },
  installationPath: {
    currentPage: 1,
    total: 0,
    pageSize: 10,
    totalPages: 0,
    list: [],
    viewList: [],
  },
  stockIdList: [],
  stockQueryByCatId:5,
};

const SoftwareInfoReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case Actions.SET_SCCM_INFO_LIST:
      return {
        ...state,
        sccm: {
          ...payload,
        },
      };
    case Actions.SET_LICENSE_INFO_LIST:
      return {
        ...state,
        license: {
          ...payload,
        },
      };
    case Actions.SET_INSTALLATION_PATH_LIST:
      return {
        ...state,
        installationPath: {
          ...payload,
        },
      };
    case Actions.SET_STOCK_ID_LIST:
      return { ...state, stockIdList: [...payload] };
    case Actions.SET_CATEGORY_ID:
        return { ...state, stockQueryByCatId: payload };  
    default:
      return state;
  }
};

function* setStockQueryByCatId({payload}) {
  yield put({
    type: Actions.SET_CATEGORY_ID,
    payload: payload.catId,
  });
}

function* suggestStockId({ payload }) {
  let catId = yield select((state) => state.softwareInfo.stockQueryByCatId);
  let res = yield call(Api.suggestStockId, { input: payload,catId });
  if (res.data.data) {
    yield put({
      type: Actions.SET_STOCK_ID_LIST,
      payload: res.data.data,
    });
  }
}

function* sccmResultController({ payload }) {
  let sfState = yield select((state) => state.softwareInfo.sccm);

  let data = sortingAndPaginationController(
    sfState,
    payload,
    DEFAULT_SORTING_COL.sccm,
    AdminTableFields.SCCMTabCols
  );

  yield put({
    type: Actions.SET_SCCM_INFO_LIST,
    payload: data,
  });
}

function* getSCCMList({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  let { area, brand, category,RegionArea,Brand } = payload;
  if (area === ALL) {
    area = null;
  }
  if (brand === ALL) {
    brand = null;
  }
  if (category === ALL) {
    category = null;
  }
  let paramArea = area
  let paramBrand = brand
  
  if(RegionArea){
    paramArea = RegionArea
    paramBrand = Brand
  }
  let res = yield call(SmartItApi.querySCCMInfo, {
    RegionArea: paramArea,
    Brand: paramBrand,
    Category: category,
  });

  if (res.data) {
    // patch
    let areaList = yield select((state) => state.query.areaList);
    let areaMapping = {};
    areaList.forEach((el) => {
      areaMapping[el.id] = el.areaEname;
    });
    res.data = res.data.map((el) => {
      let elem = { ...el };
      elem.viewRegionArea = areaMapping[elem.RegionArea];
      return elem;
    });

    let data = initSortingAndPaging(
      res.data,
      payload,
      DEFAULT_SORTING_COL.sccm,
      AdminTableFields.SCCMTabCols
    );

    yield put({
      type: Actions.SET_SCCM_INFO_LIST,
      payload: data,
    });
  }
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}
function* updateSCCMInfo({ payload }) {
  let { item, SCCMName, SCCMFolderPath } = payload;
  let { RegionArea, StockID } = item;
  let { userId } = yield select((state) => state.user.user);
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    let res = yield call(SmartItApi.editSCCMInfo, {
      RegionArea,
      StockID,
      SCCMName,
      SCCMFolderPath,
      ModifiedBy: userId,
    });
    if (res.status === 200) {
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
    } else {
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.statusText,
            msgType: "error",
            autoHideDuration: null,
          },
        },
      });
    }
  } catch (error) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: error,
          msgType: "error",
          autoHideDuration: null,
        },
      },
    });
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
  }

  let sfState = yield select((state) => state.softwareInfo.license);
  let { pageSize } = sfState;
  debugger
  yield put({
    type: "getSCCMList",
    payload: {
      pageNum: 1,
      pageSize,
      ...item
    },
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}
function* createSCCMInfo({ payload }) {
  let { item, SCCMName, SCCMFolderPath } = payload;
  let { RegionArea, StockID } = item;
  let { userId } = yield select((state) => state.user.user);
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    let res = yield call(SmartItApi.addSCCMInfo, {
      RegionArea,
      StockID,
      SCCMName,
      SCCMFolderPath,
      ModifiedBy: userId,
    });
    if (res.status === 200) {
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
    } else {
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.statusText,
            msgType: "error",
            autoHideDuration: null,
          },
        },
      });
    }
  } catch (error) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: res.Message,
          msgType: "error",
          autoHideDuration: null,
        },
      },
    });
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
  }

  let sfState = yield select((state) => state.softwareInfo.license);
  let { pageSize } = sfState;
  yield put({
    type: "getSCCMList",
    payload: {
      pageNum: 1,
      pageSize,
      ...item
    },
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}
function* deleteSCCMInfo({ payload }) {
  let { RegionArea, StockID } = payload;
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    let res = yield call(SmartItApi.deleteSCCMInfo, {
      regionArea: RegionArea,
      stockID: StockID,
    });
    if (res.status === 200) {
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
    } else {
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.statusText,
            msgType: "error",
            autoHideDuration: null,
          },
        },
      });
    }
  } catch (error) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: error,
          msgType: "error",
          autoHideDuration: null,
        },
      },
    });
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
  }

  let sfState = yield select((state) => state.softwareInfo.license);
  let { pageSize } = sfState;
  yield put({
    type: "getSCCMList",
    payload: {
      pageNum: 1,
      pageSize,
    },
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}
function* updateSoftwareInfo({ payload }) {
  let {
    assetId,
    graph,
    refEUrl,
    refUrl,
    softwareDesc,
    softwareEDesc,
    mainFlag,
    mainSoftDetailList,
  } = payload;

  let res = yield call(Api.updateSoftwareInfo, {
    assetId,
    graph,
    assetRefUrlEN: refEUrl,
    assetRefUrlTC: refUrl,
    assetDescTC: softwareDesc,
    assetDescEN: softwareEDesc,
    mainFlag,
    mainSoftDetailList,
  });
  if (res.data.code === 0) {
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
  } else {
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
  }
  yield put({
    type: "refreshSoftwareInfos",
  });
}

// =====================================
function* licenseResultController({ payload }) {
  let sfState = yield select((state) => state.softwareInfo.license);
  let data = sortingAndPaginationController(
    sfState,
    payload,
    DEFAULT_SORTING_COL.license,
    AdminTableFields.LicenseTabCols
  );

  yield put({
    type: Actions.SET_LICENSE_INFO_LIST,
    payload: data,
  });
}

function* getLicenseList({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  let { area, brand } = payload;
  if (area === ALL) {
    area = null;
  }
  if (brand === ALL) {
    brand = null;
  }

  let res = yield call(SmartItApi.queryLicenseInfo, {
    RegionArea: area,
    Brand: brand,
  });

  if (res.data) {
    // patch
    let areaList = yield select((state) => state.query.areaList);
    let areaMapping = {};
    areaList.forEach((el) => {
      areaMapping[el.id] = el.areaEname;
    });
    res.data = res.data.map((el) => {
      let elem = { ...el };
      elem.viewRegionArea = areaMapping[elem.RegionArea];
      return elem;
    });

    let data = initSortingAndPaging(
      res.data,
      payload,
      DEFAULT_SORTING_COL.license,
      AdminTableFields.LicenseTabCols
    );

    yield put({
      type: Actions.SET_LICENSE_INFO_LIST,
      payload: data,
    });
  }
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}
function* updateLicenseInfo({ payload }) {
  let { item, ServerName, OPTFilePath, OPTFileIndexKey } = payload;
  let { RegionArea, StockID } = item;
  let { userId } = yield select((state) => state.user.user);
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    let res = yield call(SmartItApi.editLicenseInfo, {
      RegionArea,
      StockID,
      ServerName,
      OPTFilePath,
      OPTFileIndexKey,
      ModifiedBy: userId,
    });
    if (res.status === 200) {
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
    } else {
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.statusText,
            msgType: "error",
            autoHideDuration: null,
          },
        },
      });
    }
  } catch (error) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: error,
          msgType: "error",
          autoHideDuration: null,
        },
      },
    });
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
  }

  let sfState = yield select((state) => state.softwareInfo.license);
  let { pageSize } = sfState;
  yield put({
    type: "getLicenseList",
    payload: {
      pageNum: 1,
      pageSize,
    },
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}
function* createLicenseInfo({ payload }) {
  let { item, ServerName, OPTFilePath, OPTFileIndexKey } = payload;
  let { RegionArea, StockID } = item;
  let { userId } = yield select((state) => state.user.user);
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    let res = yield call(SmartItApi.addLicenseInfo, {
      RegionArea,
      StockID,
      ServerName,
      OPTFilePath,
      OPTFileIndexKey,
      ModifiedBy: userId,
    });
    if (res.status === 200) {
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
    } else {
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.statusText,
            msgType: "error",
            autoHideDuration: null,
          },
        },
      });
    }
  } catch (error) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: error,
          msgType: "error",
          autoHideDuration: null,
        },
      },
    });
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
  }

  let sfState = yield select((state) => state.softwareInfo.license);
  let { pageSize } = sfState;
  yield put({
    type: "getLicenseList",
    payload: {
      pageNum: 1,
      pageSize,
    },
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}
function* deleteLicenseInfo({ payload }) {
  let { RegionArea, StockID, ServerName } = payload;
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    let res = yield call(SmartItApi.deleteLicenseInfo, {
      regionArea: RegionArea,
      stockID: StockID,
      serverName: ServerName,
    });
    if (res.status === 200) {
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
    } else {
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.statusText,
            msgType: "error",
            autoHideDuration: null,
          },
        },
      });
    }
  } catch (error) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: error,
          msgType: "error",
          autoHideDuration: null,
        },
      },
    });
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
  }

  let sfState = yield select((state) => state.softwareInfo.license);
  let { pageSize } = sfState;
  yield put({
    type: "getLicenseList",
    payload: {
      pageNum: 1,
      pageSize,
    },
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}

// =====================================
function* installationPathController({ payload }) {
  let sfState = yield select((state) => state.softwareInfo.installationPath);
  let data = sortingAndPaginationController(
    sfState,
    payload,
    DEFAULT_SORTING_COL.installationpath,
    AdminTableFields.InstallationPathCols
  );

  yield put({
    type: Actions.SET_INSTALLATION_PATH_LIST,
    payload: data,
  });
}

function* getInstallationPathList({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  let { area, brandIds, catId, category } = payload;
  let params = {
    area,
    catId,
    category,
  };
  if (brandIds && brandIds !== "_all" && brandIds.length > 0) {
    params.brandIds = brandIds.join(",");
  }
  if (Array.isArray(area) && area.length > 0) {
    params.area = area.join(",");
    if(area.includes("_all")){
      delete params.area
    }
  }

  let res = yield call(Api.listInstallationPath, params);

  if (res.data.data) {
    let data = initSortingAndPaging(
      res.data.data,
      payload,
      DEFAULT_SORTING_COL.installationpath,
      AdminTableFields.InstallationPathCols
    );

    yield put({
      type: Actions.SET_INSTALLATION_PATH_LIST,
      payload: data,
    });
  }
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}

function* updateInstallationPath({ payload }) {
  let { item, installationMethod, installationPath, licensesSn , category } = payload;
  let { areaId, assetId, id } = item;
  let empCode = yield select((state) => state.user.empCode);
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    let res = yield call(Api.updateInstallationPath, {
      areaId,
      assetId,
      id,
      installationMethod,
      installationPath,
      licensesSn,
      modifiedEmpCode: empCode,
      category,
    });
    if (res.data.code === 0) {
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
    } else {
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
    }
  } catch (error) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: "Error while updateInstallationPath",
          msgType: "error",
          autoHideDuration: null,
        },
      },
    });
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
  }

  let sfState = yield select((state) => state.softwareInfo.installationPath);
  let { pageSize } = sfState;
  let area = [item.areaId]
  let catId = category
  yield put({
    type: "getInstallationPathList",
    payload: {
      pageNum: 1,
      pageSize,
      area,
      catId
    },
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}
function* createInstallationPath({ payload }) {
  let { item, installationMethod, installationPath, licensesSn } = payload;
  let { areaId, assetId, category } = item;
  let empCode = yield select((state) => state.user.empCode);
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    let res = yield call(Api.createInstallationPath, {
      areaId,
      assetId,
      installationMethod,
      installationPath,
      licensesSn,
      modifiedEmpCode: empCode,
      category,
    });
    if (res.data.code === 0) {
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
    } else {
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
    }
  } catch (error) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: "Error while InstallationPath",
          msgType: "error",
          autoHideDuration: null,
        },
      },
    });
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
  }

  let sfState = yield select((state) => state.softwareInfo.installationPath);
  let { pageSize } = sfState;
  let area = [item.areaId]
  let catId = item.category
  yield put({
    type: "getInstallationPathList",
    payload: {
      pageNum: 1,
      pageSize,
      area,
      catId
    },
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}
function* deleteInstallationPath({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    let res = yield call(Api.deteleInstallationPath, { id: payload });
    if (res.data.code === 0) {
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
    } else {
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
    }
  } catch (error) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: "Error while delete TrialWare",
          msgType: "error",
          autoHideDuration: null,
        },
      },
    });
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
  }

  let sfState = yield select((state) => state.softwareInfo.installationPath);
  let { pageSize } = sfState;
  yield put({
    type: "getInstallationPathList",
    payload: {
      pageNum: 1,
      pageSize,
    },
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}

function* getTrialWareList({ payload }) {

  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  let { brands } = payload;
  let { regions } = payload;
  let params = { brandIds: "", regions: "" };
  if (brands && brands.length > 0) {
    params.brands = brands.join(",");
  }
  if (Array.isArray(regions) && regions.length > 0) {
    params.regions = regions.join(",");
    if(regions.includes("_all")){
      delete params.regions
    }
  }
  // if (regions && regions.length > 0) {
  //   params.regions = regions.join(",");
  // }
  let res = yield call(Api.listTrialWareInstallationPath, params);

  if (res.data.data) {
    let data = initSortingAndPaging(
      res.data.data,
      payload,
      DEFAULT_SORTING_COL.trialWare,
      AdminTableFields.TrialwareInfoCols
    );

    yield put({
      type: Actions.SET_INSTALLATION_PATH_LIST,
      payload: data,
    });
  }
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}

function* trialWareController({ payload }) {
  let sfState = yield select((state) => state.softwareInfo.installationPath);
  let data = sortingAndPaginationController(
    sfState,
    payload,
    DEFAULT_SORTING_COL.trialWare,
    AdminTableFields.TrialwareInfoCols
  );
  yield put({
    type: Actions.SET_INSTALLATION_PATH_LIST,
    payload: data,
  });
}

function* createTrialWare({ payload }) {
  let {
    approvalInfo,
    brand,
    effectiveDate,
    installationMethod,
    installationPath,
    licensesSn,
    model,
    productName,
    regionArea,
    sdpId,
  } = payload;
  let empCode = yield select((state) => state.user.empCode);
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    let res = yield call(Api.createTrialWare, {
      approvalInfo,
      brand,
      effectiveDate,
      installationMethod,
      installationPath,
      licensesSn,
      model,
      productName,
      regionArea,
      sdpId,
      modifiedEmpCode: empCode,
    });
    if (res.data.code === 0) {
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
    } else {
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
    }
  } catch (error) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: "Error while add TrialWare",
          msgType: "error",
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

function* updateTrialWare({ payload }) {
  let {
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
  } = payload;
  let empCode = yield select((state) => state.user.empCode);
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    let res = yield call(Api.updateTrialWare, {
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
      modifiedEmpCode: empCode,
    });
    if (res.data.code === 0) {
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
    } else {
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
    }
  } catch (error) {
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: "Error while update TrialWare",
          msgType: "error",
          autoHideDuration: null,
        },
      },
    });
  }
}

function* deleteTrialWare({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    let res = yield call(Api.deleteTrialWare, { id: payload });
    if (res.data.code === 0) {
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
    } else {
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
    }
  } catch (error) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: "Error while delete TrialWare",
          msgType: "error",
          autoHideDuration: null,
        },
      },
    });
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
  }

  let sfState = yield select((state) => state.softwareInfo.license);
  let { pageSize } = sfState;
  yield put({
    type: "getTrialWareList",
    payload: {
      pageNum: 1,
      pageSize,
    },
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}

const SoftwareInfoSaga = [
  takeEvery("getSCCMList", getSCCMList),
  takeEvery("createSCCMInfo", createSCCMInfo),
  takeEvery("deleteSCCMInfo", deleteSCCMInfo),
  takeEvery("updateSCCMInfo", updateSCCMInfo),
  takeEvery("sccmResultController", sccmResultController),
  takeEvery("updateSoftwareInfo", updateSoftwareInfo),
  takeEvery("getLicenseList", getLicenseList),
  takeEvery("updateLicenseInfo", updateLicenseInfo),
  takeEvery("createLicenseInfo", createLicenseInfo),
  takeEvery("deleteLicenseInfo", deleteLicenseInfo),
  takeEvery("licenseResultController", licenseResultController),
  takeEvery("suggestStockId", suggestStockId),

  takeEvery("installationPathController", installationPathController),
  takeEvery("trialWareController", trialWareController),
  takeEvery("getInstallationPathList", getInstallationPathList),
  takeEvery("getTrialWareList", getTrialWareList),
  takeEvery("updateInstallationPath", updateInstallationPath),
  takeEvery("createInstallationPath", createInstallationPath),
  takeEvery("deleteInstallationPath", deleteInstallationPath),
  takeEvery("createTrialWare", createTrialWare),
  takeEvery("updateTrialWare", updateTrialWare),
  takeEvery("deleteTrialWare", deleteTrialWare),
  takeEvery("setStockQueryByCatId", setStockQueryByCatId),
  
];

export { SoftwareInfoReducer, SoftwareInfoSaga };
