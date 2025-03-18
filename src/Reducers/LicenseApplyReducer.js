import Api from "../Common/api";
import { call, put, takeEvery } from "redux-saga/effects";
import { Actions } from "../Common/constants";
import { ACTIONS as ViewActions } from "./ViewReducer";

const initialState = {
	applicantList: [],
	licenseApplyDetail: {},
	licenseEnough: null,
};

export const ACTIONS = {
	APPLY_LICENSE: 'APPLY_LICENSE',
	FIND_LICENSE_BY_ID: 'FIND_LICENSE_BY_ID',
	FIND_APPLICANT_BY_ORG: 'FIND_APPLICANT_BY_ORG',
	CHECK_LICENSE_ENOUGH: 'CHECK_LICENSE_ENOUGH',
	ASSIGN_USER_SCHEDULE: 'ASSIGN_USER_SCHEDULE',
	SET_APPLICANT_LIST: 'SET_APPLICANT_LIST',
	SET_LICENSE_APPLY_DETAIL: 'SET_LICENSE_APPLY_DETAIL',
	SET_LICENSE_ENOUGH: 'SET_LICENSE_ENOUGH',
};

const LicenseApplyReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case ACTIONS.SET_APPLICANT_LIST:
			// 更新 applicantList 状态
			// const applicantList = payload.map(item => item.userName);
			return {
				...state,
				applicantList: payload,
			};
		case ACTIONS.SET_LICENSE_APPLY_DETAIL:
			return {
				...state,
				licenseApplyDetail: payload,
			};
		case ACTIONS.SET_LICENSE_ENOUGH:
			return {
				...state,
				licenseEnough: payload ,
			};
		default:
			return state;
	}
};

function* applyLicense({ payload }) {
	let message = '';
	try {
		yield put({ type: Actions.SET_IS_LOADING, payload: true });
		const { status, data } = yield call(Api.applyLicense, payload);
		if (status === 200) {
			message = data
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
		}
	} catch (error) {
		console.error(`[applyLicense]: ${error}`);
	} finally {
		yield put({ type: Actions.SET_IS_LOADING, payload: false });
		if (!message) {
			return;
		}
	}
}

function* findLicenseById({ payload }) {
	let msg = '';
	try {
		yield put({ type: Actions.SET_IS_LOADING, payload: true });
		const { status, data } = yield call(Api.findLicenseById, payload);
		if (status !== 200) {
			msg = data.message;
			return;
		}
		yield put({ type: ACTIONS.SET_LICENSE_APPLY_DETAIL, payload: data });
	} catch (error) {
		console.error(`[findLicenseById]: ${error}`);
		yield put({ type: ACTIONS.SET_LICENSE_APPLY_DETAIL, payload: {} });
	} finally {
		yield put({ type: Actions.SET_IS_LOADING, payload: false });
	}
}

function* findApplicantByOrg({ payload }) {
	let msg = '';
	try {
		yield put({ type: Actions.SET_IS_LOADING, payload: true });
		const { status, data } = yield call(Api.findApplicantByOrg, payload);
		if (status !== 200) {
			msg = data.message;
			return;
		}
		yield put({ type: ACTIONS.SET_APPLICANT_LIST, payload: data });
	} catch (error) {
		console.error(`[findApplicantByOrg]: ${error}`);
	} finally {
		yield put({ type: Actions.SET_IS_LOADING, payload: false });
	}
}

function* checkLicenseEnough({ payload }) {
	let msg = '';
	let flag = true;
	try {
	  yield put({ type: Actions.SET_IS_LOADING, payload: true });
	  const { status, data } = yield call(Api.checkLicenseEnough, payload);
	  if (status !== 200) {
		msg = data.message;
		flag = false;
	  } else {
		flag = data !== 'fail';
	  }
  
	  // 將結果存儲到 Redux Store
	  yield put({ type: ACTIONS.SET_LICENSE_ENOUGH, payload: flag });
	} catch (error) {
	  console.error(`[checkLicenseEnough]: ${error}`);
	  // 存儲錯誤狀態（可選）
	  yield put({ type: ACTIONS.SET_LICENSE_ENOUGH, payload: false });
	} finally {
	  yield put({ type: Actions.SET_IS_LOADING, payload: false });
	}
  }

function* assignUserSchedule({ payload }) {
	let msg = '';
	try {
		yield put({ type: Actions.SET_IS_LOADING, payload: true });
		const { status, data } = yield call(Api.assignUserSchedule, payload);
		if (status !== 200) {
			msg = data.message;
			return;
		}
	} catch (error) {
		console.error(`[assignUserSchedule]: ${error}`);
	} finally {
		yield put({ type: Actions.SET_IS_LOADING, payload: false });
	}
}

const LicenseApplySaga = function* () {
	// 使用 yield 调用 takeEvery
	yield takeEvery(ACTIONS.APPLY_LICENSE, applyLicense);
	yield takeEvery(ACTIONS.FIND_LICENSE_BY_ID, findLicenseById);
	yield takeEvery(ACTIONS.FIND_APPLICANT_BY_ORG, findApplicantByOrg);
	yield takeEvery(ACTIONS.CHECK_LICENSE_ENOUGH, checkLicenseEnough);
	yield takeEvery(ACTIONS.ASSIGN_USER_SCHEDULE, assignUserSchedule);
};

export { LicenseApplyReducer, LicenseApplySaga };