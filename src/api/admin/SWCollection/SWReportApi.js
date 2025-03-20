import CallSamApiFunc from "src/utils/methods/CallSamApiFunc";
import { ALL, METHOD_TYPE } from "src/constants/common";
const url = "/swcollection";

const getSwReportList = ({
    year,
    bg = "",
    bu = "",
    costCenter = "",
    brand,
    productName,
    keyword,
    pageNum,
    pageSize,
    userFlag,
  }) => {
    const _bg = bg === ALL ? "" : bg;
    const _bu = bu === ALL ? "" : bu;
    const _brand = brand === ALL ? "" : brand;
    const _productName = productName === ALL ? "" : productName;
    return CallSamApiFunc(
      "GET",
      "/swcollection/report",
      {},
      {
        year,
        bg: _bg,
        bu: _bu,
        costCenter,
        brand:_brand,
        productName:_productName,
        pageNum,
        pageSize,
        userFlag,
        keyword,
      }
    );
  };

const getReportDetail = ({
    bgId,
    brandId,
    buId,
    planId,
    productName,
    swCollectionNewSWId,
    costCenter,
    assetId,
  }) => {
    let newId = swCollectionNewSWId;
    let aId = assetId;
    if(assetId.toString().length > 6){
      newId = assetId 
      aId = null
    }
    return CallSamApiFunc(
      "POST",
      "/sw-collection/detail",
      {},
      {
        bgId,
        brandId,
        buId,
        planId,
        productName,
        swCollectionNewSWId :newId,
        costCenterCode: costCenter,
        assetId :aId,
      }
    );
  };

  const lockReport = ({ reportIds }) => {
    return CallSamApiFunc("POST", "/swcollection/report/lock", {}, reportIds);
  };
  const unLockReport = ({ reportIds }) => {
    return CallSamApiFunc("POST", "/swcollection/report/unlock", {}, reportIds);
  };

  const updateQueryOrDownload = ({
    assetId,
    bg,
    brandId,
    bu,
    budgetCount,
    costCenterCode,
    installedCount,
    sourceSystemId,
    swCollectionId,
    differenceCount,
  }) => {
    return CallSamApiFunc(
      "POST",
      "/sw-collection/upsert",
      {},
      {
        assetId,
        bgName:bg,
        brandId,
        buName:bu,
        budgetCount,
        costCenterCode,
        installedCount,
        sourceSystemId,
        swCollectionId,
        differenceCount,
      }
    );
  };

  const deleteQueryOrDownload = ({ swCollectionId }) => {
    return CallSamApiFunc(
      "POST",
      "/sw-collection/delete?swCollectionId=" + swCollectionId,
      {},
      null
    );
  };

  const uploadTemplateExcel = ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);
    return CallSamApiFunc(METHOD_TYPE.POST, `/swcollection/report/template`, {}, formData);
  };

  const downloadTemplateExcel = () => {
    return CallSamApiFunc(METHOD_TYPE.GET, `/swcollection/report/template`, {
      responseType: "blob",
    });
  };

  const uploadQueryOrDownload = ({ file }) => {
    const formData = new FormData();
    formData.append('file', file);
    return CallSamApiFunc(METHOD_TYPE.POST, `/sw-collection/upload`, {}, formData);
  };

  // isExport=true
  const exportSWCollectExcel =({
    year,
    bg = "",
    bu = "",
    costCenter = "",
    brand,
    productName,
    userFlag,
  }) => {
    const _bg = bg === ALL ? "" : bg;
    const _bu = bu === ALL ? "" : bu;
    const _brand = brand === ALL ? "" : brand;
    const _productName = productName === ALL ? "" : productName;
    return CallSamApiFunc(
      "GET",
      "/swcollection/report",
      {
        responseType: 'blob',
      },
      {
        year,
        bg: _bg,
        bu: _bu,
        costCenter,
        brand:_brand,
        productName:_productName,
        userFlag,
        isExport:true,
      }
    );
  };

export default {
  getSwReportList,
  getReportDetail,
  lockReport,
  unLockReport,
  updateQueryOrDownload,
  deleteQueryOrDownload,
  uploadTemplateExcel,
  downloadTemplateExcel,
  uploadQueryOrDownload,
  exportSWCollectExcel,
};
