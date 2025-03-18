import { FILE_TYPE, DownloadFile } from './DownloadFile';
import moment from 'moment';
import { MOMENT_FORMAT } from '../../constants/common';

/**
 * 處理 Table 欄位內容, 並統一當欄位無資料時顯示一槓
 * @param {string | number}
 * @returns {string | number}
 */
const viewCallback = (el) => (el ? el : '-');

/**
 * 處理 Table 欄位內容, 並統一當欄位無資料時顯示一槓
 * @param {string} el
 * @param {string} format 預設為 "YYYY/MM/DD"
 * @returns {string}
 */
const viewFormatDateCallback = (el, format = MOMENT_FORMAT.DATE) =>
	el ? moment(el).format(format) : '-';

/**
 * 提交時檢查必填欄位是否為空, 設定錯誤訊息是否顯示, 並返回布林值
 * @param {object} data
 * @param {function} setError
 * @returns {boolean}
 */
const checkRequiredInputsAreEmptyOrNot = (data, setError) => {
	let isUnverified = false;
	setError((preError) => {
		const result = Object.entries(preError).reduce((prev, [name]) => {
			const value = data[name];
			let empty = false;
			switch (typeof value) {
				case 'string':
				case 'number':
					empty = !value || !value.toString().trim();
					break;
				case 'object':
					empty = !value || !Object.keys(value)?.length;
					break;
				default:
					break;
			}
			return { ...prev, [name]: empty };
		}, {});
		isUnverified = Object.values(result).find((empty) => empty);
		return result;
	});
	return isUnverified;
};

/**
 * 驗證字串是否為 JSON 格式, 並回傳布林值
 * @param {string} text 需被驗證的字串
 * @returns {boolean}
 */
const isJSON = (text) => {
	if (!text || typeof text !== 'string') {
		return false;
	}

	try {
		const jsonObj = JSON.parse(text);
		return jsonObj && typeof jsonObj === 'object' && !Array.isArray(jsonObj);
	} catch (error) {
		return false;
	}
};

// const DATA_TYPE = {
//   STRING: "string",
//   NUMBER: "number",
//   BOOLEAN: "boolean",
//   OBJECT: "object",
//   ARRAY: "array",
// };

// const getDataType = (data) => {
//   switch (typeof data) {
//     case DATA_TYPE.STRING:
//       return DATA_TYPE.STRING;
//     case DATA_TYPE.NUMBER:
//       return DATA_TYPE.NUMBER;
//     case DATA_TYPE.BOOLEAN:
//       return DATA_TYPE.BOOLEAN;
//     case DATA_TYPE.OBJECT:
//       return Array.isArray(data) ? DATA_TYPE.ARRAY : DATA_TYPE.OBJECT;
//     default:
//       break;
//   }
// };

export {
	FILE_TYPE,
	DownloadFile,
	viewFormatDateCallback,
	viewCallback,
	checkRequiredInputsAreEmptyOrNot,
	isJSON,
};
