import Api from "../Common/api";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { Actions } from "../Common/constants";
import { ACTIONS as ViewActions } from "./ViewReducer";

const initialState = {
  sidebarShow: "responsive",
  user: {},
  computerNames: [],
  token: null,
  isAuthenticated: false, // 初始为 false
  installed: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  request: [],
  rTotal: 0,
  rPageNum: 1,
  rPageSize: 10,
  permissionIds: [],
  isLoading: false, // 新增加载状态
  role: '',
  userKey: '',
};

export const ACTIONS = {
  SET_LOGIN_USER_KEY: "SET_LOGIN_USER_KEY",
  GET_LOGIN_USER_KEY: "GET_LOGIN_USER_KEY",
  SET_USER: "SET_USER",
  GET_USER: "GET_USER",
  STORE_USER: "STORE_USER",
  SET_ROLE: "SET_ROLE",
  GET_USER_KEY: 'GET_USER_KEY',
};

const UserReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.SET_ROLE:
      return {
        ...state,
        role: payload.role,
        // role : ["IT_ADMIN"]
        // role : ["ADMIN"]
        // role : ["GENERAL"]
      };
    case ACTIONS.SET_LOGIN_USER_KEY:
      return {
        ...state,
        // userKey: payload?.data || '',
        userKey:'123'
      };
    case ACTIONS.SET_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...payload.user
        },
        isAuthenticated: !!payload.user, // 确保状态一致
      };
    case ACTIONS.STORE_USER:
      return {
        ...state,
        isAuthenticated: !!action.payload,
        token: action.payload.token,
      };
    case Actions.SET_IS_LOADING:
      return { ...state, isLoading: payload };
    case Actions.SET_SAM_FUNCTION_LIST:
      return { ...state, user: { ...state.user, userFunctions: payload.list } };
    case Actions.SET_PERMISSIONS:
      return { ...state, permissionIds: Array.isArray(payload) ? payload : [] }; // 确保为数组
    case Actions.SET_INSTALLED_APPS:
      return {
        ...state,
        installed: payload.installed || [],
        total: payload.total || 0,
        pageNum: payload.pageNum || 1,
        pageSize: payload.pageSize || 10,
      };
    case Actions.SET_REQUEST_LIST:
      return {
        ...state,
        request: payload.request || [],
        rTotal: payload.rTotal || 0,
        rPageNum: payload.rPageNum || 1,
        rPageSize: payload.rPageSize || 10,
      };
    default:
      return state;
  }
};

function* getUser() {
  yield put({ type: Actions.SET_IS_LOADING, payload: true });
  try {
    const res = yield call(Api.getCurrentUser);
    if (!res.data) {
      console.error(`Error fetching user: ${res.data.message}`);
      return;
    }
    const userData = res.data.user;
    const userRoles = res.data.roleCodes;
    yield put({ type: ACTIONS.SET_USER, payload: { user: userData } });
    yield put({ type: ACTIONS.SET_ROLE, payload: { role: userRoles } });
  } catch (error) {
    console.error("Error in getUser saga:", error);
  } finally {
    yield put({ type: Actions.SET_IS_LOADING, payload: false });
  }
}

// 获取用户 Key
function* getLoginUserKey(action) {
  yield put({ type: ViewActions.SET_IS_LOADING, payload: true });
  try {
    let { payload } = action
    const res = yield call(Api.getPermissionUserKey, payload);
    if (action.resolve) action.resolve(res);
    if (res.length < 0) {
      console.error(`Error fetching getUserKey: list length is 0`);
      return;
    }
    yield put({
      type: ACTIONS.SET_LOGIN_USER_KEY,
      payload: {
        data: res.data,
      },
    });
  } catch (error) {
    if (action.reject) action.reject(error);
    console.error("Error in getUserKey saga:", error);
  } finally {
    yield put({ type: ViewActions.SET_IS_LOADING, payload: false });
  }
}

const UserSaga = function* () {
  yield takeEvery(ACTIONS.GET_USER, getUser);
  yield takeEvery(ACTIONS.GET_LOGIN_USER_KEY, getLoginUserKey);
};

export { UserReducer, UserSaga };
