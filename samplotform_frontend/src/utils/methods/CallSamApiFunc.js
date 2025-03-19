import axios from "axios";
import { Actions, METHOD_TYPE } from "src/constants/common";
import {
  PROCESS_SERVER_IP,
  BACK_SERVER_IP,
  SAM_REDIRECT_URL,
  SAM_LOGIN_URL,
} from "src/constants/config";
import { store } from "src/store";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((res) => {
  res.headers.common["Authorization"] = `Bearer ${store.getState().user.token}`;
  return res;
});

axiosInstance.interceptors.response.use(
  (response) => {
    store.dispatch({ type: Actions.SET_IS_LOADING, payload: false });
    return response;
  },
  (error) => {
    const { response } = error;
    const { status } = response;
    if (status) {
      let url = "";
      if (status === 401) {
        url = `${SAM_LOGIN_URL}?relayState=${SAM_REDIRECT_URL}/isLogin?nextUrl=${window.location.pathname}`;
      } else if (status === 403 || status === 404 || status >= 500) {
        url = `${SAM_REDIRECT_URL}/${status}`;
      } else {
        throw new Error(`[CallSamApiFunc] ${error}`);
      }

      if (url) {
        // 验证URL（这里只是一个非常基本的示例）  
        try {  
            new URL(url); // 这将抛出异常，如果url不是一个有效的URL  
        } catch (e) {  
            console.error('无效的URL:', url);  
            return;  
        }
        const allowedDomains = [SAM_REDIRECT_URL];  
        if((url !== null)||(url.length!== 0)){
            // let redirect = allowedDomains.some(domain => url.startsWith(domain))
            let redirect = url.includes("deltaww")
            if(redirect){
              window.open(url,"_self");
            }
          } 
      }
    }

    store.dispatch({ type: Actions.SET_IS_LOADING, payload: false });
    return Promise.resolve(error);
  }
);

const callAxios = (
  method,
  _url,
  config = {},
  data = null,
  isProcess = false
) => {
  const url = `${isProcess ? PROCESS_SERVER_IP : BACK_SERVER_IP}${_url}`;

  switch (method) {
    case METHOD_TYPE.POST:
      return axiosInstance.post(url, data, config);
    case METHOD_TYPE.GET:
      return axiosInstance.get(url, { params: data, ...config });
    case METHOD_TYPE.DELETE:
      return axiosInstance.delete(url, { params: data, ...config });
    case METHOD_TYPE.DELETE:
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

export default CallSamApiFunc;
