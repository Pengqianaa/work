import Actions from "../Common/Actions";

export { Actions };

export const SCREEN = {
  WIDTH_LIMIT: 1050,
  LAPTOP: 992,
  SMALL_DEVICE: 780,
  X_SMALL_DEVICE: 560,
};


export const BG_BU_SELECTOR_TYPE = {
  AUTH: "AUTH",
  SW: "SW",
};

export const ALL = "_all";

/**
 * NOTE: 用於 cost center 下拉選單用的常數
 */
export const LATEST = "latest";

/**
 * NOTE: Snackbar 元件顯示時間的常數
 */
export const SNACKBAR_MESSAGE_DURATION = 6000;

/**
 * NOTE: 定義各個 reducer 初始值的常數
 */
export const INITIAL_STATE = {
  currentPage: 0,
  pageNum: 0,
  total: 0,
  pageSize: 10,
  totalPages: 0,
  list: [],
};

/**
 * NOTE: Tag and Snackbar 元件背景色的常數
 */
export const STATUS_TYPE = {
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
  INFO: "info",
  DEFAULT: "default",
};

/**
 * NOTE: moment 日期顯示格式常數
 */
export const MOMENT_FORMAT = {
  DATE: "YYYY-MM-DD",
  DATE_TIME_WITHOUT_SECOND: "YYYY-MM-DD HH:mm",
  DATE_TIME_WITH_SECOND: "YYYY-MM-DD HH:mm:ss",
};

/**
 * NOTE: API 方法的常數
 */
export const METHOD_TYPE = {
  POST: "POST",
  GET: "GET",
  DELETE: "DELETE",
  PUT: "PUT",
  PATCH: "PATCH",
};

export const MODIFY_ACTION_TYPE = {
  ADD: "ADD",
  EDIT: "EDIT",
};

export const CURRENCY_TYPE = {
  USD: "USD",
  TWD: "TWD",
};

/**
 * NOTE: 排序用常數
 */
export const SORTING_DIRECTION = {
  ASC_UPPERCASE: "ASC",
  ASC_LOWERCASE: "asc",
  DESC_UPPERCASE: "DESC",
  DESC_LOWERCASE: "desc",
};
