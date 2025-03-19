import CallSamApiFunc from "src/utils/methods/CallSamApiFunc";
import { ALL, METHOD_TYPE } from "src/constants/common";

const addSwBrand = (brandName) =>
  CallSamApiFunc(
    METHOD_TYPE.POST,
    `/sw-collection/brand?brand=${brandName}`,
    {},
    {}
  );

  const getSwBrandList = () =>
    CallSamApiFunc(
      METHOD_TYPE.GET,
      `/sdp/brand`,
      {},
      {}
    );

  const updateSWSoftwareInfo2 = ({
    assetId,
    brandId,
    swCollectionBrandId,
    mainFlag,
    mainSoftDetail,
    oldSoftDetail,
    productName,
    referenceCurrency,
    referencePrice,
    type,
    status,
    swCollectionNewSWId,
  }) => {
    let swBrandId;
    if( brandId === 0 ){
      swBrandId = null
    }
    return CallSamApiFunc(
      "POST",
      "/sdp/update-software-info",
      {},
      {
        assetId,
        brandId,
        swCollectionBrandId:swBrandId,
        mainFlag,
        mainSoftDetail,
        oldSoftDetail,
        productName,
        referenceCurrency,
        referencePrice,
        type,
        status,
        swCollectionNewSWId,
      }
    );
  };
export default {
  addSwBrand,
  getSwBrandList,
  updateSWSoftwareInfo2,
};
