import Api from '../Common/api'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { Actions } from '../Common/constants'
const initialState = {
  currentPage: 1,
  total: 0,
  pageSize: 5,
  totalPages: 0,
  siteList: [],
  curSite:{}
}

const SiteReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.SET_SITE_LIST:
      return {
        ...state,
        currentPage: payload.currentPage,
        total: payload.total,
        pageSize: payload.pageSize,
        totalPages: payload.totalPages,
        siteList: payload.siteList
      }
    case Actions.SET_SITE:
      return {
        ...state,
        curSite:payload.curSite
      }
    default:
      return state
  }
}


function* querySiteList({ payload }) {
  let { keyWord, pageNum, pageSize, sidx, order } = payload
  let res = yield call(Api.getSiteList, { keyWord, pageNum, pageSize, sidx, order })
  if (res.data) {
    yield put({
      type: Actions.SET_SITE_LIST, 
      payload: {
        currentPage: res.data.data.pageNum,
        total: res.data.data.total,
        pageSize: res.data.data.pageSize,
        totalPages: res.data.data.pages,
        siteList: res.data.data.list
      }
    })
  }
}

function* updateSite({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING, 
    payload: true
  })
  let { groupName, factoryCode, sdpSite, technician, sdpArea  } = payload
  let params = {
    groupName, factoryCode, sdpSite, technician, sdpArea 
  }

  try { 
    let res = yield call(Api.doUpdateSite, params)
    if(res.data.code === -1){
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.data.message,
            msgType: 'error',
            autoHideDuration:null,
          }
        }
      })
    }else{
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.data.message,
            msgType: 'success',
            autoHideDuration:6000,
          }
        }
      })
    }
  } catch (e) {
    console.error('Error while update site in Technician Mgt', e)
    yield put({
      type: Actions.SET_IS_LOADING, 
      payload: false
    })
  }
  
  let sfState = yield select(state => state.site)
  let { pageSize } = sfState 
  yield put({
    type: 'querySiteList',
    payload: {
      pageNum: 1,
      pageSize
    }
  })
  yield put({
    type: Actions.SET_IS_LOADING, 
    payload: false
  })
}

function* deleteSite({ payload }) {
  let { factoryCode } = payload
  yield put({
    type: Actions.SET_IS_LOADING, 
    payload: true
  })
  try {
    let res = yield call(Api.deleteSiteBySiteCode, { factoryCode })
    if(res.data.code === -1){
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.data.message,
            msgType: 'error',
            autoHideDuration:null,
          }
        }
      })
    }else{
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: res.data.message,
            msgType: 'success',
            autoHideDuration:6000,
          }
        }
      })
    }
  } catch (error) {
    yield put({
      type: Actions.SET_IS_LOADING, 
      payload: false
    })
  }

  let sfState = yield select(state => state.site)
  let { pageSize } = sfState 
  yield put({
    type: 'querySiteList',
    payload: {
      pageNum: 1,
      pageSize
    }
  })
  yield put({
    type: Actions.SET_IS_LOADING, 
    payload: false
  })
}

function* getSiteByCode({ payload }) {
  let { factoryCode } = payload
  let res = yield call(Api.getSiteByCode, { factoryCode })
  if (res.data) {
    yield put({
      type: Actions.SET_SITE, 
      payload: {
        curSite: res.data.data
      }
    })
  }
}

const SiteSaga = [
  takeEvery('querySiteList', querySiteList),
  takeEvery('getSiteByCode', getSiteByCode),
  takeEvery('updateSite', updateSite),
  takeEvery('deleteSite', deleteSite)
]

export { SiteReducer, SiteSaga }
