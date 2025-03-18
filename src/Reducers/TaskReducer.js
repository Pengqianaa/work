import Api from "../Common/api";
import { call, put, select, takeEvery } from "redux-saga/effects";
import { Actions } from "../Common/constants";
import { ACTIONS as ViewActions } from "./ViewReducer";

const initialState = {
	queryResults: { content: [] },
	prevQuery: {}, // 用于保存上一次的查询参数
	checkApprovedFlag: false,
};

export const ACTIONS = {
	GET_TASK_INFO_LIST: 'GET_TASK_INFO_LIST',
	SET_TASK_INFO_LIST: 'SET_TASK_INFO_LIST',
	CHECK_TASK_STATUS: 'CHECK_TASK_STATUS',
	SET_APPROVED_FLAG: 'SET_APPROVED_FLAG',
	RELEASE_TASK: 'RELEASE_TASK',
};

const TaskReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case ACTIONS.SET_TASK_INFO_LIST:
			return {
				...state,
				queryResults: payload?.data || {},
				prevQuery: payload?.params || {}, // 保存查询参数
			};
		case ACTIONS.SET_APPROVED_FLAG:
			return {
				...state,
				checkApprovedFlag: payload !== 'fail'
			};
		default:
			return state;
	}
};

function* getTaskInfoList({ payload }) {
	let msg = '';

	try {
		yield put({ type: Actions.SET_IS_LOADING, payload: true });

		const { status, data } = yield call(Api.getTaskInfoList, payload);
		if (status !== 200) {
			msg = data.message;
			return;
		}
        yield put({
            type: ACTIONS.CHECK_TASK_STATUS,
        });
		yield put({
			type: ACTIONS.SET_TASK_INFO_LIST,
			payload: {
				data: data, // API 返回的数据
				params: payload, // 保存查询参数
			},
		});
	} catch (error) {
		throw new Error(`[getTaskInfoList]: ${error}`);
	} finally {
		yield put({ type: Actions.SET_IS_LOADING, payload: false });
	}
}

function* releaseTask({ payload }) {
	const prevParam = yield select((state) => state.taskInfo.prevQuery); // 获取上一次的查询参数
	let message = '';
	try {
		yield put({ type: Actions.SET_IS_LOADING, payload: true });
		const { status, data } = yield call(Api.releaseTaskInfo, payload);
		message = data
		if (status === 200) {
			// 顯示業務邏輯的提示信息（如果存在）
			if (message) {
				yield put({
					type: ViewActions.SHOW_SNACKBAR_MESSAGE,
					payload: {
						show: true,
						props: {
							message,
							msgType: 1,
							autoHideDuration: 6000,
						},
					},
				});
			} else {
				// 默認的成功提示
				yield put({
					type: ViewActions.SHOW_SNACKBAR_MESSAGE,
					payload: {
						show: true,
						props: {
							message: "success!",
							msgType: 1,
							autoHideDuration: 6000,
						},
					},
				});
			}
			yield put({
				type: ACTIONS.GET_TASK_INFO_LIST, payload: prevParam,
			});
		} else {
			// API 請求失敗的提示
			yield put({
				type: ViewActions.SHOW_SNACKBAR_MESSAGE,
				payload: {
					show: true,
					props: {
						message: "fail!",
						msgType: 4,
						autoHideDuration: null,
					},
				},
			});
		}
	} catch (error) {
		console.error(`[releaseTask]: ${error}`);
	} finally {
		yield put({ type: Actions.SET_IS_LOADING, payload: false });
	}
}

function* checkTaskStatus({ payload }) {
	try {
		yield put({ type: Actions.SET_IS_LOADING, payload: true });
		const { data } = yield call(Api.checkTaskStatus, payload);
		yield put({
			type: ACTIONS.SET_APPROVED_FLAG,
			payload: data
			,
		});
	} catch (error) {
		throw new Error(`[checkTaskStatus]: ${error}`);
	} finally {
		yield put({ type: Actions.SET_IS_LOADING, payload: false });
	}
}

const TaskSaga = function* () {
	yield takeEvery(ACTIONS.GET_TASK_INFO_LIST, getTaskInfoList)
	yield takeEvery(ACTIONS.CHECK_TASK_STATUS, checkTaskStatus)
	yield takeEvery(ACTIONS.RELEASE_TASK, releaseTask)
};

export { TaskReducer, TaskSaga };
