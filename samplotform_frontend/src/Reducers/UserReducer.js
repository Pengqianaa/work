import Api from "../Common/api";
import SmartItApi from "../Common/SmartItApi";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { Actions } from "../Common/constants";
import getLocaleData from "../i18n/_locale";

const initialState = {
  sidebarShow: "responsive",
  user: {},
  computerNames: [],
  token: "",
  installed: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  request: [],
  rTotal: 0,
  rPageNum: 1,
  rPageSize: 10,
  permissionIds: [],
};

const UserReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.SET_USER:
      return { ...state, ...payload };
    case Actions.STORE_USER:
      return { ...state, ...payload };
    default:
      return state;
  }
};

function* getUser() {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  const res = yield call(Api.getCurrentUser);
  if (!res?.data || res.data?.code === -1) {
    console.log(
      "response.data.code:" +
        res.data.code +
        ", response.data.message" +
        res.data.message
    );
  }

  yield put({
    type: Actions.SET_USER,
    payload: {
      user: res?.data.data,
    },
  });

  yield put({
    type: Actions.SET_SAM_FUNCTION_LIST,
    payload: {
      list: res?.data.data.userFunctions,
    },
  });

  let roleres = yield call(Api.queryPermissionFunction);

  if (roleres.data.data) {
    yield put({
      type: Actions.SET_PERMISSIONS,
      payload: roleres.data.data,
    });
  }

  let res2 = yield call(Api.queryPermissionRole);
  if (res2.data.data) {
    yield put({
      type: Actions.SET_USER,
      payload: {
        permissionIds: res2.data.data.map((el) => el.roleId),
      },
    });
  }

  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });

  let sccmRes = yield call(SmartItApi.getSystemsbyLastLoggedUser, {
    UserNtAccount: res.data.data.userId,
  });

  if (sccmRes && sccmRes.data) {
    let computerNames = sccmRes.data.data.map((el) => {
      return el.hostname;
    });

    yield put({
      type: Actions.SET_USER,
      payload: {
        computerNames,
      },
    });
  }
}

function* getAppList({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  let { pageNum, pageSize, sourceSystem } = payload;
  let res = yield call(Api.getAllInstalled, {
    pageNum,
    pageSize,
    sourceSystem,
  });

  yield put({
    type: Actions.SET_USER,
    payload: {
      installed: res.data.data.list,
      total: res.data.data.total,
      pageNum: res.data.data.pageNum,
      pageSize: res.data.data.pageSize,
    },
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}

function* getRequestList({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  let { pageNum, pageSize, applicant, applicantId, formStatus, formType } =
    payload;
  if (!applicantId) {
    applicantId = yield select((state) => state.user.userId);
  }
  let res = yield call(Api.getAllRequests, {
    pageNum,
    pageSize,
    applicant,
    applicantId,
    formStatus,
    formType,
  });

  yield put({
    type: Actions.SET_USER,
    payload: {
      request: res.data.data.list,
      rTotal: res.data.data.total,
      rPageNum: res.data.data.pageNum,
      rPageSize: res.data.data.pageSize,
    },
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}

function* sendUninstallApplication({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  let { reasons, selected } = payload;

  let { empCode, userId } = yield select((state) => state.user.user);
  let currentLocale = yield select((state) => state.view.currentLocale);
  // let request = yield select(state => state.user.request)

  if (!empCode || !selected) {
    return;
  }

  let params = {
    empCode,
    applicant: userId,
    language: currentLocale,
    reason: reasons,
    items: [],
  };

  selected.forEach((e) => {
    let item = {
      assetId: e.assetId,
      catId: e.catId,
      sourceId: e.sourceId,
      sourceSystemId: e.sourceSystemId,
      empCode,
      computerName: e.applyComputer,
    };
    params.items.push(item);
  });

  let res = yield call(Api.sendUninstallRequest, params);

  if (res.data && res.data.code !== 0) {
    const messages = getLocaleData(currentLocale);
    yield put({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props: {
          title: messages["common.title"],
          message: res.data.message,
          hasCancel: false,
          callback: () => null,
        },
      },
    });
  } else {
    yield put({
      type: Actions.GO_TO_PAGE,
      payload: "/myrequest",
    });
  }
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}

const UserSaga = [
  takeEvery("getUser", getUser),
  takeEvery("getAppList", getAppList),
  takeEvery("getRequestList", getRequestList),
  takeEvery("sendUninstallApplication", sendUninstallApplication),
];

export { UserReducer, UserSaga };
