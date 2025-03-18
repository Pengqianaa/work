import axios from "axios";
import { Actions, METHOD_TYPE, STATUS_TYPE } from "../../constants/common";
import {
  SMART_IT_DB_WEB_API,
  SAM_REDIRECT_URL,
  SMART_IT_TOKEN,
} from "../../constants/config";
import { store } from "../store";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((res) => {
  res.headers["Authorization"] = `Bearer ${store.getState().user.token}`;
  return res;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { config, response } = error;
    const { status, data } = response;
    let msg = "";

    if (status) {
      const redirect =
        status >= 500 &&
        config.url.includes("GetSystemsbyLastLoggedOnUserAsync");

      if (redirect) {
        window.open(SAM_REDIRECT_URL + "/500", "_self");
      }

      switch (status) {
        case 400:
          console.log("call mart it error 401", data.Message, data.message);
          msg = data.Message ?? data.message;
          break;
        case 401:
        case 404:
          msg = `${status} interceptor handle`;
          break;
        default:
          throw new Error(`[CallSmartItApiFunc] ${error}`);
      }
    }

    if (msg) {
      store.dispatch({
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

    store.dispatch({ type: Actions.SET_IS_LOADING, payload: false });
    return Promise.resolve(error);
  }
);

const callAxios = (method, url, _config, data = null) => {
  const callUrl = `${SMART_IT_DB_WEB_API}${url}`;
  const notAuthorized = !_config.headers || !_config.headers["Authorization"];
  const config = {
    _config,
    ...(notAuthorized && {
      headers: {
        Authorization: `Basic ${SMART_IT_TOKEN}`,
      },
    }),
  };
  switch (method) {
    case METHOD_TYPE.POST:
      return axiosInstance.post(callUrl, data, {
        ...config,
        withCredentials: false,
      });
    case METHOD_TYPE.GET:
      return axiosInstance.get(callUrl, {
        params: data,
        ...config,
        withCredentials: false,
      });
    case METHOD_TYPE.DELETE:
      return axiosInstance.delete(
        callUrl,
        { params: data },
        { ...config, withCredentials: false }
      );
    case METHOD_TYPE.DELETE:
      return axiosInstance.put(callUrl, data, {
        ...config,
        withCredentials: false,
      });
    case METHOD_TYPE.PATCH:
      return axiosInstance.patch(callUrl, data, {
        ...config,
        withCredentials: false,
      });
    default:
      console.log(`Can't read method: ${method}`);
      return false;
  }
};

/**
 * 處理 smart it api 的共用 function
 * @param {string} method CRUD (共用變數 METHOD_TYPE 在 src/constants/common.js)
 * @param {string} url
 * @param {any} config 用於更改 config 內容 (ex: 處理二進制回傳格式時, {responseType: 'blob' or 'arraybuffer'})
 * @param {any} data
 * @param {boolean} isProcess
 * @returns {Promise<any> | void}
 * @example
 *  下載二進制回傳格式 (帶入 responseType)
 *  {responseType: 'blob' or 'arraybuffer'}
 *  CallSamApiFunc(METHOD_TYPE.GET, url, {responseType: 'blob'})
 */
const CallSmartItApiFunc = (method, url, config, data = null) => {
  return callAxios(method, url, config, data)
    .then(
      (data) =>
        new Promise((resolve, reject) => {
          resolve(data);
        })
    )
    .catch(
      (error) =>
        new Promise((resolve) => {
          resolve(error);
        })
    );
};

export default CallSmartItApiFunc;
