import Api from '../Common/api'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { Actions } from "src/constants/common";
import { DEFAULT_SORTING_COL , sortingAndPaginationController } from '../Common/TableSorting'
import { toDefaultString } from '../Common/commonMethod'
import AdminTableFields from '../Common/AdminTableFields'
import moment from 'moment'


const initialState = {
  intlMetaData:{
    title:"",
    createSdpFail:"",
    createSdpFail2:"",
    bindSdpSuccess:"",
    bindSdpFail:"",
    createSdpSuccess:""
  },
  manual: {
    currentPage: 1,
    total: 0,
    pageSize: 10,
    totalPages: 0,
    list: [],
    viewList: [],
    sdpTotal: 0,
    sdpOpen: 0,
    sdpClose: 0,
    searchPayload: {}// 用來保存sdp manual list(initSDPManualData)頁面的搜索參數，修改完數據從這裏拿參數重新調用initSDPManualData
  },
  unprocessed: {
    currentPage: 1,
    total: 0,
    pageSize: 10,
    totalPages: 0,
    list: [],
    viewList: [],
    sdpTotal: 0,
    sdpOpen: 0,
    sdpClose: 0,
    exportList: [],
    disabled: 0,
    searchPayload: {}
  },
  processed: {
    currentPage: 1,
    total: 0,
    pageSize: 10,
    totalPages: 0,
    list: [],
    viewList: [],
    sdpTotal: 0,
    sdpOpen: 0,
    sdpClose: 0,
    exportList: [],
    disabled: 0
  },
  sdpTotal: 0,
  sdpOpen: 0,
  sdpClose: 0,
  areaList: [],
}
const viewFunc = value => { return value ? value : '-' }

const SDPReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.SET_SDP_MANUAL_INFO:
      return {
        ...state,
        manual: {
          ...state.manual,
          ...payload
        }
      }
    case Actions.SET_SDP_UNPROCESSED_INFO:
      return {
        ...state,
        unprocessed: {
          ...state.unprocessed,
          ...payload
        }
      }
    case Actions.SET_SDP_PROCESSED_INFO:
      return {
        ...state,
        processed: {
          ...state.processed,
          ...payload
        }
      }
    case Actions.SET_QUERY_FILTERS:
      return {
        ...state,
        ...payload
      }
    case Actions.SET_SDP_I18N_MESSAGE:
        return {
          ...state,
          ...payload,
        }
    default:
      return state
  }
}

// function* initSDPManualData({ payload }) {
//   let defaultData = JSON.parse(JSON.stringify(initialState.manual))

//   let params = {}
//   if (!payload) {
//     let state = yield select(state => state.sdp.manual)
//     params = { ...state }
//   } else {
//     params = { ...payload }
//   }

//   let { applicationRangeE, applicationRangeS, formType } = params

//   let res = yield call(Api.getManualList, {
//     applicationRangeE, applicationRangeS, formType
//   })

//   res.data.data.sprForm.forEach(el => {
//     let viewObj = {
//       eForm: el.formId,
//       quantity: el.quantity,
//       type: el.formType,
//       status: el.statusName,
//       area: el.areaLName,
//       bgbu: el.bgBu,
//       department: el.deptCodeLName,
//       applicant: el.empName,
//       reason: el.reason,
//       subList: [],
//       ...el
//     }
//     el.installListDTOList.forEach(elem => {
//       let subObj = {
//         ...elem,
//         account: toDefaultString(elem.account).toUpperCase(),
//         computerName: toDefaultString(elem.computerName).toUpperCase(),
//         isVip: elem.isVIP,
//         sccmPacked: elem.isPackage,
//         isTerminated: elem.isResign,
//         result: elem.statusADGroup
//       }
//       viewObj.subList.push(subObj)
//     })

//     defaultData.list.push(viewObj)
//   })

//   let pagingParams = { pageNum: typeof params.currentPage !== 'undefined' ? params.currentPage + 1 : params.pageNum, pageSize: params.pageSize }
//   let data = initSortingAndPaging(defaultData, pagingParams, DEFAULT_SORTING_COL.sdpmanual, AdminTableFields.SDPManual)

//   yield put({
//     type: Actions.SET_SDP_MANUAL_INFO,
//     payload: {
//       ...data,
//       applicationRangeE, applicationRangeS, formType,
//       sdpTotal: res.data.data.sprquantity,
//       sdpOpen: res.data.data.spropenQuantity,
//       sdpClose: res.data.data.sprcloseQuantity
//     }
//   })

// }
const getSdpStatus = {
  "4-1": "Open",
  "4-2": "Onhold",
  "4-3": "Closed",
  "4-4": "Resolved",
  "4-301": "Assigned",
  "4-302": "In Progress",
  "4-901": "Cancelled",
}


function* initSDPManualData({ payload }) {
  let { pageNum, pageSize, keyword, applicationRangeE, applicationRangeS, formType, isClosedAll } = payload
  let res = yield call(Api.getManualList, {
    pageNum, pageSize, keyword,
    applicationRangeE, applicationRangeS, formType, isClosedAll
  })
  let list = []
  res.data.data.list[0].sprForm.forEach(el => {
    let viewObj = {
      eForm: el.formId,
      quantity: el.quantity,
      type: el.formType,
      status: el.statusName,
      area: el.areaLName,
      bgbu: el.bgBu,
      department: el.deptCodeLName,
      applicant: el.empName,
      reason: el.reason,
      subList: [],
      ...el
    }
    el.installListDTOList.forEach(elem => {
      let subObj = {
        ...elem,
        account: toDefaultString(elem.account).toUpperCase(),
        computerName: toDefaultString(elem.computerName).toUpperCase(),
        isVip: elem.isVIP,
        sccmPacked: elem.isPackage,
        isTerminated: elem.isResign,
        result: elem.statusADGroup
      }
      viewObj.subList.push(subObj)
    })

    // defaultData.list.push(viewObj)
    list.push(viewObj)
  })

  yield put({
    type: Actions.SET_SDP_MANUAL_INFO,
    payload: {
      total: res.data.data.total,
      pageSize: res.data.data.pageSize,
      totalPages: res.data.data.pages,
      viewList: list,
      sdpTotal: res.data.data.list[0].sprquantity,
      sdpOpen: res.data.data.list[0].spropenQuantity,
      sdpClose: res.data.data.list[0].sprcloseQuantity,
      searchPayload: payload
    }
  })

}
function* sdpManualController({ payload }) {

  let state = yield select(state => state.sdp.manual)
  let data = sortingAndPaginationController(state, payload, DEFAULT_SORTING_COL.sdpmanual, AdminTableFields.SDPManual)

  yield put({
    type: Actions.SET_SDP_MANUAL_INFO,
    payload: data
  })
}

// function* initSDPUnprocessedData({ payload }) {
//   let defaultData = JSON.parse(JSON.stringify(initialState.unprocessed))

//   let params = {}
//   if (!payload) {
//     let state = yield select(state => state.sdp.unprocessed)
//     params = { ...state }
//   } else {
//     params = { ...payload }
//   }

//   let { applicationRangeE, applicationRangeS, formType, isClosedAll } = params

//   let res = yield call(Api.getUnprocessedList, {
//     applicationRangeE, applicationRangeS, formType, isClosedAll
//   })

//   res.data.data.sprForm.forEach(el => {
//     let viewObj = {
//       eForm: el.formId,
//       status: el.statusName,
//       closedAll: '-',
//       type: el.formType,
//       area: el.areaLName,
//       bgbu: el.bgBu,
//       department: el.deptCodeLName,
//       applicant: el.empName,
//       subList: [],
//       ...el
//     }

//     // let count = 0
//     el.sdpListDTOList.forEach(elem => {
//       let subObj = {
//         ...elem,
//         sdpCaseId: elem.caseId,
//         subject: elem.sdpTitle,
//         vendor: viewFunc(elem.sdpTechnician).toUpperCase(),
//         solution: viewFunc(elem.sdpResolution),
//         creatTime: moment(elem.createDate).format('YYYY/MM/DD hh:mm'),
//         updateTime: moment(elem.lastUpdateDate).format('YYYY/MM/DD hh:mm'),
//         sprInfo: '-'
//       }
//       // if (elem.sdpStatus + '' === 3 + '') { count++ }
//       viewObj.subList.push(subObj)
//     })
//     viewObj.closedAll = `${el.closeQuantity}/${el.quantity}`

//     defaultData.list.push(viewObj)
//   })

//   let pagingParams = { pageNum: typeof params.currentPage !== 'undefined' ? params.currentPage + 1 : params.pageNum, pageSize: params.pageSize }
//   let data = initSortingAndPaging(defaultData, pagingParams, DEFAULT_SORTING_COL.sdpunprocessed, AdminTableFields.SDPUnprocessed)

//   yield put({
//     type: Actions.SET_SDP_UNPROCESSED_INFO,
//     payload: {
//       ...data,
//       applicationRangeE, applicationRangeS, formType,
//       sdpTotal: res.data.data.sprquantity,
//       sdpOpen: res.data.data.spropenQuantity,
//       sdpClose: res.data.data.sprcloseQuantity
//     }
//   })

// }
function* setDisabled({ payload }) {

  let { num } = payload// 1.Unprocessed,2.processed
  if (num === 1) {
    yield put({
      type: Actions.SET_SDP_UNPROCESSED_INFO,
      payload: {
        disabled: 0
      }
    })
  }
  if (num === 2) {
    yield put({
      type: Actions.SET_SDP_PROCESSED_INFO,
      payload: {
        disabled: 0
      }
    })
  }
}
function* initSDPUnprocessedData({ payload }) {
  let { pageNum, pageSize, keyword, applicationRangeE, applicationRangeS, formType, isClosedAll, areaId } = payload
  let res = yield call(Api.getUnprocessedList, {
    pageNum, pageSize, keyword,
    applicationRangeE, applicationRangeS, formType, isClosedAll, areaId
  })
  let list = []
  // let exportList = []
  res.data.data.list[0].sprForm.forEach(el => {
    let viewObj = {
      eForm: el.formId,
      status: el.statusName,
      closedAll: '-',
      type: el.formType,
      area: el.areaLName,
      bgbu: el.bgBu,
      department: el.deptCodeLName,
      applicant: el.empName,
      subList: [],
      ...el
    }

    // let count = 0
    el.sdpListDTOList.forEach(elem => {
      let subObj = {
        ...elem,
        sdpCaseId: elem.caseId,
        subject: elem.sdpTitle,
        vendor: viewFunc(elem.sdpTechnician).toUpperCase(),
        solution: viewFunc(elem.sdpResolution),
        creatTime: moment(elem.createDate).format('YYYY/MM/DD hh:mm'),
        updateTime: moment(elem.lastUpdateDate).format('YYYY/MM/DD hh:mm'),
        sprInfo: '-'
      }
      // if (elem.sdpStatus + '' === 3 + '') { count++ }
      viewObj.subList.push(subObj)
      // let exportSubObj = {
      //   formId: el.formId,
      //   caseId: elem.caseId,
      //   applicantNtAccount: toDefaultString(elem.applicantNtAccount).toUpperCase(),
      //   applyComputer: toDefaultString(elem.applyComputer).toUpperCase(),
      //   stockId: elem.stockId,
      //   productName: elem.productName,
      //   applyReason: elem.applyReason,
      //   sdpTitle: elem.sdpTitle,
      //   sdpStatus: elem.sdpStatus ? getSdpStatus[elem.sdpStatus] : '-',
      //   type: elem.formType === 1 ? 'Install' : 'Uninstall',
      //   quantity: el.quantity,
      //   createTime: moment(elem.createDate).format('YYYY/MM/DD hh:mm'),
      //   lastUpdateDate: moment(elem.lastUpdateDate).format('YYYY/MM/DD hh:mm'),
      //   sdpResolution: viewFunc(elem.sdpResolution),
      //   sdpHandleStatus: elem.sdpStatus ? getSdpStatus[elem.sdpStatus] : '-',
      // }
      // exportList.push(exportSubObj)
    })
    viewObj.closedAll = `${el.closeQuantity}/${el.quantity}`

    list.push(viewObj)
  })
  yield put({
    type: Actions.SET_SDP_UNPROCESSED_INFO,
    payload: {
      currentPage: res.data.data.pageNum,
      total: res.data.data.total,
      pageSize: res.data.data.pageSize,
      totalPages: res.data.data.pages,
      viewList: list,
      sdpTotal: res.data.data.list[0].sprquantity,
      sdpOpen: res.data.data.list[0].spropenQuantity,
      sdpClose: res.data.data.list[0].sprcloseQuantity,
      searchPayload: payload
    }
  })

}
function* exportUnporcessed({ payload }) {
  let { pageNum, pageSize, keyword, applicationRangeE, applicationRangeS, formType, isClosedAll } = payload
  let res = yield call(Api.getUnprocessedList, {
    pageNum, pageSize, keyword,
    applicationRangeE, applicationRangeS, formType, isClosedAll
  })
  let exportList = []
  if (res.data.data && res.data.data.sprForm) {
    res.data.data.sprForm.forEach(el => {
      el.sdpListDTOList.forEach(elem => {
        let exportSubObj = {
          formId: el.formId,
          caseId: elem.caseId,
          applicantNtAccount: toDefaultString(elem.applicantNtAccount).toUpperCase(),
          applyComputer: toDefaultString(elem.applyComputer).toUpperCase(),
          stockId: elem.stockId,
          productName: elem.productName,
          applyReason: elem.applyReason,
          sdpTitle: elem.sdpTitle,
          sdpStatus: elem.sdpStatus ? getSdpStatus[elem.sdpStatus] : '-',
          type: elem.formType === 1 ? 'Install' : 'Uninstall',
          quantity: el.quantity,
          createTime: moment(elem.createDate).format('YYYY/MM/DD hh:mm'),
          lastUpdateDate: moment(elem.lastUpdateDate).format('YYYY/MM/DD hh:mm'),
          sdpResolution: viewFunc(elem.sdpResolution),
          sdpHandleStatus: elem.sdpStatus ? getSdpStatus[elem.sdpStatus] : '-',
        }
        exportList.push(exportSubObj)
      })
    })
  }

  yield put({
    type: Actions.SET_SDP_UNPROCESSED_INFO,
    payload: {
      exportList: exportList,
      disabled: 1
    }
  })
}
function* sdpUnprocessedController({ payload }) {

  let state = yield select(state => state.sdp.unprocessed)
  let data = sortingAndPaginationController(state, payload, DEFAULT_SORTING_COL.sdpunprocessed, AdminTableFields.SDPUnprocessed)

  yield put({
    type: Actions.SET_SDP_UNPROCESSED_INFO,
    payload: data
  })
}
function* initSDPProcessedData({ payload }) {
  let { pageNum, pageSize, keyword, applicationRangeE, applicationRangeS, formType, isClosedAll, areaId } = payload
  let res = yield call(Api.getProcessedList, {
    pageNum, pageSize, keyword,
    applicationRangeE, applicationRangeS, formType, isClosedAll, areaId
  })
  let list = []
  // let exportList = []
  res.data.data.list[0].sprForm.forEach(el => {
    let viewObj = {
      eForm: el.formId,
      status: el.statusName,
      type: el.formType,
      area: el.areaLName,
      bgbu: el.bgBu,
      department: el.deptCodeLName,
      applicant: el.empName,
      subList: [],
      ...el
    }

    el.sdpListDTOList.forEach(elem => {
      let subObj = {
        ...elem,

        stockID: elem.stockId,
        productName: elem.productName,
        account: toDefaultString(elem.applicantNtAccount).toUpperCase(),
        computerName: toDefaultString(elem.applyComputer).toUpperCase(),
        sdpStatus: elem.sdpStatus,
        sdpCaseId: viewFunc(elem.caseId),
        vendor: viewFunc(elem.sdpTechnician).toUpperCase(),
        solution: viewFunc(elem.sdpResolution),
        closedTime: moment(elem.lastUpdateDate).format('YYYY/MM/DD hh:mm'),
        smartItInfo: '-'
      }
      viewObj.subList.push(subObj)
      // let exportSubObj = {
      //   formId: el.formId,
      //   caseId: elem.caseId,
      //   applicantNtAccount: toDefaultString(elem.applicantNtAccount).toUpperCase(),
      //   applyComputer: toDefaultString(elem.applyComputer).toUpperCase(),
      //   stockId: elem.stockId,
      //   productName: elem.productName,
      //   applyReason: elem.applyReason,
      //   sdpTitle: elem.sdpTitle,
      //   sdpStatus: elem.sdpStatus ? getSdpStatus[elem.sdpStatus] : '-',
      //   type: elem.formType === 1 ? 'Install' : 'Uninstall',
      //   quantity: el.quantity,
      //   createTime: moment(elem.createDate).format('YYYY/MM/DD hh:mm'),
      //   lastUpdateDate: moment(elem.lastUpdateDate).format('YYYY/MM/DD hh:mm'),
      //   sdpResolution: viewFunc(elem.sdpResolution),
      //   sdpHandleStatus: elem.sdpStatus ? getSdpStatus[elem.sdpStatus] : '-',
      // }
      // exportList.push(exportSubObj)
    })

    // defaultData.list.push(viewObj)
    list.push(viewObj)
  })

  yield put({
    type: Actions.SET_SDP_PROCESSED_INFO,
    payload: {
      currentPage: res.data.data.pageNum,
      total: res.data.data.total,
      pageSize: res.data.data.pageSize,
      totalPages: res.data.data.pages,
      viewList: list,
      sdpTotal: res.data.data.list[0].sprquantity,
      sdpOpen: res.data.data.list[0].spropenQuantity,
      sdpClose: res.data.data.list[0].sprcloseQuantity,
      // exportList: exportList
    }
  })

}
function* exportProcessed({ payload }) {
  let { pageNum, pageSize, keyword, applicationRangeE, applicationRangeS, formType, isClosedAll } = payload
  let res = yield call(Api.getProcessedList, {
    pageNum, pageSize, keyword,
    applicationRangeE, applicationRangeS, formType, isClosedAll
  })
  let exportList = []
  if (res.data.data && res.data.data.sprForm) {
    res.data.data.sprForm.forEach(el => {
      el.sdpListDTOList.forEach(elem => {
        let exportSubObj = {
          formId: el.formId,
          caseId: elem.caseId,
          applicantNtAccount: toDefaultString(elem.applicantNtAccount).toUpperCase(),
          applyComputer: toDefaultString(elem.applyComputer).toUpperCase(),
          stockId: elem.stockId,
          productName: elem.productName,
          applyReason: elem.applyReason,
          sdpTitle: elem.sdpTitle,
          sdpStatus: elem.sdpStatus ? getSdpStatus[elem.sdpStatus] : '-',
          type: elem.formType === 1 ? 'Install' : 'Uninstall',
          quantity: el.quantity,
          createTime: moment(elem.createDate).format('YYYY/MM/DD hh:mm'),
          lastUpdateDate: moment(elem.lastUpdateDate).format('YYYY/MM/DD hh:mm'),
          sdpResolution: viewFunc(elem.sdpResolution),
          sdpHandleStatus: elem.sdpStatus ? getSdpStatus[elem.sdpStatus] : '-',
        }
        exportList.push(exportSubObj)
      })
    })
  }

  yield put({
    type: Actions.SET_SDP_PROCESSED_INFO,
    payload: {
      exportList: exportList,
      disabled: 1
    }
  })
}
// function* initSDPProcessedData({ payload }) {

//   let defaultData = JSON.parse(JSON.stringify(initialState.processed))

//   let params = {}
//   if (!payload) {
//     let state = yield select(state => state.sdp.processed)
//     params = { ...state }
//   } else {
//     params = { ...payload }
//   }

//   let { applicationRangeE, applicationRangeS, formType, isClosedAll } = params

//   let res = yield call(Api.getProcessedList, {
//     applicationRangeE, applicationRangeS, formType, isClosedAll
//   })

//   res.data.data.sprForm.forEach(el => {
//     let viewObj = {
//       eForm: el.formId,
//       status: el.statusName,
//       type: el.formType,
//       area: el.areaLName,
//       bgbu: el.bgBu,
//       department: el.deptCodeLName,
//       applicant: el.empName,
//       subList: [],
//       ...el
//     }

//     el.sdpListDTOList.forEach(elem => {
//       let subObj = {
//         ...elem,

//         stockID: elem.stockId,
//         productName: elem.productName,
//         account: toDefaultString(elem.applicantNtAccount).toUpperCase(),
//         computerName: toDefaultString(elem.applyComputer).toUpperCase(),
//         sdpStatus: elem.sdpStatus,
//         sdpCaseId: viewFunc(elem.caseId),
//         vendor: viewFunc(elem.sdpTechnician).toUpperCase(),
//         solution: viewFunc(elem.sdpResolution),
//         closedTime: moment(elem.lastUpdateDate).format('YYYY/MM/DD hh:mm'),
//         smartItInfo: '-'
//       }
//       viewObj.subList.push(subObj)
//     })

//     defaultData.list.push(viewObj)
//   })

//   let pagingParams = { pageNum: typeof params.currentPage !== 'undefined' ? params.currentPage + 1 : params.pageNum, pageSize: params.pageSize }
//   let data = initSortingAndPaging(defaultData, pagingParams, DEFAULT_SORTING_COL.sdpprocessed, AdminTableFields.SDPProcessed)

//   yield put({
//     type: Actions.SET_SDP_PROCESSED_INFO,
//     payload: {
//       ...data,
//       applicationRangeE, applicationRangeS, formType,
//       sdpTotal: res.data.data.sprquantity,
//       sdpOpen: res.data.data.spropenQuantity,
//       sdpClose: res.data.data.sprcloseQuantity
//     }
//   })

// }
function* sdpProcessedController({ payload }) {

  let state = yield select(state => state.sdp.processed)
  let data = sortingAndPaginationController(state, payload, DEFAULT_SORTING_COL.sdpprocessed, AdminTableFields.SDPProcessed)

  yield put({
    type: Actions.SET_SDP_PROCESSED_INFO,
    payload: data
  })
}

function* autoCreateAllSDPInfo({ payload }) {
  let { sdps, eForm } = payload
  const intlMetaData = yield select(state => state.sdp.intlMetaData) 
  let sdpsStr = sdps.join(',')
  let res = yield call(Api.createSdp, { subIds: sdpsStr })

  if (res.data.code === 0) {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: intlMetaData.createSdpSuccess,
          msgType: 'success',
          autoHideDuration:6000,
        }
      }
    })
    let searchPayload = yield select(state => state.sdp.manual.searchPayload)
    yield put({
      type: 'initSDPManualData',
      payload: searchPayload
    })
  } else {
    if (res.data.data) {
      yield put({
        type: Actions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            title: intlMetaData.title,
            message: res.data.data.sdpErrorInfo.response_status.messages.map(el => {
              return `${intlMetaData.createSdpFail} code_status=${el.status_code}, field=${el.field}, message=${el.message}`
              // return <p><FormattedMessage id={`softwaresdpmgt.createSdpFail`} values={{ code: el.status_code, field: el.field, message: el.message }} /></p>
            }),
            msgType: 'error',
            autoHideDuration:null,
          }
        }
      })
    } else {
          yield put({
            type: Actions.SHOW_SNACKBAR_MESSAGE,
            payload: {
              show: true,
              props: {
                message: intlMetaData.createSdpFail2,
                msgType: 'error',
                autoHideDuration:null,
              }
            }
          })
    }
  }
}
function* editSDPInfo({ payload }) {
  let res = yield call(Api.saveSdpInfo, payload)
  let searchPayload = yield select(state => state.sdp.manual.searchPayload)
  yield put({
    type: 'initSDPManualData',
    payload: searchPayload
  })
}
function* bindSDP({ payload }) {
  let { subId, caseId } = payload
  const intlMetaData = yield select(state => state.sdp.intlMetaData) 
  let message, status = ''
  if (!caseId) {
    yield put({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props: {
          title: intlMetaData.title,
          message: 'Bind SDP is null',
          hasCancel: false,
          callback: () => { }
        }
      }
    })
    return
  }
  let res = yield call(Api.bindSDP, { subId, caseId })
  if (res.data.code === 0) {
    yield put({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props: {
          title: intlMetaData.title,
          message: intlMetaData.bindSdpSuccess,
          hasCancel: false,
          callback: () => { }
        }
      }
    })
    let searchPayload = yield select(state => state.sdp.manual.searchPayload)
    yield put({
      type: 'initSDPManualData',
      payload: searchPayload
    })
  } else {
    yield put({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props: {
          title: intlMetaData.title,
          message: res.data.message || intlMetaData.bindSdpFail,
          hasCancel: false,
          callback: () => { }
        }
      }
    })
  }
}
function* createNote({ payload }) {
  let { subId, note } = payload
  let res = yield call(Api.saveUnprocessedNote, {
    noteContent: note, subId: subId
  })
  let searchPayload = yield select(state => state.sdp.unprocessed.searchPayload)
  yield put({
    type: 'initSDPUnprocessedData',
    payload: searchPayload
  })
}
function* getArea() {
  try {
    let res = yield call(Api.getArea)
    if (res.data.data) {
      yield put({
        type: Actions.SET_QUERY_FILTERS,
        payload: {
          areaList: res.data.data
        }
      })
    }

  } catch (e) {
    console.log('error while get AreaList ', e)
  }
}

function* initA18nData({ payload }) {
   let { intlMetaData } = payload
    yield put({
        type: Actions.SET_SDP_I18N_MESSAGE,
        payload: {
          intlMetaData: intlMetaData
        }
   })
}

const SDPSaga = [
  takeEvery('initSDPManualData', initSDPManualData),
  takeEvery('sdpManualController', sdpManualController),
  takeEvery('initSDPUnprocessedData', initSDPUnprocessedData),
  takeEvery('sdpUnprocessedController', sdpUnprocessedController),
  takeEvery('initSDPProcessedData', initSDPProcessedData),
  takeEvery('sdpProcessedController', sdpProcessedController),

  takeEvery('autoCreateAllSDPInfo', autoCreateAllSDPInfo),
  takeEvery('editSDPInfo', editSDPInfo),
  takeEvery('bindSDP', bindSDP),
  takeEvery('createNote', createNote),
  takeEvery('exportUnporcessed', exportUnporcessed),
  takeEvery('exportProcessed', exportProcessed),
  takeEvery('setDisabled', setDisabled),
  takeEvery('getArea', getArea),
  takeEvery('initA18nData', initA18nData),
]

export { SDPReducer, SDPSaga }
