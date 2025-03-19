import { call, put, select, takeEvery } from "redux-saga/effects";
import CommonApi from "src/Common/api";
import Api from "src/api/admin/AuthorizationMgtApi";
import {
  Actions,
  STATUS_TYPE,
  SNACKBAR_MESSAGE_DURATION,
  INITIAL_STATE,
} from "src/constants/common";
import { DEFAULT_SORT_COL } from "src/constants/admin/AuthorizationMgt";

export const ACTIONS = {
  SET_BGBU_LIST: "SET_BGBU_LIST",
  GET_BGBU_LIST: "GET_BGBU_LIST",
  GET_AUTHORIZATION_MGT_LIST: "GET_AUTHORIZATION_MGT_LIST",
  SET_AUTHORIZATION_MGT_LIST: "SET_AUTHORIZATION_MGT_LIST",
  SET_MODIFIED_AUTHORIZATION_MGT: "SET_MODIFIED_AUTHORIZATION_MGT",
  POST_AUTHORIZATION_MGT: "POST_AUTHORIZATION_MGT",
  DELETE_AUTHORIZATION_MGT: "DELETE_AUTHORIZATION_MGT",
};

export const INIT_MODIFIED_DATA = {
  userId: "",
  empCode: null,
  areaIds: [],
  bgIds: [],
  buIds: [],
  costCenters: [],
  brandIds: [],
  name: "",
};

const initialState = {
  ...INITIAL_STATE,
  bgbuList: [],
  keyword: "",
  sort: `${DEFAULT_SORT_COL},asc`,
  modifyData: {
    ...INIT_MODIFIED_DATA,
  },
};

const mapping = (list) =>
  list.map((el) => {
    let bgbu = [];
    let ebgbu = [];
    el.bgs.forEach((bg) => {
      el.bus.forEach((bu) => {
        if (bu.bgId === bg.id) {
          bgbu.push(`${bg.bgShortName}/${bu.buShortName}`);
        }
      });
    });

    const areaTexts = el.areas.map(
      (area) => `${area.areaName}${area.areaEname ? `-${area.areaEname}` : ""}`
    );
    const costTexts = el.costCenters.map(
      (costCenter) => costCenter.costDeptCode
    );
    const brandTexts = el.brands.map((brand) => brand.brandName);

    return {
      ...el,
      bgbu,
      // bgbu: bgbu.join(", "),
      ebgbu: ebgbu.join(", "),
      areaTexts: areaTexts.join(", "),
      costTexts: costTexts.join(", "),
      brandTexts: brandTexts.join(", "),
    };
  });

const AuthorizationMgtReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ACTIONS.SET_AUTHORIZATION_MGT_LIST: {
      const { keyword, number, totalElements, size, totalPages, content } =
        payload;

      return {
        ...state,
        keyword,
        currentPage: number,
        total: totalElements,
        pageSize: size,
        totalPages,
        list: content,
      };
    }
    case ACTIONS.SET_MODIFIED_AUTHORIZATION_MGT:
      return {
        ...state,
        modifyData: payload,
      };
    case Actions.SET_BGBU_LIST:
      return { ...state, bgbuList: [...payload] };
    default:
      return state;
  }
};

function* getAuthorizationMgtList({ payload }) {
  let msg = "";
  try {
    yield put({ type: Actions.SET_IS_LOADING, payload: true });

    const { status, data } = yield call(Api.getAuthorizationMgtList, payload);

    if (status !== 200 || data.code !== 0) {
      msg = data.message;
      return;
    }

    const { content, page } = data.data;
    if (!content.length) {
      return;
    }

    const list = mapping(content);
    yield put({
      type: ACTIONS.SET_AUTHORIZATION_MGT_LIST,
      payload: {
        ...page,
        content: list,
        keyword: payload.keyword,
      },
    });
  } catch (error) {
    console.error(`[getAuthorizationMgtList]: ${error}`);
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

function* postAuthorizationMgt({ payload }) {
  let type = STATUS_TYPE.SUCCESS;
  let msg = "";
  try {
    yield put({ type: Actions.SET_IS_LOADING, payload: true });

    const { action, data: _data } = payload;
    const { buIds } = _data;

    const bgbuList = yield select((state) => state.authorizationMgt.bgbuList);
    const hasNegative1 = buIds.includes(-1);

    let bgIds = hasNegative1 ? [-1] : new Set([]);

    if (!hasNegative1) {
      buIds.forEach((bu) => {
        const bg = bgbuList.find((item) => item.buId && item.buId === bu);
        if (bg.bgId) {
          bgIds.add(bg.bgId);
        }
      });
    }

    const { status, data } = yield call(Api.modifyAuthorizationMgt, {
      action,
      data: {
        ..._data,
        bgIds: [...bgIds],
        buIds: hasNegative1 ? [-1] : buIds,
      },
    });
    msg = data.message;
    if (status !== 200 || data.code !== 0) {
      type = STATUS_TYPE.ERROR;
      return;
    }
  } catch (error) {
    console.error(`[postAuthorizationMgt]: ${error}`);
  } finally {
    const keyword = yield select((state) => state.authorizationMgt.keyword);
    const duration =
      type === STATUS_TYPE.SUCCESS ? SNACKBAR_MESSAGE_DURATION : null;

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

    yield put({
      type: ACTIONS.GET_AUTHORIZATION_MGT_LIST,
      payload: { keyword },
    });
  }
}

function* deleteAuthorizationMgt({ payload }) {
  let type = STATUS_TYPE.SUCCESS;
  let msg = "";
  try {
    yield put({ type: Actions.SET_IS_LOADING, payload: true });

    const { status, data } = yield call(Api.deleteAuthorizationMgt, payload);
    msg = data.message;
    if (status !== 200 || data.code !== 0) {
      type = STATUS_TYPE.ERROR;
      return;
    }
  } catch (error) {
    console.error(`[deleteAuthorizationMgt]: ${error}`);
  } finally {
    const duration =
      type === STATUS_TYPE.SUCCESS ? SNACKBAR_MESSAGE_DURATION : null;

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

    yield put({
      type: ACTIONS.GET_AUTHORIZATION_MGT_LIST,
      payload: {},
    });
  }
}

function* getBgBuList({ payload }) {
  let resBg = yield call(CommonApi.getBgByIds, { bgIds: null });
  let resBu = yield call(CommonApi.getBuByIds, { buIds: null });

  let bgbuList = [];

  resBg.data.data.forEach((bg) => {
    bgbuList.push(bg);

    resBu.data.data.forEach((bu) => {
      if (bu.bgId === bg.id) {
        bu.bgbuName = `${bg.bgShortName}/${bu.buShortName}`;
        bu.buId = bu.id;
        bgbuList.push(bu);
      }
    });
  });

  yield put({
    type: ACTIONS.SET_BGBU_LIST,
    payload: bgbuList,
  });
}

const AuthorizationMgtSaga = [
  takeEvery(ACTIONS.GET_AUTHORIZATION_MGT_LIST, getAuthorizationMgtList),
  takeEvery(ACTIONS.POST_AUTHORIZATION_MGT, postAuthorizationMgt),
  takeEvery(ACTIONS.DELETE_AUTHORIZATION_MGT, deleteAuthorizationMgt),
  takeEvery(ACTIONS.GET_BGBU_LIST, getBgBuList),
];

export { AuthorizationMgtReducer, AuthorizationMgtSaga };
