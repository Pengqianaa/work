import CallSamApiFunc from "src/utils/methods/CallSamApiFunc";
import { ALL, METHOD_TYPE } from "src/constants/common";
const url = "/swcollection";

const exportAuthorityMgtExcel = (pageSize) =>
  CallSamApiFunc(
    METHOD_TYPE.GET,
    `${url}/authority`,
    {
      responseType: "blob",
    },
    pageSize
  );

  const downloadAuthMgtExcelTemplate = () => {
    return CallSamApiFunc(METHOD_TYPE.GET, `${url}/auth/template`, {
      responseType: "blob",
    });
  };

  const uploadSwAuthorityMgtExcel = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return CallSamApiFunc(
      "POST",
      "/swcollection/authority/import/excel",
      {},
      formData
    );
  };

export default {
  exportAuthorityMgtExcel,
  downloadAuthMgtExcelTemplate,
  uploadSwAuthorityMgtExcel,
};
