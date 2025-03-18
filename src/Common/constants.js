import Actions from "./Actions";

export { Actions };

export const SCREEN = {
  WIDTH_LIMIT: 1050,
  LAPTOP: 992,
  SMALL_DEVICE: 780,
  X_SMALL_DEVICE: 560,
};

export const ADMIN_ROLES = {
  IT_ADMIN: 8,
  SO_TEAM: 9,
  CLIENT_TEAM: 10,
  SERVER_TEAM: 11,
  FOSS_TEAM: 12,
  VENDOR: 13,
  E_FORM_QUERY: 14,
  SW_COLLECTOR: 15,
  SW_DATA_VIEWER: 16,
};

export const MOMENT_FORMAT = {
  DATE: "YYYY-MM-DD",
  DATE_TIME_WITHOUT_SECOND: "YYYY-MM-DD HH:mm",
  DATE_TIME_WITH_SECOND: "YYYY-MM-DD HH:mm:ss",
};

export const ROWS_PER_PAGE = [5, 10, 25];
