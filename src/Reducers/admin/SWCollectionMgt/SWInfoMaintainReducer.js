import { call, put, takeEvery } from "redux-saga/effects";
import Api from "src/api/admin/SWCollectionMgt/SWInfoMaintainApi";
import {
  Actions,
  STATUS_TYPE,
  SNACKBAR_MESSAGE_DURATION,
  INITIAL_STATE,
} from "src/constants/common";
export const ACTIONS = {
  ADD_SW_BRAND: "ADD_SW_BRAND",
  SET_BRAND_LIST: "SET_BRAND_LIST",
  GET_BRAND_LIST: "GET_BRAND_LIST"
};

const initialState = {
  ...INITIAL_STATE,

  brandList:[],
};

const SWInfoMaintainReducer = (state = initialState, action) => {

  const { type, payload } = action;
  switch (type) {
    case ACTIONS.SET_BRAND_LIST:
      return {
        ...state,
        brandList:payload.list,
      };
    default:
      return state;
  }
};

function* addSwBrand({ payload }) {
  let { brandName } = payload
  let msg = "";
  let type = STATUS_TYPE.SUCCESS
  try {
    const { status, data } = yield call(Api.addSwBrand, brandName);
    msg = data.message;
    if (status !== 200 || data.code !== 0) {
      type = STATUS_TYPE.ERROR
      return;
    }
    yield put({
			type: ACTIONS.GET_BRAND_LIST
		});
  } catch (error) {
    msg = error;
    type = STATUS_TYPE.ERROR
    throw new Error(`[addSwBrand]: ${error}`);
  } finally {
    const duration =
    type === STATUS_TYPE.SUCCESS ? SNACKBAR_MESSAGE_DURATION : null;
    if (!msg) {
      return;
    }
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
}

function* getNewSWBrandList({ payload }) {
  let msg = "";
  try {
    const { status, data } = yield call(Api.getSwBrandList);
    if (status !== 200) {
      msg = data.message;
      return;
    }
    let list = data.data;

    yield put({
      type: ACTIONS.SET_BRAND_LIST,
      payload: {
        list:list??[],
      },
    });

  } catch (error) {
    msg = error;
    throw new Error(`[getNewSWBrandList]: ${error}`);
  } finally {
    if (!msg) {
      return;
    }
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: msg,
          msgType: STATUS_TYPE.ERROR,
          autoHideDuration: null,
        },
      },
    });
  }
}

const SWInfoMaintainSaga = [
  takeEvery(ACTIONS.ADD_SW_BRAND, addSwBrand),
  takeEvery(ACTIONS.GET_BRAND_LIST, getNewSWBrandList),
  
];

export { SWInfoMaintainReducer, SWInfoMaintainSaga };
