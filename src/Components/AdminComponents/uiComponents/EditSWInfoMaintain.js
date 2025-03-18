import React, { useEffect, useState } from "react";
import { connect, useSelector, useDispatch  } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { CCol } from "@coreui/react";
import AddIcon from "@mui/icons-material/Add";
import {
  Grid,
  Checkbox,
  Chip,
  TextField,
  Radio,
  RadioGroup,
  InputLabel,
  MenuItem,
  Switch,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { AddButton,FilterContainer, FilterGroup, AddBrandButton } from "./AdminCommonUis";
import SWStockQuery from "./SWStockQuery";
import ModalContainer from "../uiComponents/ModalContainer";
import {
  TextFieldControl,
  SelectorControl,
} from "../uiComponents/FormControls";
import { Buttons, BUTTON_TYPES } from "../../common/index";
import "../../../CSS/common.scss";
import styled from "styled-components";
import { Actions } from "../../../Common/constants";
import { ACTIONS } from "src/Reducers/admin/SWCollectionMgt/SWInfoMaintainReducer";
import { ACTIONS as  RateMgtReducerACTIONS} from "src/Reducers/admin/SWCollectionMgt/RateMgtReducer";
import {
  handleDataChange,
} from "src/Common/commonMethod";
const SelectedChip = styled(Chip)`
  margin-left: 4px;
`;

const ItemCol = styled(CCol)`
  padding: 10px;
`;
const EditSWInfoMaintain = (props) => {
  let {
    show,
    item,
    toggleFunc,
    setShowAlert,
    updateSWSoftwareInfo,
    swAssetList,
    getAsset,
  } = props;
  const dispatch = useDispatch();
  const [type, setType] = useState("newSW");
  const [souceSystemId, setSouceSystemId] = useState(1);
  const [oldBrand, setOldBrand] = useState("");
  const [oldProduct, setOldProduct] = useState([]);
  const [brand, setBrand] = useState("");
  const [swCollectionBrandId, setSwCollectionBrandId] = useState("");
  const [productName, setProductName] = useState("");
  const [refPrice, setRefPrice] = useState("");
  const [refCurrency, setRefCurrency] = useState("");
  const [rateItem, setRateItem] = useState([]);
  const [exchangeRate, setExchangeRate] = useState("");
  const [mainFlag, setMainFlag] = useState(1);
  const [subMainFlag, setSubMainFlag] = useState([]);
  const [status, setStatus] = useState(true);
  const [newSWDisabled, setNewSWDisabled] = useState(false);
  const [nonSWDisabled, setNonSWDisabled] = useState(false);
  const [isSystem, setIsSystem] = useState(false);
  const [error, setError] = useState(false);
  const [isAddBrand, setIsAddBrand] = useState(false);
  const [newBrandError, setNewBrandError] = useState(false);
  const [newBrand, setNewBrand] = useState("");

  const swNewBrandList = useSelector(
    (state) => state.SWInfoMaintain.brandList
  );

  const rateList = useSelector((state) => state.SWRateMgt.list);
  const getRateMgtList = () => {
    dispatch({
      type: RateMgtReducerACTIONS.GET_RATE_MGT_LIST,
      payload: {
        pageNumber: 1,
      },
    });
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  const handleOldBrandChange = (e) => {
    setOldBrand(e.target.value);
    getAsset(e.target.value);
  };

  const handleOldProductNameChange = (e) => {
    setOldProduct(e.target.value);
  };

  const handleBrandChange = (e) => {
    let brandId = e.target.value
    let swCollectionBrandId = null
    if(brandId.toString().length > 6){
      let selectOption = swNewBrandList.find(option => option.brandId === brandId);
      swCollectionBrandId = selectOption.swCollectionBrandId
    }
    setBrand(brandId);
    setSwCollectionBrandId(swCollectionBrandId)
  };

  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  const handleRefPriceChange = (event) => {
    let price = event.target.value;
    setRefPrice(price);
    if (refCurrency) {
      setExchangeRate(`${rateItem[0].rate * price} ${rateItem[0].toCurrency}`);
    }
  };

  const handleRefCurrencyChange = (event) => {
    let rate = rateList.filter((item) => {
      return item.fromCurrency === event.target.value;
    });
    if (rate.length === 0) {
      setShowAlert({
        title: "Warning",
        message: "請先設置相關匯率",
        hasCancel: false,
        callback: () => {},
      });
      return;
    }
    setRateItem(rate);
    setExchangeRate(`${rate[0].rate * refPrice} ${rate[0].toCurrency}`);
    setRefCurrency(event.target.value);
  };

  const handleMainFlagChange = (event) => {
    setMainFlag(event.target.value);
  };

  const handleSubMainFlagChange = (value) => {
    let arr = JSON.parse(JSON.stringify(subMainFlag));
    if (value) {
      arr.push(value);
      let newArr = [...new Set(arr.map((t) => JSON.stringify(t)))].map((s) =>
        JSON.parse(s)
      );
      arr = [...newArr];
    } else {
      if (value !== null) {
        let newSet = [...new Set(arr.map((t) => JSON.stringify(t)))].map((s) =>
          JSON.parse(s)
        );
        newSet.delete(value);
        arr = [...newSet];
      }
    }
    setSubMainFlag(arr);
  };

  const handleChange = (event) => {
    setStatus(event.target.checked);
  };

  const handleAddBrandChange = (e) => {
    const { name, value } = e.target;
    if (name === "newBrand") {
      setNewBrandError(false);
      setNewBrand(value);
    } else {
      if (name === "listType" && value === 3) {
        handleDataChange({ target: { value: false, name: "valid" } }, setData);
      }
      handleDataChange(e, setData);
    }
  };

  const handleAddBrand = (e) => {
    if (!newBrand) {
      setNewBrandError(true);
    } else {
      dispatch({
        type: ACTIONS.ADD_SW_BRAND,
        payload: { brandName:newBrand },
      });
    }
  };

  useEffect(() => {
    getRateMgtList();
    // getRateList(new Date().getFullYear());
    getNewSWBrandList();
    if (show) {
      initInput(item);
    }
  }, [show]);

  const intl = useIntl();

  const handleSubmit = () => {
    let mainSoftDetail = [];
    let oldSoftDetail = [];

    if (!productName) {
      setError(true);
      return;
    }

    if (mainFlag) {
      mainSoftDetail = [];
    } else {
      subMainFlag.forEach((item) => {
        let assetId = item.assetId ? item.assetId : item.assetDto.assetId;
        let souceSystemId = item.sourceSystemId
          ? item.sourceSystemId
          : item.assetDto.sourceSystemId;
        mainSoftDetail.push({ assetId: assetId, souceSystemId: souceSystemId });
      });
    }
    if (oldProduct !== null && oldProduct.length > 0) {
      oldProduct.forEach((oldProd) => {
        oldSoftDetail.push({
          assetId: oldProd.assetId,
          souceSystemId: oldProd.sourceSystemId,
        });
      });
    }
    if (item && Object.keys(item).length === 0) {
      updateSWSoftwareInfo({
        assetId: 1,
        brandId: brand,
        swCollectionBrandId:swCollectionBrandId,
        mainFlag: mainFlag,
        mainSoftDetail,
        oldSoftDetail,
        productName: productName,
        referenceCurrency: refCurrency,
        referencePrice: refPrice,
        type: "create",
        status: status,
      });
      toggleFunc(false, true);
    } else {
      let swCollectionNewSWId = null;
      let currentAssetId = null;
      if (item.source === "system") {
        currentAssetId = item.id.assetId;
      } else {
        swCollectionNewSWId = item.id.assetId;
      }
      updateSWSoftwareInfo({
        assetId: currentAssetId,
        brandId: brand,
        swCollectionBrandId:swCollectionBrandId,
        code: item.id.code,
        mainFlag: mainFlag,
        mainSoftDetail,
        oldSoftDetail,
        productName: productName,
        referenceCurrency: refCurrency,
        referencePrice: refPrice,
        type: "update",
        status: status,
        swCollectionNewSWId: swCollectionNewSWId,
      });
      toggleFunc(false, true);
    }
  };

  const initInput = (obj) => {
    setType("newSW");
    setNewSWDisabled(false);
    setNonSWDisabled(false);
    setIsSystem(false);
    if (obj && Object.keys(obj).length === 0) {
      setOldBrand("");
      setOldProduct([]);
      setBrand("");
      setProductName("");
      setRefPrice("");
      setRefCurrency("");
      setExchangeRate("");
      setMainFlag(1);
      setSubMainFlag([]);
      setStatus(true);
    } else {
      let {
        brandId,
        swCollectionBrandId,
        assetName,
        referencePriceTWD,
        referencePriceUSD,
        mainFlag,
        mainFlagList,
        status,
        oldProduct,
        source,
      } = obj;
      if (oldProduct) {
        let oldProductJson = JSON.parse(oldProduct);
        if (oldProductJson !== null && oldProductJson.length > 0) {
          let oldBrandId = oldProductJson[0].oldBrandId;
          setOldBrand(oldBrandId);
          getAsset(oldBrandId);
          setType("nonStaticList");
          setNewSWDisabled(true);
          setOldProduct(oldProductJson);
        } else {
          setNonSWDisabled(true);
        }
      }
      if (mainFlagList) {
        let mainFlagListJson = JSON.parse(mainFlagList);
        if (mainFlagListJson !== null && mainFlagListJson.length > 0) {
          setSubMainFlag(mainFlagListJson);
        }
      }
      let rate = rateList.filter((ra) => {
        return ra.fromCurrency === "TWD";
      });
      if (rate.length === 0) {
        setShowAlert({
          title: "Warning",
          message: "請先設置相關匯率",
          hasCancel: false,
          callback: () => {},
        });
        return;
      }
      if (source === "system") {
        setIsSystem(true);
      }
      setRateItem(rate ? rate : "");
      if(!brandId){
        let filterArr = swNewBrandList.filter(newBrand =>{return swCollectionBrandId===newBrand.swCollectionBrandId})
        if(filterArr.length >0){
          brandId = filterArr[0].brandId
        }
      }
      setBrand(brandId ? brandId : "");
      setProductName(assetName ? assetName : "");
      setRefPrice(referencePriceTWD ? referencePriceTWD : "");
      setRefCurrency("TWD");
      setExchangeRate(referencePriceUSD ? referencePriceUSD : "");
      setMainFlag(mainFlag ? 1 : 0);
      setStatus(status);
    }
  };

  const getNewSWBrandList = () =>
    dispatch({
      type: ACTIONS.GET_BRAND_LIST,
    })

  return (
    <ModalContainer
      open={show}
      setOpen={() => {
        toggleFunc(false, false);
      }}
      title="UpDate SWInfo"
      buttons={<Buttons type={BUTTON_TYPES.SAVE} onClick={handleSubmit} />}
    >
      {(
        <Grid item xs={12}>
          <FormLabel required component="legend">
            Type
          </FormLabel>
          <RadioGroup
            row
            aria-label="position"
            name="type"
            value={type}
            onChange={handleTypeChange}
          >
            <FormControlLabel
              value="newSW"
              control={<Radio color="primary" />}
              label="全新軟體"
              disabled={newSWDisabled}
            />
            <FormControlLabel
              value="nonStaticList"
              disabled={nonSWDisabled}
              control={<Radio color="primary" />}
              label="變動清單"
            />
          </RadioGroup>
        </Grid>
      )}
      {type === "nonStaticList" && (
        <>
          <SelectorControl
            label=" Old_Brand(15Brand)"
            onChange={handleOldBrandChange}
            value={oldBrand}
          >
            {swNewBrandList.map((el) => {
              return (
                <MenuItem key={el.brandId} value={el.brandId}>
                  {el.brandName}
                </MenuItem>
              );
            })}
          </SelectorControl>
          <SelectorControl
            multiple
            label="Old_Product Name"
            onChange={handleOldProductNameChange}
            value={oldProduct}
            renderValue={(selected) => `${selected.length} items selected`}
          >
            {swAssetList.map((el) => {
              return (
                <MenuItem key={el.assetId} value={el}>
                  <Checkbox
                    style={{ color: "#0087DC" }}
                    checked={
                      oldProduct.filter((e) => e.assetId === el.assetId)
                        .length > 0
                    }
                  />
                  {el.productName}
                </MenuItem>
              );
            })}
          </SelectorControl>
          <Grid
            item
            xs={12}
            style={{
              background: "rgb(169 217 169)",
              marginTop: "10px",
              marginLeft: "16px",
            }}
          >
            <InputLabel id="oldProductList-select-label">
              Old_Product List
            </InputLabel>
            <FilterGroup style={{ maxWidth: "95%", flexWrap: "wrap" }}>
              {swAssetList.map((el) => {
                let oldProdList = oldProduct.map((prod) => {
                  return prod.assetId;
                });
                if (!oldProdList.includes(el.assetId)) {
                  return null;
                }
                return (
                  <SelectedChip
                    size="small"
                    key={el.assetId}
                    label={`${el.productName}`}
                    onDelete={() => {
                      setOldProduct([
                        ...oldProduct.filter((e) => e.assetId !== el.assetId),
                      ]);
                    }}
                  />
                );
              })}
            </FilterGroup>
          </Grid>
        </>
      )}
      {type === "newSW" && (
        <>
        <Grid item xs={6}>
            <FilterContainer
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
            <SelectorControl
              disabled={isSystem && type === 'newSW'}
              label="Brand(15Brand)"
              onChange={handleBrandChange}
              value={brand}
            >
              {swNewBrandList.map((el,index) => {
                return (
                  <MenuItem key={el.brandId + index} value={el.brandId}>
                    {el.brandName}
                  </MenuItem>
                );
              })}
            </SelectorControl>
              <AddBrandButton onClick={() => setIsAddBrand(!isAddBrand)}>
                          <AddIcon style={{ color: "#69b969" }} />
              </AddBrandButton>
            </FilterContainer>
          </Grid>
          <Grid item xs={6}>
                  {isAddBrand && (
                    <div style={{ display: "flex", alignItems: " baseline" }}>
                      <TextField
                        variant="standard"
                        name="newBrand"
                        error={newBrandError}
                        onChange={(event) => handleAddBrandChange(event)}
                        label={intl.formatMessage({
                          id: "swassetmgt.freewareTab.brand",
                        })}
                        helperText={newBrandError && "can't be empty"}
                      />
                      <AddButton
                        style={{ marginLeft: "5px" }}
                        onClick={handleAddBrand}
                      >
                        <FormattedMessage id="adminCommon.add" />
                      </AddButton>
                    </div>
                  )}
            </Grid></>)}
      {type === "nonStaticList" && (
      <>
      <Grid item xs={12}>
          <FilterContainer
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
          <SelectorControl
            disabled={isSystem && type === 'newSW'}
            label="Brand(15Brand)"
            onChange={handleBrandChange}
            value={brand}
          >
            {swNewBrandList.map((el,index) => {
              return (
                <MenuItem key={el.brandId+index} value={el.brandId} name={el.brandName}>
                  {el.brandName}
                </MenuItem>
              );
            })}
          </SelectorControl>
          </FilterContainer>
        </Grid>
       </>)}
      <TextFieldControl
        required
        disabled={isSystem && type === 'newSW'}
        multiline
        onChange={handleProductNameChange}
        value={productName}
        label="Product Name"
        error={error}
        message="Product name can't be empty"
      />
      <TextFieldControl
        multiline
        onChange={handleRefPriceChange}
        value={refPrice}
        disabled={isSystem && type === 'newSW'}
        label="Reference price"
      />
      <SelectorControl
        disabled={isSystem && type === 'newSW'}
        label="Reference currency"
        onChange={handleRefCurrencyChange}
        value={refCurrency}
      >
        <MenuItem value={"TWD"}>TWD</MenuItem>
        <MenuItem value={"USD"}>USD</MenuItem>
      </SelectorControl>
      <TextFieldControl
        disabled
        multiline
        value={exchangeRate}
        label="Exchange rate"
      />
      <Grid item xs={12}>
        <SelectorControl
          label="Main Flag"
          onChange={handleMainFlagChange}
          value={mainFlag}
        >
          <MenuItem value={0}>0</MenuItem>
          <MenuItem value={1}>1</MenuItem>
        </SelectorControl>
        {mainFlag !== 1 && (
          <FormControl variant="standard" style={{ width: "100%" }}>
            <SWStockQuery
              setInfo={handleSubMainFlagChange}
              intl={intl}
            />
            <FilterGroup
              style={{ width: "100%", display: "flex", flexWrap: "wrap" }}
            >
              {subMainFlag.map((el) => {
                return (
                  <SelectedChip
                    size="small"
                    key={el.stockId}
                    label={`${el.stockId}`}
                    style={{ margin: "4px" }}
                    onDelete={() => {
                      setSubMainFlag([
                        ...subMainFlag.filter((e) => e.stockId !== el.stockId),
                      ]);
                    }}
                  />
                );
              })}
            </FilterGroup>
          </FormControl>
        )}
        <div style={{ display: "flex", alignItems: "center" }}>
          <ErrorIcon style={{ color: "#FFC107" }} />
          <span style={{ color: "#138496", fontSize: "14px" }}>
            1代表單一主程式;0代表副程式(如果填寫0需選擇關聯的主程式)
          </span>
        </div>
      </Grid>
      <Grid item xs={12}>
        <FormLabel component="legend">Status</FormLabel>
        <FormControlLabel
          control={
            <Switch
              checked={status}
              onChange={handleChange}
              name="checkedB"
              color="primary"
            />
          }
          label="開放"
        />
      </Grid>
    </ModalContainer>
  );
};

const mapStateToProps = (state) => ({
  swAssetList: state.swCollection.swAssetList,
  swStockList: state.swCollection.swStockList,
});
const mapDispatchToProps = (dispatch) => ({
  getAsset: (brandId) =>
    dispatch({
      type: "getSWAssetList",
      payload: { brandId, sourceSystemId: 2 },
    }),
  updateSWSoftwareInfo: ({
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
  }) =>
    dispatch({
      type: "updateSWSoftwareInfo",
      payload: {
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
      },
    }),
  setShowAlert: (props) =>
    dispatch({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props,
      },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditSWInfoMaintain);
