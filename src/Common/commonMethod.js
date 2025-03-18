import axios from "axios";
import {
  backServerIP,
  processServerIP,
  rpaLoginUrl,
  rpaRedirectUrl,
} from "../Common/common";
import { store } from "../store";
import { Actions } from "./constants";
// 轉換 excel 與 csv 用此套件: https://github.com/exceljs/exceljs

export const viewCallback = (el) => (el ? el : "-");

export function exportToCSV(table) {

}
export function exportToExcel(table) {
}

// { id: 'sourceId', label: 'Stock ID', minWidth: 100, viewCallback: (el) => {
// 	if (!el) { return '-' }
// 	return el
// }  },

export const generateTable = (allTableHeaders, tableList) => {
  const columns = allTableHeaders.map((el) => {
    let obj = {};
    obj.name = el.id;
    if (el.id === "excelInstallTime") {
      obj.name = "InstallTime";
    }
    if (el.id === "excelUninstallTime") {
      obj.name = "UninstallTime";
    }
    return obj;
  });

  const rows = [];
  tableList.forEach((el) => {
    let arr = [];

    allTableHeaders.forEach((e) => {
      let value = el[e.id] !== null && el[e.id] !== "" ? el[e.id] : "-";
      arr.push(value);
    });

    rows.push(arr);
  });

  const table = {
    name: "ExportedTable",
    ref: "A1",
    headerRow: true,
    columns: columns,
    rows: rows,
  };
  return table;
};
export const generateTable2 = (allTableHeaders, tableList) => {
  const columns = allTableHeaders.map((el) => {
    let obj = {};
    obj.name = el.label;
    return obj;
  });

  const rows = [];
  if (tableList.length > 0) {
    tableList.forEach((el) => {
      let arr = [];

      allTableHeaders.forEach((e) => {
        let value = !!el[e.id] ? el[e.id] : "-";
        if (el[e.id] === 0) {
          value = 0;
        }
        if (el[e.id] === false) {
          value = false;
        }
        arr.push(value);
      });

      rows.push(arr);
    });
  } else {
    let arr = [];

    allTableHeaders.forEach((e) => {
      let value = "";
      arr.push(value);
    });

    rows.push(arr);
  }

  const table = {
    name: "ExportedTable",
    ref: "A1",
    headerRow: true,
    columns: columns,
    rows: rows,
  };
  return table;
};
export const getQueryString = (search, name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  } else {
    return "";
  }
};

let axiosInstance = axios.create();
axiosInstance.interceptors.request.use((res) => {
  res.headers["Authorization"] = `Bearer ${store.getState().user.token}`;
  return res;
});
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    store.dispatch({ type: Actions.SET_IS_LOADING, payload: false });
    console.log(err);
    if (err.response.status) {
      if (err.response.status >= 500) {
        window.open(rpaRedirectUrl + "/500", "_self");
      } else {
        switch (err.response.status) {
          case 404:
            // window.open(rpaRedirectUrl + '/404', '_self')
            console.log("404 interceptor handle");
            break;
          case 403:
            window.open(rpaRedirectUrl + "/403", "_self");
            console.log("403 interceptor handle");
            break;
          case 401:
            window.open(
              `${rpaLoginUrl}${rpaRedirectUrl}`,
              "_self"
            );
            break;
          default:
            console.log("default iterceptor handle");
        }
      }
    }
    return Promise.resolve(err);
  }
);

export { axiosInstance as axios };

let callAxios = (method, url, config = {}, data = null, isProcess = false) => {
  url = isProcess ? processServerIP + url : backServerIP + url;

  switch (method) {
    case "POST":
      return axiosInstance.post(url, data, config);
    case "GET":
      return axiosInstance.get(url, { params: data, ...config });
    case "DELETE":
      return axiosInstance.delete(url, { params: data, ...config });
    case "PUT":
      return axiosInstance.put(url, data, config);
    case "PATCH":
      return axiosInstance.patch(url, data, config);
    default:
      console.log(`Can't read method: ${method}`);
      return false;
  }
};
export default callAxios;

export const CallApiFunc = (
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

export const convertTimeFormat = (dateTimeString) => {
  let eventCreateTime = new Date(dateTimeString);
  let date =
    eventCreateTime.getFullYear() +
    "-" +
    ("00" + (eventCreateTime.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + eventCreateTime.getDate()).slice(-2) +
    " " +
    ("00" + eventCreateTime.getHours()).slice(-2) +
    ":" +
    ("00" + eventCreateTime.getMinutes()).slice(-2) +
    ":" +
    ("00" + eventCreateTime.getSeconds()).slice(-2);
  return date;
};

export const isMobile = () => {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    ) {
      check = true;
    }
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

export const toDefaultString = (v, d) => {
  if (typeof v === "undefined" || v === null) {
    if (d) {
      return d;
    } else {
      return "";
    }
  }
  return v;
};

// check for required inputs upon submission, set error message display, and return a boolean value
export const checkRequiredInputsAreEmptyOrNot = (data, setError) => {
  let isUnverified = false;
  setError((preError) => {
    const result = Object.entries(preError).reduce((prev, [name]) => {
      const value = data[name];
      let empty = false;
      switch (typeof value) {
        case "string":
        case "number":
          empty = !value.toString();
          break;
        case "object":
          empty = Object.keys(value)?.length === 0;
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

// update object data
export const handleDataChange = (event, setData) => {
  const { name, type, checked, value } = event?.target;
  setData((prev) => ({
    ...prev,
    [name]: type?.includes("checkbox") ? checked : value,
  }));
};
