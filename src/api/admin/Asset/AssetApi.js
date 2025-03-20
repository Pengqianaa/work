import CallSamApiFunc from "src/utils/methods/CallSamApiFunc";
import { METHOD_TYPE } from "src/constants/common";
const url = "/freeware";

const getReasonList = ({
    listTypeCode,
    language
  }) => {
    return CallSamApiFunc(
      METHOD_TYPE.GET,
      `/${url}/reason?listTypeCode=${listTypeCode}&language=${language}`,
      {},
      {}
    );
  };

export default {
  getReasonList,
};
