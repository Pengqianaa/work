import Api from "../Common/api";
import { select, call, put, takeEvery } from "redux-saga/effects";
import { Actions } from "../Common/constants";

export const FUNCTION_CODES = {
  home: "home",
  commercial: "Commercial",
  addToAssetCart: "addToAssetCart",
  deltaLibrary: "deltaLibrary",
  freeware: "freeware",
  openSource: "openSource",
  trialWare: "trialware",
  deltaSoftwareTool: "deltaSoftwareTool",
  commercialLibrary: "commercialLibrary",
  patchDriver: "patchDriver",
  search: "search",
  myApp: "myApp",
  myRequest: "myRequest",
  assetCart: "assetCart",
  uninstall: "uninstall",
  userProfile: "userProfile",
  aboutSAM: "aboutSAM",
  lang: "lang",
  management: "management",
};

const initialState = {
  list: [], // type is Array, use at backend
  map: {}, // type is object, use at frontend
};

export const convertUserFunctions = (data) =>
  data?.reduce((prev, curr) => {
    const { fucntionCode, childs, ...rest } = curr;
    const { length } = childs;
    const key = FUNCTION_CODES[fucntionCode];
    const children = key && length ? convertUserFunctions(childs) : {};

    return {
      ...prev,
      ...(key && {
        [key]: {
          fucntionCode,
          childs: children,
          ...rest,
        },
      }),
    };
  }, {});

function* getSAMFunctionList() {
  const currentLocale = yield select((state) => state.view.currentLocale);
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });

  const { status, data } = yield call(Api.getFunctionList);
  if (status === 200 && data?.code === 0) {
    yield put({
      type: Actions.SET_SAM_FUNCTION_LIST,
      payload: {
        list: data.data,
      },
    });
  } else {
    const messages = getLocaleData(currentLocale);
    yield put({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props: {
          title: messages["common.title"],
          message: data?.message,
          callback: () => null,
        },
      },
    });
  }

  yield put({
    type: Actions.SET_IS_LOADING,
    payload: false,
  });
}

const SAMFunctionReducer = (state = initialState, action) => {
  const { type, payload } = action;
  if (type === Actions.SET_SAM_FUNCTION_LIST) {
    const functions = payload?.list ? convertUserFunctions(payload.list) : {};
    return { ...state, ...payload, map: functions };
  }
  return state;
};

const SAMFunctionSaga = [takeEvery("getSAMFunctionList", getSAMFunctionList)];

export { SAMFunctionReducer, SAMFunctionSaga };
