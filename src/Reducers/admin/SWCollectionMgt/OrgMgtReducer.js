import { call, put, takeEvery } from 'redux-saga/effects';
import Api from 'src/api/admin/SWCollectionMgt/OrgMgtApi';
import { DownloadFile } from 'src/utils/methods/common';
import {
	Actions,
	STATUS_TYPE,
	SNACKBAR_MESSAGE_DURATION,
	INITIAL_STATE,
} from 'src/constants/common';
import { DEFAULT_SORT_COL } from 'src/constants/admin/SWCollectionMgt';

export const ACTIONS = {
	GET_ORG_MGT_STATUS: 'GET_ORG_MGT_STATUS',
	SET_ORG_MGT_STATUS: 'SET_ORG_MGT_STATUS',
	GET_ORG_MGT_LIST: 'GET_ORG_MGT_LIST',
	SET_ORG_MGT_LIST: 'SET_ORG_MGT_LIST',
	EXPORT_ORG_MGT_EXCEL: 'EXPORT_ORG_MGT_EXCEL',
	IMPORT_ORG_MGT_EXCEL: 'IMPORT_ORG_MGT_EXCEL',
	DOWNLOAD_ORG_MGT_EXCEL: 'DOWNLOAD_ORG_MGT_EXCEL',
};

const initialState = {
	...INITIAL_STATE,
	sort: `${DEFAULT_SORT_COL.ORG_MGT},asc`,
	orgMgtStatus: false,
	currentUpdatedDate: '',
	lastUpdatedDate: '',
};

const OrgMgtReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case ACTIONS.SET_ORG_MGT_LIST:
			const { number, totalElements, size, totalPages, content } = payload;
			return {
				...state,
				currentPage: number,
				total: totalElements,
				pageSize: size,
				totalPages,
				list: content,
			};
		case ACTIONS.SET_ORG_MGT_STATUS:
			const { currentYearUpdate, currentYearUpdateDate, lastUpdateDate } =
				payload;
			return {
				...state,
				orgMgtStatus: currentYearUpdate,
				currentUpdatedDate: currentYearUpdateDate,
				lastUpdatedDate: lastUpdateDate,
			};
		default:
			return state;
	}
};

function* getOrgMgtStatus() {
	const { status, data } = yield call(Api.getOrgMgtStatus);

	if (status !== 200 || data.code !== 0) {
		yield put({
			type: Actions.SHOW_SNACKBAR_MESSAGE,
			payload: {
				show: true,
				props: {
					message: data.message,
					msgType: STATUS_TYPE.ERROR,
					autoHideDuration: null,
				},
			},
		});
		return;
	}

	yield put({
		type: ACTIONS.SET_ORG_MGT_STATUS,
		payload: data.data,
	});
}

function* getOrgMgtList({ payload }) {
	let msg = '';
	const { fetchStatus } = payload;
	try {
		yield put({ type: Actions.SET_IS_LOADING, payload: true });
		const { status, data } = yield call(Api.getOrgMgtList, payload);

		if (status !== 200 || data.code !== 0) {
			msg = data.message;
			return;
		}

		const { page, content } = data.data;

		yield put({
			type: ACTIONS.SET_ORG_MGT_LIST,
			payload: {
				...page,
				content,
			},
		});
	} catch (error) {
		throw new Error(`[getOrgMgtList]: ${error}`);
	} finally {
		if (fetchStatus) {
			yield put({ type: ACTIONS.GET_ORG_MGT_STATUS });
		}

		if (msg) {
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
}

function* importOrgMgtExcel({ payload }) {
	let type = STATUS_TYPE.SUCCESS;
	let msg = '';

	try {
		yield put({ type: Actions.SET_IS_LOADING, payload: true });

		const { status, data } = yield call(Api.importOrgMgtExcel, payload);
		const { message } = data;

		msg = message;

		if (status !== 200 || data.code !== 0) {
			type = STATUS_TYPE.ERROR;
			return;
		}

		yield put({
			type: ACTIONS.GET_ORG_MGT_LIST,
			payload: { fetchStatus: true },
		});
	} catch (error) {
		throw new Error(`[importOrgMgtExcel]: ${error}`);
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

function* exportOrgMgtExcel({ payload }) {
	let msg = '';
	try {
		const { status, data } = yield call(Api.exportOrgMgtExcel, payload);

		if (status !== 200) {
			msg = data.message;
			return;
		}

		DownloadFile({ data, name: `${payload.year}SWOrgMgt` });
	} catch (error) {
		throw new Error(`[exportOrgMgtExcel]: ${error}`);
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

function* downloadOrgMgtExcelTemplate() {
	let msg = '';
	try {
		const { status, data } = yield call(Api.downloadOrgMgtExcelTemplate);
		if (status !== 200) {
			msg = data.message;
			return;
		}
		DownloadFile({ data, name: 'SWOrgMgtTemplate' });
	} catch (error) {
		throw new Error(`[downloadOrgMgtExcelTemplate]: ${error}`);
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

const OrgMgtSaga = [
	takeEvery(ACTIONS.GET_ORG_MGT_STATUS, getOrgMgtStatus),
	takeEvery(ACTIONS.GET_ORG_MGT_LIST, getOrgMgtList),
	takeEvery(ACTIONS.IMPORT_ORG_MGT_EXCEL, importOrgMgtExcel),
	takeEvery(ACTIONS.EXPORT_ORG_MGT_EXCEL, exportOrgMgtExcel),
	takeEvery(ACTIONS.DOWNLOAD_ORG_MGT_EXCEL, downloadOrgMgtExcelTemplate),
];

export { OrgMgtReducer, OrgMgtSaga };
