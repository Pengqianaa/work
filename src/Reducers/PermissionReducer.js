
const initialState = {
  roleList: ["ADMIN", "GENERAL", "IT-ADMIN"],
  menuList: [],
  userKey: '',
  findUser: {},
  queryResults: { content: [] },
  prevQuery: {}, // 用于保存上一次的查询参数
};

export const ACTIONS = {
  ADD_UPDATE_PERMISSION: 'ADD_UPDATE_PERMISSION',
  GET_USER_KEY: 'GET_USER_KEY',
  SET_USER_KEY: 'SET_USER_KEY',
  FINE_USER: 'FINE_USER',
  SET_PERMISSION_USER: 'SET_PERMISSION_USER',
  GET_ROLE_LIST: 'GET_ROLE_LIST',
  SET_ROLE_LIST: 'SET_ROLE_LIST',
  GET_MENU: 'GET_MENU',
  SET_MENU: 'SET_MENU',
  GET_PERMISSION_LIST: 'GET_PERMISSION_LIST',
  SET_PERMISSION_LIST: 'SET_PERMISSION_LIST',
  DELETE_PERMISSION: 'DELETE_PERMISSION',
};

const PermissionReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.SET_PERMISSION_USER:
      return {
        ...state,
        findUser: payload?.data || {},
      };
    case ACTIONS.SET_USER_KEY:
      // userKey
      return {
        ...state,
        userKey: payload?.data || '',
        // userKey:'123'
      };
    case ACTIONS.SET_MENU:
      return {
        ...state,
        menuList: payload?.data || [],
      };
    case ACTIONS.SET_ROLE_LIST:
      return {
        ...state,
        roleList: payload?.data || [],
      };
    case ACTIONS.SET_PERMISSION_LIST:
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

// 刷新权限列表
function* refreshPermissionList() {
  const prevParam = yield select((state) => state.permission.prevQuery); // 获取上一次的查询参数
  if (prevParam) {
    yield put({
      type: ACTIONS.GET_PERMISSION_LIST,
      payload: prevParam, // 使用上一次的查询参数
    });
  } else {
    console.warn("No previous query parameters found.");
  }
}

// 获取角色列表
function* getRoleList({ payload }) {
  yield put({ type: Actions.SET_IS_LOADING, payload: true });
  try {
    const { isGlobal } = payload;
    const res = yield call(Api.getPermissionRoleList, { isGlobal });
    if (res.length < 0) {
      console.error(`Error fetching getPermRoleList: list length is 0`);
      return;
    }
    yield put({
      type: ACTIONS.SET_ROLE_LIST,
      payload: {
        data: res.data,
      },
    });
  } catch (error) {
    console.error("Error in getPermRoleList saga:", error);
  } finally {
    yield put({ type: Actions.SET_IS_LOADING, payload: false });
  }
}

// 添加或更新权限
function* postAddUpdatePermission({ payload }) {
  const { orgName, userInfo, message, msgType } = payload; // 從 payload 中解構出提示信息
  yield put({ type: Actions.SET_IS_LOADING, payload: true });

  try {
    const res = yield call(Api.postPermissionUser, { orgName, userInfo });
    yield call(refreshPermissionList); // 添加或更新成功后刷新列表

    if (res.status === 200) {
      // 顯示業務邏輯的提示信息（如果存在）
      if (message) {
        yield put({
          type: ViewActions.SHOW_SNACKBAR_MESSAGE,
          payload: {
            show: true,
            props: {
              message,
              msgType,
              autoHideDuration: null,
            },
          },
        });
      } else {
        // 默認的成功提示
        yield put({
          type: ViewActions.SHOW_SNACKBAR_MESSAGE,
          payload: {
            show: true,
            props: {
              message: "success!",
              msgType: 1,
              autoHideDuration: 6000,
            },
          },
        });
      }
    } else {
      // API 請求失敗的提示
      yield put({
        type: ViewActions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: "fail!",
            msgType: 4,
            autoHideDuration: null,
          },
        },
      });
    }
  } catch (error) {
    console.error("Error in postAddUpdatePermission saga:", error);
    // 錯誤提示
    yield put({
      type: ViewActions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: "An error occurred. Please try again later.",
          msgType: 4,
          autoHideDuration: 6000,
        },
      },
    });
  } finally {
    yield put({ type: Actions.SET_IS_LOADING, payload: false });
  }
}

// 查找用户
function* findUser({ payload }) {
  yield put({ type: Actions.SET_IS_LOADING, payload: true });
  const keyword = payload;
  try {
    const res = yield call(Api.findUser, { keyword });
    if (res.length < 0) {
      console.error(`Error fetching findUser: list length is 0`);
      return;
    }
    yield put({
      type: ACTIONS.SET_PERMISSION_USER,
      payload: {
        data: res.data,
      },
    });
  } catch (error) {
    console.error("Error in findUser saga:", error);
  } finally {
    yield put({ type: Actions.SET_IS_LOADING, payload: false });
  }
}

// 获取用户 Key
function* getUserKey(action) {
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
      type: ACTIONS.SET_USER_KEY,
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

// 获取菜单列表
function* getMenuList({ payload }) {
  yield put({ type: Actions.SET_IS_LOADING, payload: true });
  try {
    const res = yield call(Api.getPermissionMenu, payload);
    if (res.length < 0) {
      console.error(`Error fetching getMenuList: list length is 0`);
      return;
    }
    yield put({
      type: ACTIONS.SET_MENU,
      payload: {
        data: res.data,
      },
    });
  } catch (error) {
    console.error("Error in getMenuList saga:", error);
  } finally {
    yield put({ type: Actions.SET_IS_LOADING, payload: false });
  }
}

// 获取权限列表
function* getPermissionList({ payload }) {
  yield put({ type: Actions.SET_IS_LOADING, payload: true });
  try {
    const res = yield call(Api.getPermissionList, payload);
    yield put({
      type: ACTIONS.SET_PERMISSION_LIST,
      payload: {
        data: res.data, // API 返回的数据
        params: payload, // 保存查询参数
      },
    });
  } catch (error) {
    console.error("Error in getPermissionList saga:", error);
  } finally {
    yield put({ type: Actions.SET_IS_LOADING, payload: false });
  }
}

// 删除权限
function* deletePermission({ payload }) {
  yield put({ type: Actions.SET_IS_LOADING, payload: true });
  const { orgName, userInfo } = payload;
  try {
    const res = yield call(Api.deletePermission, { orgName, userInfo });
    yield call(refreshPermissionList); // 删除成功后刷新列表
    if(res.status===200){
      yield put({
        type: ViewActions.SHOW_SNACKBAR_MESSAGE,
        payload: {
            show: true,
            props: {
                message: "Delete success!",
                msgType: 1,
                autoHideDuration: 6000,
            },
        },
      })
    }else{
      yield put({
        type: ViewActions.SHOW_SNACKBAR_MESSAGE,
        payload: {
            show: true,
            props: {
                message: "Delete fail!",
                msgType: 4,
                autoHideDuration: null,
            },
        },
      })
    }
  } catch (error) {
    console.error("Error in deletePermission saga:", error);
  } finally {
    yield put({ type: Actions.SET_IS_LOADING, payload: false });
  }
}

// 监听所有 Saga
const PermissionSaga = function* () {
  yield takeEvery(ACTIONS.ADD_UPDATE_PERMISSION, postAddUpdatePermission);
  yield takeEvery(ACTIONS.GET_USER_KEY, getUserKey);
  yield takeEvery(ACTIONS.FINE_USER, findUser);
  yield takeEvery(ACTIONS.GET_ROLE_LIST, getRoleList);
  yield takeEvery(ACTIONS.GET_MENU, getMenuList);
  yield takeEvery(ACTIONS.GET_PERMISSION_LIST, getPermissionList);
  yield takeEvery(ACTIONS.DELETE_PERMISSION, deletePermission);
};

export { PermissionReducer, PermissionSaga };
