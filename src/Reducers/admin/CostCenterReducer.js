import { call, put, takeEvery } from "redux-saga/effects";
import Api from "src/api/admin/CostCenterApi";
import { ALL, LATEST } from "src/constants/common";

export const ACTIONS = {
  GET_AREA_LIST: "GET_AREA_LIST",
  SET_AREA_LIST: "SET_AREA_LIST",
  GET_BG_BU_MAP: "GET_BG_BU_MAP",
  SET_BG_BU_MAP: "SET_BG_BU_MAP",
};

const initialState = {
  areaMap: {},
  bgMap: {},
  buMap: {},
};

const CostCenterReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ACTIONS.SET_AREA_LIST:
      return {
        ...state,
        areaMap: {
          ...state.areaMap,
          ...payload.areaMap,
        },
      };
    case ACTIONS.SET_BG_BU_MAP:
      return {
        ...state,
        bgMap: {
          ...state.bgMap,
          ...payload.bgMap,
        },
        buMap: {
          ...state.buMap,
          ...payload.buMap,
        },
      };
    default:
      return state;
  }
};

function* getAreaList({ payload }) {
  const { status, data } = yield call(Api.getAreaList, payload);
  if (status !== 200 || data.code !== 0 || !data.data.length) {
    return;
  }
  const _year = payload.year ? payload.year : LATEST;
  yield put({
    type: ACTIONS.SET_AREA_LIST,
    payload: {
      areaMap: {
        [_year]: data.data,
      },
    },
  });
}

function* getBgBuMap({ payload }) {
  const { status, data } = yield call(Api.getBgBuList, payload);
  if (status !== 200 || data.code !== 0) {
    return;
  }
  const _year = payload.year ? payload.year : LATEST;
  const { bgList, buMap } = data.data.reduce(
    (prev, curr) => {
      const { bgName, buDtoList } = curr;

      return {
        bgList: [...prev.bgList, curr],
        buMap: {
          ...prev.buMap,
          [ALL]: !Object.keys(prev.buMap)?.length
            ? buDtoList
            : [...prev.buMap[ALL], ...buDtoList],
          [bgName]: buDtoList,
        },
      };
    },
    { bgList: [], buMap: {} }
  );

  yield put({
    type: ACTIONS.SET_BG_BU_MAP,
    payload: {
      bgMap: {
        [_year]: bgList,
      },
      buMap: {
        [_year]: buMap,
      },
    },
  });
}

const CostCenterSaga = [
  takeEvery(ACTIONS.GET_AREA_LIST, getAreaList),
  takeEvery(ACTIONS.GET_BG_BU_MAP, getBgBuMap),
];

export { CostCenterReducer, CostCenterSaga };
