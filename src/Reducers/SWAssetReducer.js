import Api from '../Common/api'
import AssetApi from "src/api/admin/Asset/AssetApi";
import { call, put, takeEvery, } from 'redux-saga/effects'
import { Actions, } from '../Common/constants'
const initialState = {
  freewareResult: { total: 0, totalPages: 0, pageSize: 0, list: [], pageNum: 0 },
  freewareBrandList: [],
  freewareCategoryList: [],
  reasonList: [],
  msg: null,
  message:"",
}

const SWAssetReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.SET_QUERY_FILTERS:
      return {
        ...state,
        ...payload
      }
      case Actions.SHOW_SNACKBAR_MESSAGE:
        return {
                    ...state,
          ...payload.props
        }
    default:
      return state;
  }

}
function* getFreewareList({ payload }) {
  let { brandList, isValid, keyword, listType, pageNum, pageSize, sort, unPage } = payload
  let res = yield call(Api.getFreewareList, { brandList, isValid, keyword, listType, pageNum, pageSize, sort, unPage })
  if (res.data.data) {
    let freewareResult = {
      total: res.data.data.totalElements,
      totalPages: res.data.data.totalPages,
      pageSize: res.data.data.size,
      pageNum: res.data.data.number,
      list: res.data.data.content
    }
    // console.log(freewareResult)
    yield put({
      type: Actions.SET_QUERY_FILTERS,
      payload: {
        freewareResult: freewareResult

      }
    })
  }

}
function* addFreeware({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true
  })
  try {
    let brand = payload.brandId, categoryList = payload.category, description = payload.desc, descriptionEN = payload.descEN, softwareName = payload.name,
      { applyType, assetId, graph, edition, installType, listType, reason, remark, sourceURL, valid, version } = payload
    // let { applyType, assetId, brand, graph, categoryList, description, descriptionEN, edition, installType, listType, reason, remark, softwareName, sourceURL, valid, version } = payload
    if ((listType === 3||listType === 4) && (reason === null || reason === undefined || reason === "")) {
      yield put({
        type: Actions.SET_IS_LOADING,
        payload: false
      })
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: "Please select the reason.",
            msgType: 'error',
            autoHideDuration: null,
          }
        }
      })
      return
    }
    let res = assetId ? yield call(Api.updateFreeware, { applyType, assetId, brand, graph, categoryList, description, descriptionEN, edition, installType, listType, reason, remark, softwareName, sourceURL, valid, version }) :
      yield call(Api.addFreeware, { applyType, brand, graph, categoryList, description, descriptionEN, edition, installType, listType, reason, remark, softwareName, sourceURL, valid, version })
    let msg = {
      data: res.data,
      flag: 1
    }
    if (res.data.code === -1) {
      yield put({
        type: Actions.SET_QUERY_FILTERS,
        payload: {
          rateResult: res.data
        }
      })
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.data.message,
            msgType: 'error',
            autoHideDuration: null,
          }
        }
      })
    }
    else {
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.data.message,
            msgType: 'success',
            autoHideDuration: 6000,
          }
        }
      })
    }
    yield put({
      type: Actions.SET_QUERY_FILTERS,
      payload: {
        msg: msg
      }
    })
  } catch (e) {
    console.log('error while add freeware ', e)
  } yield put({
    type: Actions.SET_IS_LOADING,
    payload: false
  })
}
function* getFreewareBrandList() {
  let res = yield call(Api.getFreewareBrand, {})
  if (res.data.code !== 0) { return }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      freewareBrandList: res.data.data

    }
  })
}
function* getFreewareCategoryList({ }) {
  let res = yield call(Api.getFreewareCategory, {})
  if (res.data.code !== 0) { return }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      freewareCategoryList: res.data.data

    }
  })
}
function* addFreewareBrand({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true
  })
  let { brandName } = payload
  try {
    let res = yield call(Api.addFreewareBrand, { brandName })
    if (res.data.code === -1) {
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
    } else {
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
    }
    let msg = {
      data: res.data,
      flag: 2
    }
    yield put({
      type: Actions.SET_QUERY_FILTERS,
      payload: {
        msg: msg
      }
    })
  } catch (e) {
    console.log('error while add freeware brand', e)
  } yield put({
    type: Actions.SET_IS_LOADING,
    payload: false
  })
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
function* updateFreeware({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true
  })
  try {
    let { applyType, assetId, brand, graph, categoryList, description, descriptionEN, edition, installType, listType, reason, remark, softwareName, sourceURL, valid, version } = payload
    let res = yield call(Api.updateFreeware, { applyType, assetId, brand, graph, categoryList, description, descriptionEN, edition, installType, listType, reason, remark, softwareName, sourceURL, valid, version })
    let msg = {
      data: res.data,
      flag: 1
    }
    yield put({
      type: Actions.SET_QUERY_FILTERS,
      payload: {
        msg: msg
      }
    })
  } catch (e) {
    console.log('error while update freeware ', e)
  } yield put({
    type: Actions.SET_IS_LOADING,
    payload: false
  })
}
function* deleteFreeware({ payload }) {
  let { assetId } = payload
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true
  })
  try {
    let res = yield call(Api.deleteFreeware, { assetId })
    let msg = {
      data: res.data,
      flag: 3
    }
    if (res.data.code === -1) {
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.data.message,
            msgType: 'error',
            autoHideDuration: null,
          }
        }
      })
    }
    else {
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.data.message,
            msgType: 'success',
            autoHideDuration: 6000,
          }
        }
      })
    }
    yield put({
      type: Actions.SET_QUERY_FILTERS,
      payload: {
        msg: msg
      }
    })
  } catch (e) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: e,
          msgType: 'error',
          autoHideDuration: null,
        }
      }
    })
    console.log('error', e)
  } yield put({
    type: Actions.SET_IS_LOADING,
    payload: false
  })
}
function* getReasonList({ payload }) {
  let { value, locale } = payload
  let listTypeCode = value
  let language = locale
  let res = yield call(AssetApi.getReasonList, { listTypeCode, language })

  if (res.data.code !== 0) { return }
  yield put({
    type: Actions.SET_QUERY_FILTERS,
    payload: {
      reasonList: res.data.data
    }
  })
}
const SWAssetSaga = [
  takeEvery('getFreewareList', getFreewareList),
  takeEvery('addFreeware', addFreeware),
  takeEvery('getFreewareBrandList', getFreewareBrandList),
  takeEvery('getFreewareCategoryList', getFreewareCategoryList),
  takeEvery('addFreewareBrand', addFreewareBrand),
  takeEvery('setMsg', setMsg),
  takeEvery('updateFreeware', updateFreeware),
  takeEvery('deleteFreeware', deleteFreeware),
  takeEvery('getReasonList', getReasonList),
]
export { SWAssetReducer, SWAssetSaga }