import { call, put, takeEvery } from 'redux-saga/effects';
import Api from 'src/api/admin/SWCollectionMgt/RateMgtApi';
import {
	Actions,
	STATUS_TYPE,
	SNACKBAR_MESSAGE_DURATION,
	INITIAL_STATE,
} from 'src/constants/common';
import { DEFAULT_SORT_COL } from 'src/constants/admin/SWCollectionMgt';

export const ACTIONS = {
	GET_RATE_MGT_LIST: 'GET_RATE_MGT_LIST',
	SET_RATE_MGT_LIST: 'SET_RATE_MGT_LIST',
	SET_MODIFIED_RATE_MGT: 'SET_MODIFIED_RATE_MGT',
	POST_RATE_MGT: 'POST_RATE_MGT',
	DELETE_RATE_MGT: 'DELETE_RATE_MGT',
};

export const INIT_MODIFIED_DATA = {
	fromCurrency: '',
	toCurrency: '',
	rate: '',
};

const initialState = {
	...INITIAL_STATE,
	sort: `${DEFAULT_SORT_COL.RATE_MGT},asc`,
	currYearDataCount: 0,
	modifyData: {
		...INIT_MODIFIED_DATA,
	},
};

const RateMgtReducer = (state = initialState, action) => {
	const { type, payload } = action;

	switch (type) {
		case ACTIONS.SET_RATE_MGT_LIST: {
			const { number, totalElements, size, totalPages, content } = payload;

			const currYearDataCount = content.filter(
				(data) => !!data.currentYear
			).length;

			return {
				...state,
				currentPage: number,
				total: totalElements,
				pageSize: size,
				totalPages,
				list: content,
				currYearDataCount,
			};
		}
		case ACTIONS.SET_MODIFIED_RATE_MGT:
			return {
				...state,
				modifyData: payload,
			};
		default:
			return state;
	}
};

function* getRateMgtList({ payload }) {
	let msg = '';

	try {
		yield put({ type: Actions.SET_IS_LOADING, payload: true });

		const { status, data } = yield call(Api.getRateMgtList, payload);

		if (status !== 200 || data.code !== 0) {
			msg = data.message;
			return;
		}

		const { page, content } = data.data;

		yield put({
			type: ACTIONS.SET_RATE_MGT_LIST,
			payload: {
				...page,
				content: content ?? [],
			},
		});
	} catch (error) {
		throw new Error(`[getRateMgtList]: ${error}`);
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

function* postRateMgt({ payload }) {
	let type = STATUS_TYPE.SUCCESS;
	let msg = '';
	try {
		yield put({ type: Actions.SET_IS_LOADING, payload: true });

		const { status, data } = yield call(Api.updateRateMgt, payload);
		msg = data.message;
		if (status !== 200 || data.code !== 0) {
			type = STATUS_TYPE.ERROR;
			return;
		}
	} catch (error) {
		throw new Error(`[postRateMgt]: ${error}`);
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
			type: ACTIONS.GET_RATE_MGT_LIST,
			payload: {},
		});
	}
}

function* deleteRateMgt({ payload }) {
	let type = STATUS_TYPE.SUCCESS;
	let msg = '';
	try {
		yield put({ type: Actions.SET_IS_LOADING, payload: true });

		const { status, data } = yield call(Api.deleteRateMgt, payload);
		msg = data.message;
		if (status !== 200 || data.code !== 0) {
			type = STATUS_TYPE.ERROR;
			return;
		}
	} catch (error) {
		throw new Error(`[postRateMgt]: ${error}`);
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
			type: ACTIONS.GET_RATE_MGT_LIST,
			payload: {},
		});
	}
}

const RateMgtSaga = [
	takeEvery(ACTIONS.GET_RATE_MGT_LIST, getRateMgtList),
	takeEvery(ACTIONS.POST_RATE_MGT, postRateMgt),
	takeEvery(ACTIONS.DELETE_RATE_MGT, deleteRateMgt),
];

export { RateMgtReducer, RateMgtSaga };
