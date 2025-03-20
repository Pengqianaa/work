import moment from "moment";
import CallSamApiFunc from "src/utils/methods/CallSamApiFunc";
import { METHOD_TYPE } from "src/constants/common";
import { DEFAULT_SORT_COL } from "src/constants/admin/SWCollectionMgt";
const url = "/rate";

const getRateMgtList = ({
  keyword = "",
  // keyword = moment().format('YYYY'),
  pageNumber = 1,
  pageSize = 10,
  sort = `${DEFAULT_SORT_COL.RATE_MGT},asc`,
}) =>
  CallSamApiFunc(
    METHOD_TYPE.GET,
    `${url}/getRateList`,
    {},
    {
      keyword,
      pageNumber,
      pageSize,
      sort,
      ["un-page"]: false,
    }
  );

const updateRateMgt = ({ rateId, fromCurrency, toCurrency, rate }) =>
  CallSamApiFunc(
    METHOD_TYPE.POST,
    `${url}/updateRate`,
    {},
    {
      rateId,
      fromCurrency,
      toCurrency,
      rate,
    }
  );

const deleteRateMgt = (id = "") =>
  CallSamApiFunc(METHOD_TYPE.DELETE, `${url}/deleteRate?rateId=${id}`, {});

export default { getRateMgtList, updateRateMgt, deleteRateMgt };
