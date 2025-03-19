import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useIntl, FormattedMessage } from "react-intl";
import "../../../CSS/common.scss";
import styled from "styled-components";
import { Actions } from "../../../Common/constants";
import { Grid, MenuItem } from "@mui/material";
import StockIdQueryMui from "./StockIdQueryMui2";
import ModalContainer from "../uiComponents/ModalContainer";
import {
  TextFieldControl,
  SelectorControl,
} from "../uiComponents/FormControls";
import { Buttons, BUTTON_TYPES } from "../../common/index";

import { checkRequiredInputsAreEmptyOrNot } from "src/Common/commonMethod";
const INIT_SHOW_ERROR_MSGS = {
  StockID: false,
  RegionArea: false,
};

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

const EditSCCMInfo = ({
  show,
  item,
  toggleFunc,
  updateSCCMInfo,
  createSCCMInfo,
  areaList,
  setCatId,
}) => {
  const [selectedValue, setSelectedValue] = useState(null); // Selected Autocomplete value
  const [inputText, setInputText] = useState(""); // Autocomplete input text
  const [mode, setMode] = useState(false);
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState(5);
  const [error, setError] = useState(INIT_SHOW_ERROR_MSGS);
  const CategoryList = [{ cateId: 5, text: "Commercial" }, { cateId: 3, text: "Freeware" }];
  const handleClear = () => {
    setSelectedValue(null);
    setInputText("");
  };
  const handleAreaChange = (e) => {
    setArea(e.target.value);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handlePathChange = (e) => {
    setPath(e.target.value);
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
        setName("");
        setPath("");
        setArea("");
        setSelectedValue(null);
        setInputText("");
        setCategory(5);
        setMode(true);
      } else {
        let { SCCMName, SCCMFolderPath } = item;

        setName(SCCMName);
        setPath(SCCMFolderPath);
        setCategory("");
        setMode(false);
      }
    }
  }, [show]);

  const intl = useIntl();

  const handleSubmit = () => {
    const isEdit = !!Object.keys(item)?.length;
    const verifyParams = isEdit
      ? item
      : {
        RegionArea: area,
        StockID: selectedValue?.stockId ?? "",
      };

    if (checkRequiredInputsAreEmptyOrNot(verifyParams, setError)) {
      return;
    }

    const fn = isEdit ? updateSCCMInfo : createSCCMInfo;
    fn(verifyParams, name, path);
    toggleFunc(false);
  };

  return (
    <ModalContainer
      open={show}
      setOpen={() => {
        toggleFunc(false);
      }}
      title={intl.formatMessage({ id: "softwareinfomgt.modal2" })}
      buttons={<Buttons type={BUTTON_TYPES.SAVE} onClick={handleSubmit} />}
    >
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
            error={error.RegionArea}
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
            <SoftwareName>{item.softwareName}</SoftwareName>
            <ItemInfo>
              {`${intl.formatMessage({
                id: "softwareinfomgt.stockId",
              })} ${item.StockID}`}
            </ItemInfo>
            <ItemInfo>
              {`${intl.formatMessage({
                id: "softwareinfomgt.productName",
              })} ${item.ProductName}`}
            </ItemInfo>
            <ItemInfo>
              {`${intl.formatMessage({
                id: "adminCommon.category",
              })}: ${item.Category ?? 'Commercial'}`}
            </ItemInfo>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </>
      )}
      <TextFieldControl
        onChange={handleNameChange}
        value={name}
        label={intl.formatMessage({ id: "softwareinfomgt.SCCMName" })}
      />
      <TextFieldControl
        multiline
        onChange={handlePathChange}
        value={path}
        label={intl.formatMessage({ id: "softwareinfomgt.SCCMFolderPath" })}
      />
    </ModalContainer>
  );
};

const mapStateToProps = (state) => ({
  areaList: state.query.areaList,
});
const mapDispatchToProps = (dispatch) => ({
  updateSCCMInfo: (item, SCCMName, SCCMFolderPath) =>
    dispatch({
      type: "updateSCCMInfo",
      payload: {
        item,
        SCCMName,
        SCCMFolderPath,
      },
    }),
  createSCCMInfo: (item, SCCMName, SCCMFolderPath) =>
    dispatch({
      type: "createSCCMInfo",
      payload: {
        item,
        SCCMName,
        SCCMFolderPath,
      },
    }),
  setCatId: (value) =>
    dispatch({
      type: "setStockQueryByCatId",
      payload: { catId: value },
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

export default connect(mapStateToProps, mapDispatchToProps)(EditSCCMInfo);
