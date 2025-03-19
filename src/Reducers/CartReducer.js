import Api from "../Common/api";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { Actions } from "../Common/constants";
import { delay } from "@redux-saga/core/effects";

import getLocaleData from "../i18n/_locale";

const env = process.env.NODE_ENV;

const initialState = {
  cart: [],
  installationDetails: {},
  msg: null,
};

const CartReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case Actions.ADD_INTO_DETAILS: {
      let newObj = { ...state.installationDetails };
      payload.computerNames.forEach((e) => {
        let list = state.installationDetails[e];
        let set = new Set(list ? list : []);
        payload.assetIds.forEach((el) => {
          set.add(el);
        });
        newObj[e] = [...set];
      });
      return { ...state, installationDetails: { ...newObj } };
    }
    case Actions.EDIT_DETAILS: {
      let newObj = { ...state.installationDetails };
      payload.computerNames.forEach((e) => {
        newObj[e] = [...payload.assetIds];
      });
      return { ...state, installationDetails: { ...newObj } };
    }
    case Actions.REMOVE_FROM_DETAILS: {
      let newObj = { ...state.installationDetails };
      delete newObj[payload];
      return { ...state, installationDetails: { ...newObj } };
    }
    case Actions.REMOVE_FROM_DETAILS_BY_ID: {
      let newObj = { ...state.installationDetails };
      Object.keys(newObj).forEach((e) => {
        let set = new Set(newObj[e]);
        set.delete(payload);
        if (set.size > 0) {
          newObj[e] = [...set];
        } else {
          delete newObj[e];
        }
      });
      return { ...state, installationDetails: { ...newObj } };
    }
    case Actions.CLEAR_DETAILS: {
      return { ...state, installationDetails: {} };
    }
    case Actions.ADD_INTO_CART_LIST: {
      let addList = state.cart;

      let exist = addList.filter((e) => e.assetId === payload.assetId);
      if (exist.length > 0) {
        return { ...state };
      } else {
        addList.push(payload);
        return { ...state, cart: [...addList] };
      }
    }

    case Actions.REMOVE_FROM_CART_LIST: {
      let removeList = state.cart;
      let rmIdx = null;
      removeList.forEach((item, index) => {
        if (item.assetId === payload) {
          rmIdx = index;
        }
      });
      removeList.splice(rmIdx, 1);
      return { ...state, cart: [...removeList] };
    }
    case Actions.CLEAR_CART_LIST:
      return { ...state, cart: [] };
    case Actions.UPDATE_CART_LIST:
      return { ...state, cart: payload ? [...payload] : [] };
    case Actions.SET_QUERY_FILTERS:
      return {
        ...state,
        ...payload
      }
    default:
      return state;
  }
};

function* getCartList({ payload }) {
  try {
    let cartListRes = yield call(Api.getCartItemList);

    yield put({
      type: Actions.UPDATE_CART_LIST,
      payload: cartListRes.data.data,
    });
  } catch (error) {
    console.error(error);
  }
}

function* addIntoCart({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  let {
    assetId,
    brand,
    categoryId,
    categoryName,
    graph,
    id,
    isAvailable,
    refUrl,
    referenceCurrency,
    referencePrice,
    sku,
    softwareDesc,
    softwareName,
    sourceId,
    sourceName,
    userId,
    version,
  } = payload;

  let res = yield call(Api.addCartItem, {
    assetId,
    brand,
    categoryId,
    categoryName,
    graph,
    id,
    isAvailable,
    refUrl,
    referenceCurrency,
    referencePrice,
    sku,
    softwareDesc,
    softwareName,
    sourceId,
    sourceName,
    userId,
    version,
  });
  if (payload.flag) {
    let msg = res.data
    yield put({
      type: Actions.SET_QUERY_FILTERS,
      payload: {
        msg: msg,
      }
    });
  }
  yield delay(1000, "delay");
  let cartListRes = yield call(Api.getCartItemList);

  yield put({
    type: Actions.UPDATE_CART_LIST,
    payload: cartListRes.data.data,
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}

function* removeItemInCart({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  yield call(Api.deleteCartItem, { id: payload });
  yield delay(1000, "delay");
  let cartListRes = yield call(Api.getCartItemList);

  yield put({
    type: Actions.REMOVE_FROM_DETAILS_BY_ID,
    payload,
  });
  yield put({
    type: Actions.UPDATE_CART_LIST,
    payload: cartListRes.data.data,
  });
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}

function* sendInstallApplication({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  let { reasons } = payload;

  let { empCode, userId } = yield select((state) => state.user.user);
  let currentLocale = yield select((state) => state.view.currentLocale);
  let { cart, installationDetails } = yield select((state) => state.cart);

  if (!empCode && env !== "development") {
    yield put({
      type: Actions.SET_IS_LOADING,
      payload: false,
    });
    return;
  }

  let params = {
    empCode,
    applicant: userId,
    language: currentLocale,
    reason: reasons,
    items: [],
    sendInstallApplicationCategory:payload?.sendInstallApplicationCategory??"",
  };


  Object.keys(installationDetails).forEach((el) => {
    let IdArr = installationDetails[el];
    let assetObjArr = cart.filter((e) => IdArr.includes(e.id));

    assetObjArr.forEach((asset) => {
      let item = {
        assetId: asset.assetId,
        catId: asset.categoryId,
        sourceId: asset.sourceNumber,
        sourceSystemId: asset.sourceSystemId,
        empCode,
        computerName: el,
      };
      params.items.push(item);
    });
  });

  const res = yield call(Api.sendInstallRequest, params);
  const messages = getLocaleData(currentLocale);
  if (res?.response && res?.response?.status !== 200) {
    yield put({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props: {
          title: messages["common.title"],
          message: messages["cart.modal.defaultErrorMsg"],
          hasCancel: false,
          callback: () => null,
        },
      },
    });
  } else if (res?.data && res?.data?.code !== 0) {
    yield put({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props: {
          title: messages["common.title"],
          message: res.data.message
            ? res.data.message
            : messages["cart.modal.defaultErrorMsg"],
          hasCancel: false,
          callback: () => null,
        },
      },
    });
  } else {
    yield put({
      type: Actions.SET_SHOW_CART_OVERLAY,
      payload: false,
    });
    yield put({
      type: Actions.CLEAR_DETAILS,
    });
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
function* setMsg({ payload }) {
  let { msg } = payload
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      msg: msg
    }
  })
}
const CartSaga = [
  takeEvery("getCartList", getCartList),
  takeEvery("addIntoCart", addIntoCart),
  takeEvery("removeItemInCart", removeItemInCart),
  takeEvery("sendInstallApplication", sendInstallApplication),
  takeEvery('setMsg', setMsg),
];

export { CartReducer, CartSaga };
