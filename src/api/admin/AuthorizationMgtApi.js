import CallSamApiFunc from "src/utils/methods/CallSamApiFunc";
import { METHOD_TYPE, MODIFY_ACTION_TYPE } from "src/constants/common";
import { DEFAULT_SORT_COL } from "src/constants/admin/AuthorizationMgt";

const url = "/dataAuthority";

const getAuthorizationMgtList = ({
  keyword = "",
  pageNumber = 1,
  pageSize = 10,
  sort = `${DEFAULT_SORT_COL},asc`,
}) =>
  CallSamApiFunc(
    METHOD_TYPE.GET,
    `${url}/list`,
    {},
    {
      keyword,
      pageNumber,
      pageSize,
      sort,
      ["un-page"]: false,
    }
  );

const getAuthorizationMgt = (id = "") =>
  CallSamApiFunc(METHOD_TYPE.GET, `${url}/${id}`, {}, null);

const modifyAuthorizationMgt = ({
  action = MODIFY_ACTION_TYPE.ADD,
  data = {
    userId: 0,
    empCode: null,
    areaIds: [],
    bgIds: [],
    buIds: [],
    costCenters: [],
    brandIds: [],
  },
}) =>
  CallSamApiFunc(
    METHOD_TYPE.POST,
    `${url}/${action === MODIFY_ACTION_TYPE.ADD ? "add" : "update"}`,
    {},
    data
  );

const deleteAuthorizationMgt = (id = "") =>
  CallSamApiFunc(METHOD_TYPE.POST, `${url}/${id}`, {}, null);

export default {
  getAuthorizationMgtList,
  getAuthorizationMgt,
  modifyAuthorizationMgt,
  deleteAuthorizationMgt,
};
