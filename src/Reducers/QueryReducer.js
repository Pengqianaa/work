import Api from "../Common/api";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { Actions, CATEGORY, E_FORM_QUERY_TABS } from "../Common/constants";

import { ALL } from "src/constants/common";
import {
  DEFAULT_SORTING_COL,
  initSortingAndPaging,
  sortingAndPaginationController,
} from "../Common/TableSorting";
import AdminTableFields from "../Common/AdminTableFields";
import moment from "moment";

const initialState = {
  areaList: [],
  bgList: [],
  buList: [],
  costCenterAreaList: [],
  costCenterBgList: [],
  costCenterBuList: [],
  costCenterBuMap: {},
  costCenterBgBuMap: {},
  brandList: [],
  costDeptList: [],
  statusList: [],

  verifiedCostDept: [],

  eForm: {
    currentPage: 1,
    total: 0,
    pageSize: 10,
    totalPages: 0,
    list: [],
    viewList: [],
  },

  software: {
    currentPage: 1,
    total: 0,
    pageSize: 10,
    totalPages: 0,
    list: [],

    prevQuery: {},
  },
};

const QueryReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.SET_QUERY_FILTERS:
      return {
        ...state,
        ...payload,
      };
    case Actions.SET_EFORM_QUERY_RESULTS:
      return {
        ...state,
        eForm: {
          ...payload,
        },
      };
    case Actions.SET_SOFTWARE_QUERY_RESULTS:
      return {
        ...state,
        software: {
          ...payload,
        },
      };
    default:
      return state;
  }
};

function* getAreaList({ payload }) {
  let res = yield call(Api.getAreaByIds, {
    areaIds: null,
  });
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      areaList: res.data.data,
    },
  });
}

function* getBgList({ payload }) {
  let res = yield call(Api.getBgByIds, { bgIds: null });
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      bgList: res.data.data,
    },
  });
}
function* getBuList({ payload }) {
  let res = yield call(Api.getBuByIds, { buIds: null });
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      buList: res.data.data,
    },
  });
}

function* getCostCenterAreaList() {
  const { status, data } = yield call(Api.getCostCenterAreaList);
  if (status !== 200 || data.code !== 0) {
    return;
  }

  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      costCenterAreaList: data.data,
    },
  });
}
function* getCostCenterBgBuMap() {
  const { status, data } = yield call(Api.getCostCenterBgBuList);
  if (status !== 200 || data.code !== 0) {
    return;
  }
  console.log(ALL);
  const { costCenterBgList, costCenterBuMap } = data.data.reduce(
    (prev, curr) => {
      const { bgId, buDtoList } = curr;
      return {
        costCenterBgList: [...prev.costCenterBgList, curr],
        costCenterBuMap: {
          ...prev.costCenterBuMap,
          [ALL]: !Object.keys(prev.costCenterBuMap)?.length
            ? buDtoList
            : [...prev.costCenterBuMap[ALL], ...buDtoList],
          [bgId]: buDtoList,
        },
      };
    },
    { costCenterBgList: [], costCenterBuMap: {} }
  );

  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      costCenterBgList,
      costCenterBuMap,
    },
  });
}

function* getCostCenterBuList({ payload }) {
  const buList = yield select((state) => state.query.costCenterBuMap[payload]);

  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      costCenterBuList: buList,
    },
  });
}

function* getBrandList({ payload }) {
  let res;
  if (payload && typeof payload !== "boolean") {
    res = yield call(Api.getTrialwareBrand);
  } else {
    res = yield call(Api.getBrandByIds, {
      brandIds: null,
    });
  }

  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      brandList: res.data.data,
    },
  });
}
function* getCostDept({ payload }) {
  let res = yield call(Api.getCostDept, {
    costDeptCodes: null,
  });
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      costDeptList: res.data.data,
    },
  });
}

function* getStatusList({ payload }) {
  let res = yield call(Api.getStatus, { isProcessing: payload });
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      statusList: res.data.data,
    },
  });
}

function* verifyCostCenter({ payload }) {
  // let res = yield call(Api.verifyCostCenter, { costCenterNumber: payload });
  // api 不正常，先換到getSWCollectionOrgCostCenter
  let res = yield call(Api.getSWCostCenter, { keyword: payload });
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      verifiedCostDept: res.data.data ? res.data.data : [],
    },
  });
}

function* resultController({ payload }) {
  let eFormState = yield select((state) => state.query.eForm);
  let col = "install";
  let cols = [...AdminTableFields.EFormQueryCols];
  if (payload.tab === E_FORM_QUERY_TABS.UNINSTALL) {
    col = "uninstall";
  }
  if (
    payload.tab === E_FORM_QUERY_TABS.ONGOING ||
    payload.tab === E_FORM_QUERY_TABS.CANCEL
  ) {
    col = "ongoing";
    cols = [...AdminTableFields.EFormQueryOngoingCols];
  }

  let data = sortingAndPaginationController(
    eFormState,
    payload,
    DEFAULT_SORTING_COL[col],
    cols
  );

  yield put({
    type: Actions.SET_EFORM_QUERY_RESULTS,
    payload: data,
  });
}

function* queryInstallRecords({ payload }) {
  // let { areaIds, bgIds, brandIds, buIds, costCenters, endDate, pageNum, pageSize, startDate, type } = payload
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });

  let params = {};
  let paramsArr = [
    "areaIds",
    "bgIds",
    "brandIds",
    "buIds",
    "costCenters",
    "endDate",
    "startDate",
    "status",
    "type",
  ];
  paramsArr.forEach((el) => {
    if (payload[el] && payload[el] !== ALL) {
      if (
        ["areaIds", "bgIds", "brandIds", "buIds", "costCenters"].includes(el)
      ) {
        params[el] = payload[el];
      } else if (
        (payload.tab === E_FORM_QUERY_TABS.ONGOING ||
          payload.tab === E_FORM_QUERY_TABS.CANCEL) &&
        ["startDate", "endDate"].includes(el)
      ) {
        // params[el] = payload[el]
      } else {
        params[el] = payload[el];
      }
    }
  });
  let res = null;
  if (
    payload.tab === E_FORM_QUERY_TABS.ONGOING ||
    payload.tab === E_FORM_QUERY_TABS.CANCEL
  ) {
    params.processing =
      payload.tab === E_FORM_QUERY_TABS.ONGOING ? true : false;
    res = yield call(Api.getAllForm, params);
  } else {
    res = yield call(Api.queryInstallRecords, params);
  }

  if (res.data.data) {
    let result = res.data.data.map((el) => {
      return {
        ...el,
        excelInstallTime: el.installTime
          ? moment(el.installTime).format("YYYY-MM-DD")
          : null,
        excelUninstallTime: el.uninstallTime
          ? moment(el.uninstallTime).format("YYYY-MM-DD")
          : null,
        excelType:
          el.type === 1 ? "Install" : el.type === 2 ? "Uninstall" : "-",
      };
    });
    let col = "install";
    let cols = [...AdminTableFields.EFormQueryCols];
    if (payload.tab === E_FORM_QUERY_TABS.UNINSTALL) {
      col = "uninstall";
    }
    if (
      payload.tab === E_FORM_QUERY_TABS.ONGOING ||
      payload.tab === E_FORM_QUERY_TABS.CANCEL
    ) {
      col = "ongoing";
      cols = [...AdminTableFields.EFormQueryOngoingCols];
    }

    let data = initSortingAndPaging(
      result,
      payload,
      DEFAULT_SORTING_COL[col],
      cols
    );

    yield put({
      type: Actions.SET_EFORM_QUERY_RESULTS,
      payload: data,
    });
  }
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}

function* querySoftwareInfos({ payload }) {
  const {
    q,
    categoriesSelected,
    functionsSelected,
    brandsSelected,
    areaSelected,
    pageNum,
    pageSize,
    isPublic,
    isAvailable,
  } = payload;
  if (typeof q === "undefined" || q === null) {
    q = "";
  }
  let isDetlaLib = categoriesSelected[0] === CATEGORY.DELTA_LIBRARY;
  let functionParamName = isDetlaLib ? "componentTypeId" : "functionId";
  let brandParamName = isDetlaLib ? "domainId" : "brandId";

  let req = {
    areaSelected,
    q: q,
    catId:
      typeof categoriesSelected !== "undefined"
        ? categoriesSelected.join(",")
        : "",
    pageNum: pageNum,
    pageSize: pageSize,
    [functionParamName]:
      typeof functionsSelected !== "undefined"
        ? functionsSelected.join(",")
        : "",
    [brandParamName]:
      typeof brandsSelected !== "undefined" ? brandsSelected.join(",") : "",
  };
  if (isPublic !== null) {
    req.isPublic = isPublic;
  }
  if (isAvailable !== null) {
    req.isAvailable = isAvailable;
  }
  let res = yield call(Api.searchSoftware, req);

  if (res.data.data) {
    yield put({
      type: Actions.SET_SOFTWARE_QUERY_RESULTS,
      payload: {
        currentPage: res.data.data.pageNum,
        total: res.data.data.total,
        pageSize: res.data.data.pageSize,
        totalPages: res.data.data.pages,
        list: res.data.data.list,
        prevQuery: { ...req },
      },
    });
  }
}

function* refreshSoftwareInfos() {
  let prevParam = yield select((state) => state.query.software.prevQuery);
  let res = yield call(Api.searchSoftware, prevParam);

  if (res.data.data) {
    yield put({
      type: Actions.SET_SOFTWARE_QUERY_RESULTS,
      payload: {
        currentPage: res.data.data.pageNum,
        total: res.data.data.total,
        pageSize: res.data.data.pageSize,
        totalPages: res.data.data.pages,
        list: res.data.data.list,
        prevQuery: { ...prevParam },
      },
    });
  }
}

const QuerySaga = [
  takeEvery("getAreaList", getAreaList),
  takeEvery("getBgList", getBgList),
  takeEvery("getBuList", getBuList),
  takeEvery("getBrandList", getBrandList),
  takeEvery("getCostDept", getCostDept),
  takeEvery("getStatusList", getStatusList),
  takeEvery("queryInstallRecords", queryInstallRecords),
  takeEvery("querySoftwareInfos", querySoftwareInfos),
  takeEvery("resultController", resultController),
  takeEvery("verifyCostCenter", verifyCostCenter),
  takeEvery("refreshSoftwareInfos", refreshSoftwareInfos),
  takeEvery("getCostCenterAreaList", getCostCenterAreaList),
  takeEvery("getCostCenterBgBuMap", getCostCenterBgBuMap),
  takeEvery("getCostCenterBuList", getCostCenterBuList),
];

export { QueryReducer, QuerySaga };
