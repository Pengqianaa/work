import { call, put, select, takeEvery } from "redux-saga/effects";
import Api from "src/api/admin/SWCollection/SWReportApi";
import {
  Actions,
  STATUS_TYPE,
  SNACKBAR_MESSAGE_DURATION,
} from "src/constants/common";
import { DownloadFile } from "src/utils/methods/common";

export const ACTIONS = {
  GET_SW_QUERY_OR_DOWNLOAD_LIST: "GET_SW_QUERY_OR_DOWNLOAD_LIST",
  SET_SW_QUERY_OR_DOWNLOAD_LIST: "SET_SW_QUERY_OR_DOWNLOAD_LIST",
  SET_SW_REPORT_LIST: "SET_SW_REPORT_LIST",
  GET_SW_REPORT_LIST: "GET_SW_REPORT_LIST",
  SET_SW_REPORT_DETAIL_LIST: "SET_SW_REPORT_DETAIL_LIST",
  GET_SW_REPORT_DETAIL_LIST: "GET_SW_REPORT_DETAIL_LIST",
  SET_SW_REPORT_LOCK: "SET_SW_REPORT_LOCK",
  SET_LOCK_PARAMS:"SET_LOCK_PARAMS",
  GET_LOCK_PARAMS:"GET_LOCK_PARAMS",
  REFRESH_REPORT:"REFRESH_REPORT",
  REFRESH_QUERY_OR_DOWNLOAD:"REFRESH_QUERY_OR_DOWNLOAD",
  UPDATE_QUERY_OR_DOWNLOAD:"UPDATE_QUERY_OR_DOWNLOAD",
  DELETE_QUERY_OR_DOWNLOAD:"DELETE_QUERY_OR_DOWNLOAD",
  UPLOAD_TEMPLATE_EXCEL:"UPLOAD_TEMPLATE_EXCEL",
  DOWNLOAD_TEMPLATE_EXCEL:"DOWNLOAD_TEMPLATE_EXCEL",
  UPLOAD_QUERY_OR_DOWNLOAD_EXCEL:"UPLOAD_QUERY_OR_DOWNLOAD_EXCEL",
  EXPORT_SW_COLLECTION_EXCEL:"EXPORT_SW_COLLECTION_EXCEL",
  SET_SW_COST_CENTER:"SET_SW_COST_CENTER",
  SET_EXPORT_DISABLE:"SET_EXPORT_DISABLE",
  SET_USER_FLAG:"SET_USER_FLAG",
  SET_UPLOAD_DISABLE:"SET_UPLOAD_DISABLE,"
};

const initialState = {
  pageNum: 1,
  total: 0,
  pageSize: 10,
  pages: 0,

  reportList:[],
  reportDetailList:[],
  queryOrDownloadList:[],
  lockParams:{},
  queryOrDownloadExportDisable: false,
  queryOrDownloadUploadDisable: false,
  reportPrevQuery:{},
  queryOrDownloadPrevQuery:{},

  costCenter:{},
  userFlag:2

};

const SWReportReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.SET_SW_REPORT_LIST:
        return {
          ...state,
          pageNum:payload.currentPage,
          total:payload.total,
          pageSize:payload.pageSize,
          pages:payload.totalPages,
          reportList:payload.list,
          reportPrevQuery: { ...payload },
        };
    case ACTIONS.SET_SW_QUERY_OR_DOWNLOAD_LIST:
        return {
          ...state,
          pageNum:payload.currentPage,
          total:payload.total,
          pageSize:payload.pageSize,
          pages:payload.totalPages,
          queryOrDownloadList:payload.list,
          queryOrDownloadPrevQuery: { ...payload },
        };
    case ACTIONS.SET_SW_REPORT_DETAIL_LIST:
        return {
            ...state,
            reportDetailList:payload.list,
          };
    case ACTIONS.SET_LOCK_PARAMS:
        return {
            ...state,
            lockParams:payload,
          };  
    case ACTIONS.SET_EXPORT_DISABLE:
         const { disable } = payload
         return {
            ...state,
            queryOrDownloadExportDisable:disable,
         };  
    case ACTIONS.SET_SW_COST_CENTER:
       return {
            ...state,
            costCenter:payload,
          };    
    case ACTIONS.SET_USER_FLAG:
        return {
            ...state,
            userFlag:payload,
        };
    case ACTIONS.SET_UPLOAD_DISABLE:  
        const { disable2 } = payload
        return {
          ...state,
          queryOrDownloadUploadDisable:disable2
        }                
    default:
      return state;
  }
};

function* getSwReportList({payload}) {
  let msg = "";
  try {
    const { status, data } = yield call(Api.getSwReportList,payload);
    if (status !== 200 || data.code !== 0) {
      msg = data.message;
      return;
    }
    const { page, content } = data.data;

    yield put({
      type: ACTIONS.SET_SW_REPORT_LIST,
      payload: {
        currentPage: page.number,
        total: page.totalElements,
        pageSize: page.size,
        totalPages: page.totalPages,
        list:content??[],
        reportPrevQuery:{...payload}
      },
    });
  } catch (error) {
    msg = error;
    throw new Error(`[getSwReportList]: ${error}`);
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

function* getSwReportDetailList({payload}) {
  let msg = "";
  try {
    const { status, data } = yield call(Api.getReportDetail,payload);
    if (status !== 200 || data.code !== 0) {
      msg = data.message;
      return;
    }
    let list = data.data;

    yield put({
      type: ACTIONS.SET_SW_REPORT_DETAIL_LIST,
      payload: {
        list:list??[],
      },
    });
  } catch (error) {
    msg = error;
    throw new Error(`[getSwReportList]: ${error}`);
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

function* getSwReportLockParams({payload}) {
    yield put({
      type: ACTIONS.SET_LOCK_PARAMS,
      payload: {
        lockParams:payload,
      },
    });
}

function* getSwQueryOrDownloadList({payload}) {
  let msg = "";
  try {
    const { status, data } = yield call(Api.getSwReportList,payload);
    if (status !== 200 || data.code !== 0) {
      msg = data.message;
      return;
    }
    const { page, content } = data.data;
    yield put({
      type: ACTIONS.SET_SW_QUERY_OR_DOWNLOAD_LIST,
      payload: {
        currentPage: page.number,
        total: page.totalElements,
        pageSize: page.size,
        totalPages: page.totalPages,
        list:content??[],
        queryOrDownloadPrevQuery:{...payload}
      },
    });
  } catch (error) {
    msg = error;
    throw new Error(`[getSwQueryOrDownloadList]: ${error}`);
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

function* setLockArr({payload}) {
  let type = STATUS_TYPE.SUCCESS;
  let msg = '';
  let { lockIds, unLockIds } = payload;
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    let status = 200
    let data
    if(lockIds.length>0){
      let res = yield call(Api.lockReport, { reportIds: lockIds });
      status = res.status
      data =res.data
    }
    if(unLockIds.length>0){
      yield call(Api.unLockReport, { reportIds: unLockIds });
    }
    msg = 'Lock Update Succeed';
    if (status !== 200 || data.code !== 0) {
			type = STATUS_TYPE.ERROR;
      msg = data.message;
			return;
		}
  } catch (e) {
    console.log("error", e);
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
			type: ACTIONS.REFRESH_REPORT,
			payload: {},
		});
	}
}

function* refreshSwReport() {
  let prevParam = yield select(
    (state) => state.SWReport.reportPrevQuery
  );
  let res = yield call(Api.getSwReportList, prevParam.reportPrevQuery);
  const { page, content } = res.data.data;
    yield put({
      type: ACTIONS.SET_SW_REPORT_LIST,
      payload: {
        currentPage: page.number,
        total: page.totalElements,
        pageSize: page.size,
        totalPages: page.totalPages,
        list:content??[],
        reportPrevQuery:{...prevParam.reportPrevQuery}
      },
    });
}

function* refreshQueryOrDownload() {
  let prevParam = yield select(
    (state) => state.SWReport.queryOrDownloadPrevQuery
  );
  let res = yield call(Api.getSwReportList, prevParam.queryOrDownloadPrevQuery);
  const { page, content } = res.data.data;
    yield put({
      type: ACTIONS.SET_SW_QUERY_OR_DOWNLOAD_LIST,
      payload: {
        currentPage: page.number,
        total: page.totalElements,
        pageSize: page.size,
        totalPages: page.totalPages,
        list:content??[],
        queryOrDownloadPrevQuery:{...prevParam.queryOrDownloadPrevQuery}
      },
    });
}

function* updateQueryOrDownload({ payload }) {
	let type = STATUS_TYPE.SUCCESS;
	let msg = '';
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    const { status, data } =  yield call(Api.updateQueryOrDownload, payload);
    msg = data.message;
    if (status !== 200 || data.code !== 0) {
			type = STATUS_TYPE.ERROR;
			return;
		}
  } catch (error) {
    msg = error;
    throw new Error(`[updateQueryOrDownload]: ${error}`);
  }
  finally {
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
        type: ACTIONS.REFRESH_QUERY_OR_DOWNLOAD
      });
      yield put({
        type: Actions.SET_IS_LOADING,
        payload: false,
      });
    }
}

function* deleteQueryOrDownload({ payload }) {
  let type = STATUS_TYPE.SUCCESS;
	let msg = '';
  let { swCollectionId } = payload;
  yield put({
    type: Actions.SET_IS_LOADING,
    payload: true,
  });
  try {
    const { status, data } = yield call(Api.deleteQueryOrDownload, { swCollectionId });
    msg = data.message;
    if (status !== 200 || data.code !== 0) {
			type = STATUS_TYPE.ERROR;
			return;
		}
  } catch (e) {
    console.log("error", e);
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
        type: ACTIONS.REFRESH_QUERY_OR_DOWNLOAD
      });
      yield put({
        type: Actions.SET_IS_LOADING,
        payload: false,
      });
    }
}

function* uploadTemplateExcel({ payload }) {
	let type = STATUS_TYPE.SUCCESS;
	let msg = '';

	try {
		yield put({ type: Actions.SET_IS_LOADING, payload: true });
    if(payload.file.name!=='upload-SAM-template.xlsx'){
      type = STATUS_TYPE.ERROR;
      msg ='Please modify the file name to [upload-SAM-template.xlsx]';
      yield put({
        type: Actions.SET_IS_LOADING,
        payload: false,
      });
      return 
    }
		const { status, data } = yield call(Api.uploadTemplateExcel, payload);
		const { message } = data;

		msg = message;

		if (status !== 200 || data.code !== 0) {
			type = STATUS_TYPE.ERROR;
			return;
		}
	} catch (error) {
		throw new Error(`[uploadTemplateExcel]: ${error}`);
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
	}
}

function* downloadTemplateExcel({ payload }) {
  let msg = "";
  try {
    const { status, data } = yield call(Api.downloadTemplateExcel);
    if (status !== 200) {
      msg = data.message;
      return;
    }
    DownloadFile({ data, name: "downloadTemplateExcel" });
  } catch (error) {
    msg = error;
    throw new Error(`[downloadAuthMgtExcelTemplate]: ${error}`);
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

function* uploadQueryOrDownload({ payload }) {
	let type = STATUS_TYPE.SUCCESS;
	let msg = '';

	try {
    yield put({
      type: ACTIONS.SET_UPLOAD_DISABLE,
      payload: {
        disable2:true
      },
    });
		const { status, data } = yield call(Api.uploadQueryOrDownload, payload);
		const { message } = data;

		msg = message;

		if (status !== 200 || data.code !== 0) {
			type = STATUS_TYPE.ERROR;
			return;
		}
    yield put({
      type: ACTIONS.REFRESH_QUERY_OR_DOWNLOAD
    });
	} catch (error) {
		throw new Error(`[uploadQueryOrDownload]: ${error}`);
	} finally {
		const duration =
			type === STATUS_TYPE.SUCCESS ? SNACKBAR_MESSAGE_DURATION : null;
      yield put({
        type: ACTIONS.SET_UPLOAD_DISABLE,
        payload: {
          disable2:false
        },
      });
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

function* exportSWCollectExcel({ payload }) {
	let msg = '';
	try {
    yield put({
      type: ACTIONS.SET_EXPORT_DISABLE,
      payload: {
        disable:true
      },
    });
		const { status, data } = yield call(Api.exportSWCollectExcel, payload);

		if (status !== 200) {
			msg = data.message;
			return;
		}
		DownloadFile({ data, name: `${payload.year}SWCollect` });
	} catch (error) {
		throw new Error(`[exportSWCollectExcel]: ${error}`);
	} finally {
    yield put({
      type: ACTIONS.SET_EXPORT_DISABLE,
      payload: {
        disable:false
      },
    });
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


const SWReportReducerSaga = [
  takeEvery(ACTIONS.GET_SW_QUERY_OR_DOWNLOAD_LIST, getSwQueryOrDownloadList),
  takeEvery(ACTIONS.GET_SW_REPORT_LIST, getSwReportList),
  takeEvery(ACTIONS.GET_SW_REPORT_DETAIL_LIST, getSwReportDetailList),
  takeEvery(ACTIONS.SET_SW_REPORT_LOCK, setLockArr),
  takeEvery(ACTIONS.GET_LOCK_PARAMS, getSwReportLockParams),
  takeEvery(ACTIONS.REFRESH_REPORT, refreshSwReport),
  takeEvery(ACTIONS.REFRESH_QUERY_OR_DOWNLOAD, refreshQueryOrDownload),
  takeEvery(ACTIONS.UPDATE_QUERY_OR_DOWNLOAD, updateQueryOrDownload),
  takeEvery(ACTIONS.DELETE_QUERY_OR_DOWNLOAD, deleteQueryOrDownload),
  takeEvery(ACTIONS.UPLOAD_TEMPLATE_EXCEL, uploadTemplateExcel),
  takeEvery(ACTIONS.DOWNLOAD_TEMPLATE_EXCEL, downloadTemplateExcel),
  takeEvery(ACTIONS.UPLOAD_QUERY_OR_DOWNLOAD_EXCEL, uploadQueryOrDownload),
  takeEvery(ACTIONS.EXPORT_SW_COLLECTION_EXCEL, exportSWCollectExcel),
];

export { SWReportReducer, SWReportReducerSaga };
