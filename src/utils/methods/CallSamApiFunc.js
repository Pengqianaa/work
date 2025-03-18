import axios from "axios";
import { Actions, METHOD_TYPE } from "../../constants/common";
import { ACTIONS as ViewActions } from "../../Reducers/ViewReducer";
import {
  PROCESS_SERVER_IP,
  BACK_SERVER_IP,
  SAM_REDIRECT_URL,
  SAM_LOGIN_URL,
} from "../../constants/config";
import { store } from "../../store";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  config.headers["Authorization"] = ''
  if (store.getState().user.token) {
    config.headers["Authorization"] = `Bearer ${store.getState().user.token}`;
  }
  // 设置默认的 Content-Type，如果没有指定
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json"; // 适配你的需求，比如 'application/x-www-form-urlencoded'
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => {
    store.dispatch({ type: Actions.SET_IS_LOADING, payload: false });
    return response;
  },
  (error) => {
    const response = error.response || {}; // 安全处理
    const status = response.status || "Unknown Status";
    const message = response.data?.messages || error.message || "Unknown Error";
    console.error(`Error in response: Status=${status}, Message=${message}`);
    if (status === 401) {
      const url = `${SAM_LOGIN_URL}${SAM_REDIRECT_URL}`
      window.open(url, "_self");
    }
    if (status === 555) {
      store.dispatch({
        type: ViewActions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: message,
            msgType: 4,
            autoHideDuration: null,
          },
        },
      });
    }
    if (status === 400) {
      const detail = response.data.detail
      store.dispatch({
        type: ViewActions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: detail,
            msgType: 4,
            autoHideDuration: null,
          },
        },
      });
    }
    store.dispatch({ type: Actions.SET_IS_LOADING, payload: false });
    return Promise.reject(error);
  }
);


const callAxios = (
  method,
  _url,
  config = {},
  data = null,
  isProcess = false
) => {
  // axios
  //     .get('https://rmp-dev.deltaww.com/api/current-user',config)
  //     .then(response => (this.info = response))
  //     .catch(function (error) { // 请求失败处理
  //       console.log(error);
  //   });
  const url = `${isProcess ? PROCESS_SERVER_IP : BACK_SERVER_IP}/${_url.replace(/^\//, "")}`;
  switch (method) {
    case METHOD_TYPE.POST:
      return axiosInstance.post(url, data, config);
    case METHOD_TYPE.GET:
      return axiosInstance.get(url, { params: data, ...config });
    case METHOD_TYPE.DELETE:
      return axiosInstance.delete(url, { data: data, ...config })
    case METHOD_TYPE.PUT:
      return axiosInstance.put(url, data, config);
    case METHOD_TYPE.PATCH:
      return axiosInstance.patch(url, data, config);
    default:
      console.log(`Can't read method: ${method}`);
      return false;
  }
};

/**
 * 處理 sam portal api 的共用 function
 * @param {string} method CRUD (共用變數 METHOD_TYPE 在 src/constants/common.js)
 * @param {string} url
 * @param {any} config
 * @param {any} data
 * @param {boolean} isProcess
 * @returns {Promise<any> | void}
 * @example
 *  下載二進制回傳格式 (帶入 responseType)
 *  {responseType: 'blob' or 'arraybuffer'}
 *  CallSamApiFunc(METHOD_TYPE.GET, url, {responseType: 'blob'})
 */
const CallSamApiFunc = (
  method,
  url,
  config = {},
  data = null,
  isProcess = false
) => {
  return callAxios(method, url, config, data, isProcess)
    .then((data) => {
      // console.log("Response Data:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error in CallSamApiFunc:", error);
      return Promise.reject(error); // 确保返回 Promise.reject
    });
};


export default CallSamApiFunc;
