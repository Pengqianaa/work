import axios from "axios";
import { smartItDbWebApi, samLoginUrl, samredirectUrl } from "../Common/common";
import { store } from "../store";
import { Actions } from "./constants";

const SMART_IT_TOKEN = process.env.REACT_APP_SMART_IT_TOKEN;

let axiosInstance = axios.create();
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err.response?.status) {
      if (
        err.response.status >= 500 &&
        !err.config.url.includes("GetSystemsbyLastLoggedOnUserAsync")
      ) {
        window.open(samredirectUrl + "/500", "_self");
      } else {
        switch (err.response.status) {
          case 404:
            console.log("404 interceptor handle");
            store.dispatch({
              type: Actions.SHOW_SNACKBAR_MESSAGE,
              payload: {
                show: true,
                props: {
                  message: "404 interceptor handle",
                  msgType: "error",
                  autoHideDuration: null,
                },
              },
            });
            break;
          case 401:
            console.log("401 interceptor handle");
            // window.open(samLoginUrl + '?relayState=' + samredirectUrl + '/isLogin', '_self')
            store.dispatch({
              type: Actions.SHOW_SNACKBAR_MESSAGE,
              payload: {
                show: true,
                props: {
                  message: "401 interceptor handle",
                  msgType: "error",
                  autoHideDuration: null,
                },
              },
            });
            break;
          case 400:
            console.warn(err.response);
            // store.dispatch({
            // 	type: Actions.SHOW_ALERT_MESSAGE,
            // 	payload: {
            // 		show: true,
            // 		props: {
            // 			title: err.response.statusText,
            // 			message: err.response.data.Message,
            // 			hasCancel: false,
            // 			callback: () => null
            // 		}
            // 	}
            // })
            store.dispatch({
              type: Actions.SHOW_SNACKBAR_MESSAGE,
              payload: {
                show: true,
                props: {
                  message: err.response.data.Message,
                  msgType: "error",
                  autoHideDuration: null,
                },
              },
            });
            break;
          default:
            console.log("default iterceptor handle");
        }
      }
    }

    store.dispatch({ type: Actions.SET_IS_LOADING, payload: false });
    return Promise.resolve(err);
  }
);

let callAxios = (method, url, config, data = null) => {
  let callUrl = `${smartItDbWebApi}${url}`;

  if (
    !config.headers ||
    typeof config.headers["Authorization"] === "undefined" ||
    config.headers["Authorization"] === ""
  ) {
    config = {
      ...config,
      headers: {
        Authorization: `Basic ${SMART_IT_TOKEN}`,
      },
    };
  }

  switch (method) {
    case "POST":
      return axiosInstance.post(callUrl, data, {
        ...config,
        withCredentials: false,
      });
    case "GET":
      return axiosInstance.get(callUrl, {
        params: data,
        ...config,
        withCredentials: false,
      });
    case "DELETE":
      return axiosInstance.delete(
        callUrl,
        { params: data },
        { ...config, withCredentials: false }
      );
    case "PUT":
      return axiosInstance.put(callUrl, data, {
        ...config,
        withCredentials: false,
      });
    case "PATCH":
      return axiosInstance.patch(callUrl, data, {
        ...config,
        withCredentials: false,
      });
    default:
      console.log(`Can't read method: ${method}`);
      return false;
  }
};

export const CallSmartIt = (method, url, config, data = null) => {
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
          console.info(error);
          resolve(error);
        })
    );
};
