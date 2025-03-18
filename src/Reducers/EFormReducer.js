import Api from '../Common/api'
import { call, put,  takeEvery } from 'redux-saga/effects'
import { Actions } from '../Common/constants'

const initialState = {
  currentPage: 1,
  total: 0,
  pageSize: 10,
  totalPages: 0,
  eformList: []
}

const EFormReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.SET_E_FORM_LIST:
      return {
        ...state,
        currentPage: payload.currentPage,
        total: payload.total,
        pageSize: payload.pageSize,
        totalPages: payload.totalPages,
        eformList: payload.eformList
      }
    default:
      return state
  }
}


function* queryEFormList({ payload }) {
  let { pageNum, pageSize, sort, unPage} = payload
  let res = yield call(Api.getEFormList, { pageNum, pageSize, sort, unPage })
  if (res.data.data) {
    yield put({
      type: Actions.SET_E_FORM_LIST, 
      payload: {
        total: res.data.data.totalElements,
        totalPages: res.data.data.totalPages,
        pageSize: res.data.data.size,
        pageNum: res.data.data.number,
        eformList: res.data.data.content
      }
    })
  }
}

const EFormSaga = [
  takeEvery('queryEFormList', queryEFormList)
]

export { EFormReducer, EFormSaga }
