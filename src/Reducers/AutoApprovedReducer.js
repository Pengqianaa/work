
const initialState = {
  queryResults: { content: [] },
  prevQuery: {}, // 用于保存上一次的查询参数
};

export const ACTIONS = {
  GET_RELOAD_ORG_LIST: 'GET_RELOAD_ORG_LIST',
  GET_AUTO_APPROVED_LIST: 'GET_AUTO_APPROVED_LIST',
  SET_AUTO_APPROVED_LIST: 'SET_AUTO_APPROVED_LIST',
  SET_IS_AUTO_APPROVED: 'SET_IS_AUTO_APPROVED',
  CHECK_STATUS: 'CHECK_STATUS',
};

const AutoApprovedReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.SET_AUTO_APPROVED_LIST:
      return {
        ...state,
        queryResults: payload?.data || {},
        prevQuery: payload?.params || {}, // 保存查询参数
      };
    default:
      return state;
  }
};

import Api from "../Common/api";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { Actions } from "../Common/constants";
import { ACTIONS as ViewActions } from "./ViewReducer";

// 刷新列表
function* refreshList() {
  const prevParam = yield select((state) => state.autoApproved.prevQuery); // 获取上一次的查询参数
  if (prevParam) {
    yield put({
      type: ACTIONS.GET_PERMISSION_LIST,
      payload: prevParam, // 使用上一次的查询参数
    });
  } else {
    console.warn("No previous query parameters found.");
  }
}

// 获取列表
function* getAutoApprovedList({ payload }) {
  yield put({ type: ViewActions.SET_IS_LOADING, payload: true });
  try {
    const res = yield call(Api.getOrgList, payload);
    yield put({
      type: ACTIONS.SET_AUTO_APPROVED_LIST,
      payload: {
        data: res.data, // API 返回的数据
        params: payload, // 保存查询参数
      },
    });
  } catch (error) {
    console.error("Error in getOrgList saga:", error);
  } finally {
    yield put({ type: Actions.SET_IS_LOADING, payload: false });
  }
}

// //從API獲取Org數據
function* getReloadOrgList({ payload }) {
  yield put({ type: Actions.SET_IS_LOADING, payload: true });
  try {
    const res = yield call(Api.getReloadOrgList, payload);
    let msgType = 4
    if (res.status === 200) {
      msgType = 1
      const prevParam = yield select((state) => state.autoApproved.prevQuery);
      yield put({ type: ACTIONS.GET_AUTO_APPROVED_LIST, payload: prevParam });
    }
    yield put({
      type: ViewActions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: res.data,
          msgType: msgType,
          autoHideDuration: msgType === 1 ? 6000 : null,
        },
      },
    })
  } catch (error) {
    console.error("Error in getOrgList saga:", error);
  } finally {
    yield put({ type: ViewActions.SET_IS_LOADING, payload: false });
  }
}

//根據ID更新isAutoApproved屬性
function* setIsAuto({ payload }) {
  yield put({ type: Actions.SET_IS_LOADING, payload: true });
  try {
    const res = yield call(Api.isAutoApproved, payload);
    let msgType = 4, message = 'success'
    if (res.status === 200) {
      msgType = 1
      const prevParam = yield select((state) => state.autoApproved.prevQuery);
      yield put({ type: ACTIONS.GET_AUTO_APPROVED_LIST, payload: prevParam });
    } else {
      msgType = 4
      message = res.data.messages[0]
    }
    yield put({
      type: ViewActions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: message,
          msgType: msgType,
          autoHideDuration: msgType === 1 ? 6000 : null,
        },
      },
    })
  } catch (error) {
    console.error("Error in setIsAuto saga:", error);
  } finally {
    yield put({ type: ViewActions.SET_IS_LOADING, payload: false });
  }
}

//根據RpaOrg ID查詢是否存在applicationStatus為To Be Confirmed
function* checkStatus(action) {
  yield put({ type: Actions.SET_IS_LOADING, payload: true });
  try {
    let { payload } = action
    const res = yield call(Api.isApplicationStatusExist, payload);
    if (action.resolve) action.resolve(res);
  } catch (error) {
    console.error("Error in setIsAuto saga:", error);
    // 如果调用方传递了 reject 回调，则调用它
    if (action.reject) action.reject(error);
  } finally {
    yield put({ type: ViewActions.SET_IS_LOADING, payload: false });
  }
}


// 监听所有 Saga
const AutoApprovedSaga = function* () {
  yield takeEvery(ACTIONS.GET_AUTO_APPROVED_LIST, getAutoApprovedList);
  yield takeEvery(ACTIONS.GET_RELOAD_ORG_LIST, getReloadOrgList);
  yield takeEvery(ACTIONS.SET_IS_AUTO_APPROVED, setIsAuto);
  yield takeEvery(ACTIONS.CHECK_STATUS, checkStatus);
};

export { AutoApprovedReducer, AutoApprovedSaga };
