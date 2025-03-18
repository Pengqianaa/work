import Actions from "src/Common/Actions";
import Sagas from "src/Common/Sagas";

export { Actions, Sagas };

export const CATEGORY = {
    TRIALWARE: 1,
    FREEWARE: 2,
    OPEN_SOURCE: 3,
    COMMERCIAL: 4,
    PATCH_DRIVER: 5,
    DELTA_LIBRARY: 6,
    COMMERCIAL_LIBRARY: 7,
    DELTA_SOFTWARE_TOOL: 8,
};

export const SCREEN = {
    WIDTH_LIMIT: 1050,
    LAPTOP: 992,
    SMALL_DEVICE: 780,
    X_SMALL_DEVICE: 560,
};

export const SOURCE_SYSTEM = {
    SPR: "SPR",
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
    FREEWARE_REVIEW: 17,
};

export const ROLES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const DropDownMenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            zIndex: 99999,
        },
    },
};

export const E_FORM_QUERY_TABS = {
    INSTALL: "1",
    UNINSTALL: "2",
    ONGOING: "3",
    CANCEL: "4",
};
export const FREEWARE_REVIEW_TABS = {
    FREEWARE: "1",
};
export const SOFTWARE_INFO_TABS = {
    INSTALLATION: "1",
    TRIALWARE: "2",
};

export const SDP_MGT_TABS = {
    MANUAL: "1",
    UNPROCESSED: "2",
    PROCESSED: "3",
};

// 4-1    Open
// 4-2    Onhold
// 4-3    Closed
// 4-4    Resolved
// 4-301  Assigned
// 4-302  In Progress
// 4-901  Cancelled
export const SDP_STATUS_COLORS = {
    "4-1": "#0066ff",
    "4-2": "#ff0000",
    "4-3": "#006600",
    "4-4": "#00ff66",
    "4-301": "#006699",
    "4-302": "#00ffcc",
    "4-901": "#ffff00",
};
export const SW_ASSET_INFO = {
    LIST_TYPE: [
        { id: 1, value: "未定義" },
        { id: 2, value: "白名單" },
        { id: 3, value: "黑名單" },
    ],
    REASON_VALUE: [
        { id: 1, value: "合規問題" },
        { id: 2, value: "資安問題" },
        { id: 3, value: "政策問題" },
    ],
    INSTALL_TYPE: [
        { id: 1, value: "軟體安裝中心" },
        { id: 2, value: "IT協助安裝" },
        { id: 3, value: "自行安裝" },
    ],
    APPLY_TYPE: [{
            id: 2,
            value: "本機權限申請",
            cartValueTC: "本機權限申請安装",
            cartValueEN: "Computer native permission application",
        },
        { id: 1, value: "軟體安裝申請", cartValue: "從軟件中心安装" },
    ],
};

export const SW_ASSET_EDIT_INFO = {
    EDIT_INFO: {
        name: "",
        edition: "",
        version: "",
        brandId: 1,
        desc: "",
        descEN: "",
        sourceURL: "",
        listType: 1,
        installType: 3,
        applyType: 2,
        remark: "",
        reason: "",
        category: [],
        valid: false,
        graph: "",
    },
    ERROR_MESSAGE: {
        name: false,
        installType: false,
        applyType: false,
        listType: false,
        brandId: false,
    },
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