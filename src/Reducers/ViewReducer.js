import { Actions } from "../Common/constants";

const initialState = {
  isTestingEnv: process.env.REACT_APP_API_URL.includes("softwaredev")||
                process.env.REACT_APP_API_URL.includes("softwaresit"),
  isLoading: false,
  showProfileModal: false,
  toggleTokenModal: false,
  showCartOverlay: false,
  currentLocale: "zh-TW",
  isLogPage: true,
  goToPageFunc: () => {},

  alertProps: {
    title: "",
    message: "",
    hasCancel: false,
    callback: () => null,
  },
  alertShow: false,
  snackbarShow: false,
  snackbarProps: {
    message: "",
    status: "", // info,error,warning
    callback: () => null,
  },
};

const ViewReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case Actions.SHOW_ALERT_MESSAGE:
      return {
        ...state,
        alertShow: payload.show,
        alertProps: { ...payload.props },
      };
    case Actions.TOGGLE_ALERT:
      return { ...state, alertShow: payload };
   case Actions.TOGGLE_SNACKBAR:
        return { ...state, snackbarShow: payload };
    case Actions.SHOW_SNACKBAR_MESSAGE:
      return {
        ...state,
        snackbarShow: payload.show,
        snackbarProps: { ...payload.props },
      };
    case Actions.SET_IS_LOADING:
      return { ...state, isLoading: payload };
    case Actions.SET_SHOW_PROFILE_MODAL:
      return { ...state, showProfileModal: payload };
    case Actions.SET_TOGGLE_TOKEN_MODAL:
      return { ...state, toggleTokenModal: payload };
    case Actions.SET_SHOW_CART_OVERLAY:
      return { ...state, showCartOverlay: payload };
    case Actions.SET_LOCALE:
      return { ...state, currentLocale: payload };
    case Actions.SET_ISLOGPAGE:
      return { ...state, isLogPage: payload };
    case Actions.INIT_GO_TO_PAGE:
      return { ...state, goToPageFunc: payload };
    case Actions.GO_TO_PAGE:
      setTimeout(() => {
        state.goToPageFunc(payload);
      }, 100);
      return { ...state };
    default:
      return state;
  }
};

export { ViewReducer };
