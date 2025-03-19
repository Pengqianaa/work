import CallSamApiFunc from "src/utils/methods/CallSamApiFunc";
import { METHOD_TYPE } from "src/constants/common";

const url = "/freeware";

const getFreewareReason = ({ listTypeCode, language, typeCause }) => {
  return CallSamApiFunc(
    METHOD_TYPE.GET,
    `${url}/reason`,
    {},
    { listTypeCode, language, typeCause }
  );
};

export default {
  getFreewareReason,
};
