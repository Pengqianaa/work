import { call, put, takeEvery } from 'redux-saga/effects';
import Api from 'src/api/admin/SWCollectionMgt/SWCollectionPlanApi';
import {
	Actions,
	STATUS_TYPE,
	SNACKBAR_MESSAGE_DURATION,
	INITIAL_STATE,
} from 'src/constants/common';

export const ACTIONS = {
	GET_SW_COLLECTION_PLAN_LIST: 'GET_SW_COLLECTION_PLAN_LIST',
	SET_SW_COLLECTION_PLAN_LIST: 'SET_SW_COLLECTION_PLAN_LIST',
	POST_SW_COLLECTION_PLAN: 'POST_SW_COLLECTION_PLAN',
};

const initialState = {
	...INITIAL_STATE,
	planDate: {
		beginDate: '',
		endDate: '',
	},
};

const SWCollectionPlanReducer = (state = initialState, action) => {
	const { type, payload } = action;
	if (type === ACTIONS.SET_SW_COLLECTION_PLAN_LIST) {
		const { number, totalElements, size, totalPages, content } = payload;
		const { beginDate, endDate } = content[0];
		const hasCurrentYearData =
			new Date(beginDate).getFullYear() === new Date().getFullYear();

		return {
			...state,
			currentPage: number,
			total: totalElements,
			pageSize: size,
			totalPages,
			list: content,
			...(hasCurrentYearData && { planDate: { beginDate, endDate } }),
		};
	}
	return state;
};

function* getSWCollectionPlanList({ payload }) {
	let msg = '';

	try {
		yield put({ type: Actions.SET_IS_LOADING, payload: true });

		const { status, data } = yield call(Api.getSWCollectionPlanList, payload);

		if (status !== 200 || data.code !== 0) {
			msg = data.message;
			return;
		}

		const { page, content } = data.data;

		yield put({
			type: ACTIONS.SET_SW_COLLECTION_PLAN_LIST,
			payload: {
				...page,
				content,
			},
		});
	} catch (error) {
		throw new Error(`[getSWCollectionPlanList]: ${error}`);
	} finally {
		yield put({ type: Actions.SET_IS_LOADING, payload: false });
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

function* postSWCollectionPlan({ payload }) {
	let type = STATUS_TYPE.SUCCESS;
	let msg = '';
	try {
		yield put({ type: Actions.SET_IS_LOADING, payload: true });

		const { status, data } = yield call(Api.postSWCollectionPlan, payload);
		msg = data.message;
		if (status !== 200 || data.code !== 0) {
			type = STATUS_TYPE.ERROR;
			return;
		}
	} catch (error) {
		throw new Error(`[postSWCollectionPlan]: ${error}`);
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
			type: ACTIONS.GET_SW_COLLECTION_PLAN_LIST,
			payload: {},
		});
	}
}

const SWCollectionPlanSaga = [
	takeEvery(ACTIONS.GET_SW_COLLECTION_PLAN_LIST, getSWCollectionPlanList),
	takeEvery(ACTIONS.POST_SW_COLLECTION_PLAN, postSWCollectionPlan),
];

export { SWCollectionPlanReducer, SWCollectionPlanSaga };
