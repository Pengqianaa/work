import {
  Actions,
  STATUS_TYPE,
  SNACKBAR_MESSAGE_DURATION,
} from "src/constants/common";
import { call, put, takeEvery } from "redux-saga/effects";
import Api from "../Common/api";

export const ACTIONS = {
  GET_FREEWARE_REVIEW_LIST: "GET_FREEWARE_REVIEW_LIST",
  SET_FREEWARE_REVIEW_LIST: "SET_FREEWARE_REVIEW_LIST",
  SET_MESSAGE: "SET_MESSAGE",
  SET_QUERY_APPLYNAME: "SET_QUERY_APPLYNAME",
  SET_QUERY_BRAND: "SET_QUERY_BRAND",
};

const initialState = {
  freewarereveiver: {},
  message: {},
  applyNameList: [],
  brandList: [],
};

const FreewareRevireReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_FREEWARE_REVIEW_LIST:
      return {
        ...state,
        freewarereveiver: action.payload,
      };
    case ACTIONS.SET_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };
    case ACTIONS.SET_QUERY_APPLYNAME:
      return {
        ...state,
        applyNameList: action.payload?.applyNameList,
      };
    case ACTIONS.SET_QUERY_BRAND:
      return {
        ...state,
        brandList: action.payload?.brandList,
      };
    default:
      return state;
  }
};

function* getFreewarereveiver({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  const { data } = yield call(Api.getFreewarereveiver, payload);

  if (data?.code === 0) {
    yield put({
      type: ACTIONS.SET_FREEWARE_REVIEW_LIST,
      payload: {
        freewarereveiver: data.data,
      },
    });
  }
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}

function* getFreewareBrandList() {
  let res = yield call(Api.getFreewareBrand, {});
  if (res.data.code !== 0) {
    return;
  }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      freewareBrandList: res.data.data,
    },
  });
}
function* saveFreewareReviewNote({ payload, queryParams }) {
  // 调用API并处理可能的异常
  const { data } = yield call(Api.saveFreewareReviewNote, payload);
  // 根据响应状态设置消息参数
  const isSuccess = data.code !== -1;
  const msgType = isSuccess ? STATUS_TYPE.SUCCESS : STATUS_TYPE.ERROR;
  const message = isSuccess
    ? "success"
    : data.message || "操作失败，请稍后重试";

  // 显示提示信息
  yield put({
    type: Actions.SHOW_SNACKBAR_MESSAGE,
    payload: {
      show: true,
      props: {
        message,
        msgType,
        // 仅成功时自动隐藏，错误需手动关闭
        autoHideDuration: isSuccess ? SNACKBAR_MESSAGE_DURATION : null,
      },
    },
  });

  yield put({
    type: ACTIONS.GET_FREEWARE_REVIEW_LIST,
    payload: {
      ...queryParams,
    },
  });
}

function* editFreewareReview({ payload, queryParams }) {
  let type = STATUS_TYPE.SUCCESS;
  let msg = "";
  // 调用 API 进行免费软件审核编辑操作
  let res = yield call(Api.editFreewareReview, payload);
  msg = res.data?.message;

  // 根据返回的状态码设置消息类型
  if (res.data.code === -1) {
    type = STATUS_TYPE.ERROR;
  }
  // 计算自动隐藏持续时间，如果是成功状态则使用预设的持续时间，否则为 null
  const duration =
    type === STATUS_TYPE.SUCCESS ? SNACKBAR_MESSAGE_DURATION : null;
  yield put({
    type: ACTIONS.GET_FREEWARE_REVIEW_LIST,
    payload: {
      ...queryParams,
    },
  });
  // 触发显示消息的 action
  yield put({
    type: Actions.SHOW_SNACKBAR_MESSAGE,
    payload: {
      show: true,
      props: {
        message: msg,
        msgType: type,
        autoHideDuration: duration,
      },
    },
  });
}

function* queryApplyName({ payload }) {
  let res = yield call(Api.queryApplyName, payload);
  if (res.data.code === 0) {
    yield put({
      type: ACTIONS.SET_QUERY_APPLYNAME,
      payload: {
        applyNameList: res.data.data.freewareNameList,
      },
    });
  }
}

function* queryBrand({ payload }) {
  const data = {
    brandName: "",
  };
  data.brandName = payload.brand;
  let res = yield call(Api.queryBrand, data);
  if (res.data.code === 0) {
    yield put({
      type: ACTIONS.SET_QUERY_BRAND,
      payload: {
        brandList: res.data.data,
      },
    });
  }
}

const FreewareRevireSaga = [
  takeEvery(ACTIONS.GET_FREEWARE_REVIEW_LIST, getFreewarereveiver),
  takeEvery("getFreewareBrandList", getFreewareBrandList),
  takeEvery("saveFreewareReviewNote", saveFreewareReviewNote),
  takeEvery("editFreewareReview", editFreewareReview),
  takeEvery("queryApplyName", queryApplyName),
  takeEvery("queryBrand", queryBrand),
];
export { FreewareRevireReducer, FreewareRevireSaga };

// area的默認值為登入人帶入
