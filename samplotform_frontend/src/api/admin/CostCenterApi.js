import CallSamApiFunc from "src/utils/methods/CallSamApiFunc";
import { METHOD_TYPE } from "src/constants/common";
const url = "/swcollection";

const getAreaList = ({ year }) =>
  CallSamApiFunc(METHOD_TYPE.GET, `/${url}/area/list`, {}, { year });

const getBgBuList = ({ year }) =>
  CallSamApiFunc(METHOD_TYPE.GET, `/${url}/bg-bu/list`, {}, { year });

const getBgBuByCostCenter = (costCenterCode) =>
  CallSamApiFunc(METHOD_TYPE.GET, `/${url}/bg-bu/${costCenterCode}`);

export default { getAreaList, getBgBuList, getBgBuByCostCenter };
