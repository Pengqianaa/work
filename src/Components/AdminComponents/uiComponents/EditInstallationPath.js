import React, { useEffect, useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import { useIntl, FormattedMessage } from "react-intl";
import { CButton, CRow, CCol } from "@coreui/react";
import { Actions } from "../../../Common/constants";
import { Grid, MenuItem } from "@mui/material";
import ModalContainer from "../uiComponents/ModalContainer";
import {
  TextFieldControl,
  SelectorControl,
} from "../uiComponents/FormControls";
import { Buttons, BUTTON_TYPES } from "../../common/index";

import StockIdQueryMui from "./StockIdQueryMui2";
import { checkRequiredInputsAreEmptyOrNot } from "src/Common/commonMethod";
import "../../../CSS/common.scss";
import styled from "styled-components";

const INIT_SHOW_ERROR_MSGS = {
  areaId: false,
  assetId: false,
};

const ProfileClose = styled(CButton)`
  color: #00a0e9;
  font-weight: bold;
`;

const CartItem = styled(CRow)`
  margin: 0 10px;
`;
const ItemCol = styled(CCol)`
  padding: 10px;
`;

const ItemInfo = styled.p`
  font-size: 12px;
  margin: 4px 8px 4px 8px;
  width: 100%;
  overflow-wrap: break-word;
`;

const SoftwareName = styled.p`
  font-weight: bold;
  margin: 4px 8px 4px 8px;
`;

const Divider = styled.div`
  width: 100%;
  border-top: 1px solid;
  border-color: #c4c9d0;
`;

const EditInstallationPath = ({
  show,
  item,
  toggleFunc,
  updateInstallationPath,
  createInstallationPath,
  areaList,
  setShowAlert,
  setCatId,
  clearStockIdList,
}) => {
  const [selectedValue, setSelectedValue] = useState(null); // Selected Autocomplete value
  const [inputText, setInputText] = useState(""); // Autocomplete input text
  const [mode, setMode] = useState(false);
  const [method, setMethod] = useState("");
  const [path, setPath] = useState("");
  const [area, setArea] = useState("");
  const [sn, setSn] = useState("");
  const [category, setCategory] = useState(5);
  const [categoryText, setCategoryText] = useState('Commercial');
  const [info, setInfo] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState(INIT_SHOW_ERROR_MSGS);
  const CategoryList = [{ cateId: 5, text: "Commercial" }, { cateId: 3, text: "Freeware" }];
  const dispatch = useDispatch();
  // Handler to clear values
    const handleClear = () => {
      setSelectedValue(null);
      setInputText("");
  };
  const handleAreaChange = (e) => {
    setArea(e.target.value);
  };
  const handleMethodChange = (e) => {
    setMethod(e.target.value);
  };
  const handlePathChange = (e) => {
    setPath(e.target.value);
  };
  const handleSnChange = (e) => {
    setSn(e.target.value);
  };
  const handleCategoryChange = (e) => {
    let value = e.target.value
    setCatId(value)
    setCategory(value);
    handleClear();
  };

  useEffect(() => {
    if (show) {
      if (item && Object.keys(item).length === 0) {
        setMethod("");
        setPath("");
        setSn("");
        setArea("");
        setKeyword("");
        setCategory("5");
        setMode(true);
      } else {
        let { installationMethod, installationPath, licensesSn, categoryId } = item;

        setMethod(installationMethod);
        setPath(installationPath);
        setSn(licensesSn);
        setCategory(categoryId);
        setMode(false);
      }
    }
  }, [show]);

  useEffect(() => {
    let categoryItem = CategoryList.filter(arrItem => arrItem.cateId === category)
    if (categoryItem.length > 0) {
      setCategoryText(categoryItem[0].text)
    }
  }, [category]);

  const intl = useIntl();

  const handleSubmit = () => {
    const isEdit = !!Object.keys(item)?.length;
    const verifyParams = isEdit
      ? item
      : {
        areaId: area,
        // assetId: info?.assetId ?? "",
        assetId:selectedValue?.assetId ?? "",
        category: category,
      };

    if (checkRequiredInputsAreEmptyOrNot(verifyParams, setError)) {
      return;
    }
    const fn = isEdit ? updateInstallationPath : createInstallationPath;
    fn(verifyParams, method, path, sn, category);
    toggleFunc(false);
  };

  return (
    <ModalContainer
      open={show}
      setOpen={() => {
        toggleFunc(false);
      }}
      title={intl.formatMessage({ id: "softwareinfomgt.modal4" })}
      buttons={<Buttons type={BUTTON_TYPES.SAVE} onClick={handleSubmit} />}
    >
      {/* {!mode && (
        <ItemCol lg="12">
          <ItemInfo>{`${intl.formatMessage({
            id: "softwareinfomgt.areaName",
          })}${item.areaName}`}</ItemInfo>
          <ItemInfo>{`${intl.formatMessage({
            id: "softwareinfomgt.stockId",
          })}${item.stockId ? item.stockId : "-"}`}</ItemInfo>
          <ItemInfo>{`${intl.formatMessage({
            id: "softwareinfomgt.brandName",
          })}${item.brandName}`}</ItemInfo>
          <ItemInfo>{`${intl.formatMessage({
            id: "softwareinfomgt.productName",
          })}${item.productName ? item.productName : "-"}`}</ItemInfo>
        </ItemCol>
      )} */}
      {mode ? (
        <>
          <SelectorControl
            label={intl.formatMessage({ id: "adminCommon.category" })}
            value={category}
            error={false}
            onChange={handleCategoryChange}
            required
          >
            {CategoryList.map((el, index) => {
              return (
                <MenuItem key={index} value={el.cateId}>
                  <FormattedMessage id={`main.${el.text}`} />
                </MenuItem>
              );
            })}
          </SelectorControl>
          <StockIdQueryMui
            value={selectedValue}
            inputValue={inputText}
            setValue={setSelectedValue}
            setInputValue={setInputText}
            intl={intl}
            error={error.assetId}
            message={intl.formatMessage({
              id: "softwareinfomgt.errorMsg.common.StockID",
            })}
            required
          />
          <SelectorControl
            label={intl.formatMessage({ id: "adminCommon.area" })}
            value={area}
            error={error.areaId}
            message={intl.formatMessage({
              id: "softwareinfomgt.errorMsg.common.RegionArea",
            })}
            onChange={handleAreaChange}
            required
          >
            {areaList.map((el) => {
              return (
                <MenuItem key={el.id} value={el.id}>
                  {el.areaEname}
                </MenuItem>
              );
            })}
          </SelectorControl>
        </>
      ) : (
        <>
          <Grid item lg={12}>
            <ItemInfo>
              {`${intl.formatMessage({
                id: "softwareinfomgt.category",
              })}${categoryText}`}
            </ItemInfo>
            <ItemInfo>
              {`${intl.formatMessage({
                id: "softwareinfomgt.regionArea",
              })}${item.areaName}`}
            </ItemInfo>
            <ItemInfo>
              {`${intl.formatMessage({
                id: "softwareinfomgt.stockId",
              })}${item.stockId ? item.stockId : "-"}`}
            </ItemInfo>
            <ItemInfo>
              {`${intl.formatMessage({
                id: "softwareinfomgt.brand",
              })}${item.brandName}`}
            </ItemInfo>
            <ItemInfo>
              {`${intl.formatMessage({
                id: "softwareinfomgt.productName",
              })}${item.productName ? item.productName : "-"}`}
            </ItemInfo>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </>
      )}
      <TextFieldControl
        multiline
        onChange={handlePathChange}
        value={path}
        label={intl.formatMessage({
          id: "softwareinfomgt.installationPath",
        })}
      />
      <TextFieldControl
        multiline
        onChange={handleMethodChange}
        value={method}
        label={intl.formatMessage({
          id: "softwareinfomgt.installationMethod",
        })}
      />
      <TextFieldControl
        onChange={handleSnChange}
        value={sn}
        label={intl.formatMessage({ id: "softwareinfomgt.licensesSn" })}
      />
    </ModalContainer>
  );
};

const mapStateToProps = (state) => ({
  areaList: state.query.areaList,
});
const mapDispatchToProps = (dispatch) => ({
  updateInstallationPath: (
    item,
    installationMethod,
    installationPath,
    licensesSn,
    category,
  ) =>
    dispatch({
      type: "updateInstallationPath",
      payload: {
        item,
        installationMethod,
        installationPath,
        licensesSn,
        category,
      },
    }),
  createInstallationPath: (
    item,
    installationMethod,
    installationPath,
    licensesSn,
    category,
  ) =>
    dispatch({
      type: "createInstallationPath",
      payload: {
        item,
        installationMethod,
        installationPath,
        licensesSn,
        category,
      },
    }),
  setCatId: (value) =>
    dispatch({
      type: "setStockQueryByCatId",
      payload: { catId: value },
    }),
  clearStockIdList: () =>
    dispatch({
      type: Actions.SET_STOCK_ID_LIST,
      payload: [],
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditInstallationPath);
