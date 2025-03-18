import Api from "../Common/api";
import { call, put, takeEvery } from "redux-saga/effects";
const initialState = {
  isTestingEnv: import.meta.env.VITE_APP_API_URL,
  orgNTenantOrg: '',
  orgNTenantTen: '',
  orgNTenantOrgId: '',
  orgNTenantTenKey: '',
  orgNTenantList: [],
  isLoading: false,
  showProfileModal: false,
  toggleTokenModal: false,
  showCartOverlay: false,
  currentLocale: "en-US",
  isLogPage: true,
  alertProps: {
    title: "",
    message: "",
    hasCancel: false,
  },
  alertShow: false,
  snackbarShow: false,
  snackbarProps: {
    message: "",
    msgType: "", // info,error,warning
    autoHideDuration: null
  },
};

// 假设您有一个action creator来处理页面跳转
// 这个action creator可以包含setTimeout逻辑或其他异步操作
const goToPage = (pageFunc, payload) => {
  return (dispatch) => {
    // 这里可以添加任何需要的异步逻辑
    // 例如，使用setTimeout来模拟异步操作（不推荐在生产中使用）
    setTimeout(() => {
      pageFunc(payload); // 调用页面跳转函数
    }, 100); // 延迟100毫秒（仅作为示例）

    // 如果需要，可以dispatch一个action来更新store（例如，跟踪页面视图）
    // dispatch({ type: 'PAGE_VIEWED', payload: somePageData });
  };
};

// 导出action creator供其他部分使用
export { goToPage };
export const ACTIONS = {
  CHECK_USER_LOGIN: 'CHECK_USER_LOGIN',
  CHECK_USER_LOGIN_SUCCESS: 'CHECK_USER_LOGIN_SUCCESS',
  CHECK_USER_LOGIN_FAILURE: 'CHECK_USER_LOGIN_FAILURE',
  SET_ORG_N_Tenant_Org: "SET_ORG_N_Tenant_Org",
  GET_ORG_N_Tenant_Org: "GET_ORG_N_Tenant_Org",
  SET_ORG_N_Tenant_Ten: "SET_ORG_N_Tenant_Ten",
  GET_ORG_N_Tenant_Ten: "GET_ORG_N_Tenant_Ten",
  GET_ORG_N_Tenant_LIST: 'GET_ORG_N_Tenant_LIST',
  SET_ORG_N_Tenant_LIST: 'SET_ORG_N_Tenant_LIST',
  SHOW_SNACKBAR_MESSAGE: 'SHOW_SNACKBAR_MESSAGE',
  TOGGLE_SNACKBAR: 'TOGGLE_SNACKBAR',
  SET_IS_LOADING: 'SET_IS_LOADING',
};
const ViewReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.SET_ORG_N_Tenant_Org:
      return {
        ...state,
        orgNTenantOrg: payload[0].orgName, // 确保状态一致
        orgNTenantOrgId: payload[0].orgId,
      };
    case ACTIONS.SET_ORG_N_Tenant_Ten:
      return {
        ...state,
        orgNTenantTen: payload.tenantName, // 确保状态一致
        orgNTenantTenKey: payload.tenantKey,
      };
    case ACTIONS.SET_ORG_N_Tenant_LIST:
      return {
        ...state,
        orgNTenantList: payload.data, // 确保状态一致
      };
    case ACTIONS.TOGGLE_SNACKBAR:
      return {
        ...state,
        snackbarShow: payload
      };
    case ACTIONS.SHOW_SNACKBAR_MESSAGE:
      return {
        ...state,
        snackbarShow: payload.show,
        snackbarProps: { ...payload.props },
      };
    case ACTIONS.SET_IS_LOADING:
      return { ...state, isLoading: payload };
    default:
      return state;
  }
};

function* getOrgNTenantList() {
  yield put({ type: ACTIONS.SET_IS_LOADING, payload: true });
  try {
    const res = yield call(Api.getOrgNTenantList);
    if (res.length < 0) {
      console.error(`Error fetching getOrgNTenantList: list length is 0`);
      return;
    }
    yield put({
      type: ACTIONS.SET_ORG_N_Tenant_LIST, payload: {
        data: res.data, // 只傳遞可序列化的數據
      }
    });
  } catch (error) {
    console.error("Error in getOrgNTenantList saga:", error);
  } finally {
    yield put({ type: ACTIONS.SET_IS_LOADING, payload: false });
  }
}

function* checkUserLogin(action) {
  yield put({ type: ACTIONS.SET_IS_LOADING, payload: true });
  try {

    let { orgName, tenantName } = action.payload
    const res = yield call(Api.checkUserLogin, { orgName, tenantName });
    // 假设 API 返回了一个 `error` 字段表示错误
    if (res.error) {
      throw new Error(res.errorMessage || "Login failed");
    }
    // 成功后，触发 SUCCESS 的 Redux Action
    yield put({
      type: ACTIONS.CHECK_USER_LOGIN_SUCCESS, payload: {
        data: res.data, // 只傳遞可序列化的數據
      }
    });
    // 如果调用方传递了 resolve 回调，则调用它
    if (action.resolve) action.resolve(res);
  } catch (error) {
    console.error("Error in checkUserLogin saga:", error);
    // 失败后，触发 FAILURE 的 Redux Action
    yield put({ type: ACTIONS.CHECK_USER_LOGIN_FAILURE, payload: error.message });

    // 如果调用方传递了 reject 回调，则调用它
    if (action.reject) action.reject(error);
  } finally {
    yield put({ type: ACTIONS.SET_IS_LOADING, payload: false });
  }
}

const ViewSaga = function* () {
  yield takeEvery(ACTIONS.GET_ORG_N_Tenant_LIST, getOrgNTenantList);
  yield takeEvery(ACTIONS.CHECK_USER_LOGIN, checkUserLogin);
};

export { ViewReducer, ViewSaga };