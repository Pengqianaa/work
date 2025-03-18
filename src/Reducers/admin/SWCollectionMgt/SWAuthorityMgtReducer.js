import { call, put, takeEvery } from "redux-saga/effects";
import Api from "src/api/admin/SWCollectionMgt/SWAuthorityMgtApi";
import { DownloadFile } from "src/utils/methods/common";
import {
  Actions,
  STATUS_TYPE,
  INITIAL_STATE,
} from "src/constants/common";

export const ACTIONS = {
  SET_AUTHORITY_MGT_LIST: "SET_AUTHORITY_MGT_LIST",
  DOWNLOAD_AUTH_MGT_EXCEL: "DOWNLOAD_AUTH_MGT_EXCEL",
  EXPORT_AUTH_MGT_EXCEL: "EXPORT_AUTH_MGT_EXCEL",
  UPLOAD_AUTH_MGT_EXCEL:"UPLOAD_AUTH_MGT_EXCEL",
  SET_AUTHORITY_EXPORT_DISABLE:"SET_AUTHORITY_EXPORT_DISABLE",
  SET_UPLOAD_DISABLE:"SET_UPLOAD_DISABLE",
};

const initialState = {
  ...INITIAL_STATE,
  sort: "costCenter,asc",
  authMgtExportDisable: false,
  authMgtUploadDisable: false,
  currentUpdatedDate: "",
  lastUpdatedDate: "",
};

const SWAuthorityMgtReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.SET_AUTHORITY_MGT_LIST:
      const { number, totalElements, size, totalPages, content } = payload;
      return {
        ...state,
        currentPage: number,
        total: totalElements,
        pageSize: size,
        totalPages,
        list: content,
      };
    case ACTIONS.SET_AUTHORITY_EXPORT_DISABLE:  
       const { disable } = payload
       return {
         ...state,
         authMgtExportDisable:disable
       }
    case ACTIONS.SET_UPLOAD_DISABLE:  
       const { disable2 } = payload
       return {
         ...state,
         authMgtUploadDisable:disable2
       }      
    default:
      return state;
  }
};

function* exportAuthorityMgtExcel({ payload }) {
  let msg = "";
  let type = STATUS_TYPE.SUCCESS
  try {
    yield put({
      type: ACTIONS.SET_AUTHORITY_EXPORT_DISABLE,
      payload: {
        disable:true
      },
    });
    const { status, data } = yield call(Api.exportAuthorityMgtExcel, payload);

    if (status !== 200) {
      msg = data.message;
      type = STATUS_TYPE.ERROR
      return;
    }

    DownloadFile({ data, name: `SWAuthorityMgt` });
  } catch (error) {
    msg = error;
    throw new Error(`[exportAuthorityMgtExcel]: ${error}`);
  } finally {
    yield put({
      type: ACTIONS.SET_AUTHORITY_EXPORT_DISABLE,
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
          msgType: type,
          autoHideDuration: null,
        },
      },
    });
  }
}

function* downloadAuthorityMgtExcelTemplate() {
  let msg = "";
  let type = STATUS_TYPE.SUCCESS
  try {
    const { status, data } = yield call(Api.downloadAuthMgtExcelTemplate);
    if (status !== 200) {
      msg = data.message;
      type = STATUS_TYPE.ERROR
      return;
    }
    DownloadFile({ data, name: "SWAuthorityMgtTemplate" });
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
          msgType: type,
          autoHideDuration: null,
        },
      },
    });
  }
}

function* uploadSwAuthorityMgtExcel({ payload }) {
  const { file } = payload;
  let msgType = "success";
  let msg = "";
  yield put({
    type: ACTIONS.SET_UPLOAD_DISABLE,
    payload: {
      disable2:true
    },
  });
  try {
    const { status, data } = yield call(Api.uploadSwAuthorityMgtExcel, file);
    msg = data.message;
    if (status !== 200 || data.code !== 0) {
      msgType = "error";
      msg = data.message;
      return;
    }
  } catch (error) {
    throw new Error(`[uploadSwAuthorityMgtExcel]: ${error.message}`);
  } finally {
    yield put({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: msg,
          msgType: msgType,
          autoHideDuration: null,
        },
      },
    });

    yield put({
      type: ACTIONS.SET_UPLOAD_DISABLE,
      payload: {
        disable2:false
      },
    });
  }
}

const AuthoritySaga = [
  takeEvery(ACTIONS.EXPORT_AUTH_MGT_EXCEL, exportAuthorityMgtExcel),
  takeEvery(ACTIONS.DOWNLOAD_AUTH_MGT_EXCEL, downloadAuthorityMgtExcelTemplate),
  takeEvery(ACTIONS.UPLOAD_AUTH_MGT_EXCEL, uploadSwAuthorityMgtExcel),
];

export { SWAuthorityMgtReducer, AuthoritySaga };
