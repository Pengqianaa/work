import Api from '../Common/api'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { Actions } from '../Common/constants'
const initialState = {
  currentPage: 1,
  total: 0,
  pageSize: 5,
  totalPages: 0,
  vipList: []
}

const VipReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.SET_VIP_LIST:
      return {
        ...state,
        currentPage: payload.currentPage,
        total: payload.total,
        pageSize: payload.pageSize,
        totalPages: payload.totalPages,
        vipList: payload.vipList
      }
    default:
      return state
  }
}


function* queryVipList({ payload }) {
  let { keyWord, pageNum, pageSize, sidx, order } = payload
  let res = yield call(Api.getVipList, { keyWord, pageNum, pageSize, sidx, order })
  if (res.data.data) {
    yield put({
      type: Actions.SET_VIP_LIST, 
      payload: {
        currentPage: res.data.data.pageNum,
        total: res.data.data.total,
        pageSize: res.data.data.pageSize,
        totalPages: res.data.data.pages,
        vipList: res.data.data.list
      }
    })
  }
}

function* updateVip({ payload }) {
  yield put({
    type: Actions.SET_IS_LOADING, 
    payload: true
  })
  let { agentEmpCode, agentId, enabled, userEmpCode, userId } = payload
  let params = {
    agentEmpCode, agentId, enabled, userEmpCode, userId
  }

  try { 
    yield call(Api.doUpdateVip, params)
  } catch (e) {
    console.error('Error while update user role', e)
    yield put({
      type: Actions.SET_IS_LOADING, 
      payload: false
    })
  }
  let vipStates = yield select(state => state.vip)
  let res = yield call(Api.getVipList, { 
    keyWord: null, 
    pageNum: 1, 
    pageSize: vipStates.pageSize, 
    sidx: null, 
    order: 'ASC' 
  })
  if (res.data.data) {
    yield put({
      type: Actions.SET_VIP_LIST, 
      payload: {
        currentPage: res.data.data.pageNum,
        total: res.data.data.total,
        pageSize: res.data.data.pageSize,
        totalPages: res.data.data.pages,
        vipList: res.data.data.list
      }
    })
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
  yield put({
    type: Actions.SET_IS_LOADING, 
    payload: false
  })
}


const VipSaga = [
  takeEvery('queryVipList', queryVipList),
  takeEvery('updateVip', updateVip)
]

export { VipReducer, VipSaga }
