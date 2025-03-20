import Api from "../Common/api";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { Actions, ADMIN_ROLES } from "../Common/constants";
import navigation from "../Components/AdminComponents/_nav";

const permissionUrl = [{
        page: "freewarereview",
        permission: [ADMIN_ROLES.FREEWARE_REVIEW],
    },
    {
        page: "eformquery",
        permission: [ADMIN_ROLES.E_FORM_QUERY],
    },
    {
        page: "softwareinfo",
        permission: [ADMIN_ROLES.VENDOR],
    },
    {
        page: "permissionmgt",
        permission: [ADMIN_ROLES.IT_ADMIN],
    },
    {
        page: "eformauth",
        permission: [ADMIN_ROLES.SO_TEAM],
    },
    {
        page: "softwaresdpmgt",
        permission: [ADMIN_ROLES.SERVER_TEAM, ADMIN_ROLES.CLIENT_TEAM],
    },
    {
        page: "viplistmgt",
        permission: [ADMIN_ROLES.CLIENT_TEAM],
    },
    {
        page: "softwareinfomgt",
        permission: [ADMIN_ROLES.SERVER_TEAM, ADMIN_ROLES.SO_TEAM],
    },
    {
        page: "swcollection",
        permission: [ADMIN_ROLES.SW_COLLECTOR],
    },
    {
        page: "swcollectionmgt",
        permission: [ADMIN_ROLES.SW_DATA_VIEWER],
    },
    {
        page: "swassetmgt",
        permission: [ADMIN_ROLES.LEGAL_TEAM, ADMIN_ROLES.SECURITY_TEAM],
    },
    {
        page: "samfunctionmgt",
        permission: [ADMIN_ROLES.IT_ADMIN],
    },
    {
        page: "eformerrormgt",
        permission: [ADMIN_ROLES.IT_ADMIN],
    },
];

const initialState = {
    permissions: [],

    currentPage: 1,
    total: 3,
    pageSize: 5,
    totalPages: 1,
    adminUserList: [],

    // for user role edit
    adminUsers: [],
    userRoles: [],
    sideBarList: [...navigation],
};

const PermissionReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.SET_PERMISSIONS:
      return { ...state, permissions: payload.map((el) => el) };
      case Actions.SET_DASHBOARD_DATA:
        return {...state,...payload };
    case Actions.SET_ADMIN_USERS:
      return {
        ...state,
        currentPage: payload.currentPage,
        total: payload.total,
        pageSize: payload.pageSize,
        totalPages: payload.totalPages,
        adminUserList: payload.adminUserList,
      };
    case Actions.SET_ADMIN_USERS_LIST:
      return { ...state, adminUsers: [...payload] };
    case Actions.SET_ROLE_LIST:
      return { ...state, userRoles: [...payload] };
    case Actions.SET_SIDEBAR_LIST:
      return { ...state, sideBarList: [...payload] };
    default:
      return state;
  }
};

function* getCurrentUserRoles() {
    let res = yield call(Api.queryPermissionRole);

    if (res.data.data) {
        // "data" : [ {"roleId" : 8,"roleName" : "IT_ADMIN"}, { "roleId" : 9,"roleName" : "S&O Team"}, {"roleId" : 10,"roleName" : "Client Team"}, {...
        yield put({
            type: Actions.SET_PERMISSIONS,
            payload: res.data.data,
        });
    }
}

function* getPermissionList({ payload }) {
    let { keyWord, pageNum, pageSize, sidx, order } = payload;
    let res = yield call(Api.getPermissionList, {
        keyWord,
        pageNum,
        pageSize,
        sidx,
        order,
    });
    if (res.data.data) {
        yield put({
            type: Actions.SET_ADMIN_USERS,
            payload: {
                currentPage: res.data.data.pageNum,
                total: res.data.data.total,
                pageSize: res.data.data.pageSize,
                totalPages: res.data.data.pages,
                adminUserList: res.data.data.list,
            },
        });
    }
}

function* queryAdminUsers({ payload }) {
    let res = yield call(Api.queryPermissionUser, { keyWord: payload });
    if (res.data.data) {
        yield put({
            type: Actions.SET_ADMIN_USERS_LIST,
            payload: res.data.data,
        });
    }
}

function* getUserRoles() {
    let res = yield call(Api.queryPermissionRole);
    if (res.data.data) {
        yield put({
            type: Actions.SET_ROLE_LIST,
            payload: res.data.data,
        });
    }
}

function* updateRole({ payload }) {
    yield put({
        type: Actions.SET_IS_LOADING,
        payload: true,
    });
    let userRoles = yield select((state) => state.permission.userRoles);
    let currentUser = yield select((state) => state.user.user);

    let { user, role } = payload;
    let { account, empCode, fullName, remark, userId } = user;

    let params = {
        account,
        empCode,
        fullName,
        remark,
        roles: [...userRoles.filter((el) => role.includes(el.roleId))],
        userId,
    };
    try {
        let res = yield call(Api.doUpdatePermissionRole, params);
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
    } catch (e) {
        console.error("Error while update user role", e);
        yield put({
            type: Actions.SHOW_SNACKBAR_MESSAGE,
            payload: {
                show: true,
                props: {
                    message: "Error while update user role",
                    msgType: "error",
                    autoHideDuration: null,
                },
            },
        });
        yield put({
            type: Actions.SET_IS_LOADING,
            payload: falses,
        });
    }

    if (account === currentUser.userId) {
        window.location.reload();
        return;
    }

    let permissionStates = yield select((state) => state.permission);

    let res2 = yield call(Api.getPermissionList, {
        keyWord: null,
        pageNum: 1,
        pageSize: permissionStates.pageSize,
        sidx: null,
        order: "ASC",
    });
    if (res2.data.data) {
        yield put({
            type: Actions.SET_ADMIN_USERS,
            payload: {
                currentPage: res2.data.data.pageNum,
                total: res2.data.data.total,
                pageSize: res2.data.data.pageSize,
                totalPages: res2.data.data.pages,
                adminUserList: res2.data.data.list,
            },
        });
    }
    yield put({
        type: Actions.SET_IS_LOADING,
        payload: false,
    });
}

function* checkRole() {
    let permissions = yield select((state) => state.permission.permissions);
    if (permissions.length === 0) {
        let res = yield call(Api.queryPermissionFunction);
        if (res.data.data) {
            yield put({
                type: Actions.SET_PERMISSIONS,
                payload: res.data.data,
            });
            permissions = res.data.data.map((el) => el);
        }
    }
    // console.warn(window.location.pathname ,permissions)
    let pathArr = window.location.pathname.split("/");
    let page = `${pathArr[2]}`;
    let isPermitted = permissions.includes(page);

    let sidebar = [];

    navigation.forEach((el) => {
        if (el._tag === "CSidebarNavDivider" && sidebar.length > 0) {
            sidebar.push(el);
        } else if (
            el._tag !== "CSidebarNavDivider" &&
            permissions.includes(el.page)
        ) {
            sidebar.push(el);
        }
    });

    yield put({
        type: Actions.SET_SIDEBAR_LIST,
        payload: sidebar,
    });

    if (permissions.length === 0 || !isPermitted) {
        window.location.href = "/";
    }
}

function* goToAdminPage({ payload }) {
    let permissions = yield select((state) => state.permission.permissions);
    if (permissions.length === 0) {
        let res = yield call(Api.queryPermissionFunction);
        if (res.data.data) {
            yield put({
                type: Actions.SET_PERMISSIONS,
                payload: res.data.data,
            });
            permissions = res.data.data.map((el) => el);
        }
    }
    let pages = permissionUrl.map((el) => el.page);

    let nextPage = pages.filter((el) => permissions.includes(el))[0];

    if (nextPage) {
        payload(`/admin/${nextPage}`);
    } else {
        console.error(
            "Need to add role in src/Common/constants.js and permissionUrl"
        );
    }
}

function* goToDashboard({payload}){
  let res=yield call(Api.queryPermissionDashboardData,payload)
  if(res.data.code===0){
    yield put({
      type: Actions.SET_DASHBOARD_DATA,
      payload:{
        showDashboard:res.data.data,
      }
    })
  }  
}

const PermissionSaga = [
  takeEvery("getCurrentUserRoles", getCurrentUserRoles),
  takeEvery("checkRole", checkRole),
  takeEvery("getPermissionList", getPermissionList),
  takeEvery("queryAdminUsers", queryAdminUsers),
  takeEvery("getUserRoles", getUserRoles),
  takeEvery("updateRole", updateRole),
  takeEvery("goToAdminPage", goToAdminPage),
  takeEvery("goToDashboard", goToDashboard),
];

export { PermissionReducer, PermissionSaga };