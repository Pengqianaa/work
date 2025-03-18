import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useIntl, FormattedMessage } from "react-intl";
import { Grid, MenuItem } from "@mui/material";
import StockIdQueryMui from "./StockIdQueryMui2";
import ModalContainer from "../uiComponents/ModalContainer";
import {
  TextFieldControl,
  SelectorControl,
} from "../uiComponents/FormControls";
import { Buttons, BUTTON_TYPES } from "../../common/index";
import { checkRequiredInputsAreEmptyOrNot } from "src/Common/commonMethod";
import "../../../CSS/common.scss";
import styled from "styled-components";

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

const EditLicenseInfo = ({ show, item, toggleFunc }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const areaList = useSelector((state) => state.query.areaList);
  const [selectedValue, setSelectedValue] = useState(null); // Selected Autocomplete value
  const [inputText, setInputText] = useState(""); // Autocomplete input text
  const [mode, setMode] = useState(false);
  const [serverName, setServerName] = useState("");
  const [filePath, setFilePath] = useState("");
  const [indexKey, setIndexKey] = useState("");

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

  const handleInputServerName = (e) => {
    setServerName(e.target.value);
  };
  const handleInputFilePath = (e) => {
    setFilePath(e.target.value);
  };
  const handleInputIndexKey = (e) => {
    setIndexKey(e.target.value);
  };
  const handleCategoryChange = (e) => {
    let value = e.target.value
    setCategory(value);
    handleClear();
  };

  const updateLicenseInfo = (
    item,
    ServerName,
    OPTFilePath,
    OPTFileIndexKey
  ) => {
    dispatch({
      type: "updateLicenseInfo",
      payload: {
        item,
        ServerName,
        OPTFilePath,
        OPTFileIndexKey,
      },
    });
  };
  const createLicenseInfo = (
    item,
    ServerName,
    OPTFilePath,
    OPTFileIndexKey
  ) => {
    dispatch({
      type: "createLicenseInfo",
      payload: {
        item,
        ServerName,
        OPTFilePath,
        OPTFileIndexKey,
      },
    });
  };

  useEffect(() => {
    if (show) {
      if (item && Object.keys(item).length === 0) {
        setServerName("");
        setFilePath("");
        setIndexKey("");
        setArea("");
        setSelectedValue(null);
        setInputText("");
        setMode(true);
      } else {
        let { ServerName, OPTFilePath, OPTFileIndexKey } = item;

        setServerName(ServerName);
        setFilePath(OPTFilePath);
        setIndexKey(OPTFileIndexKey);

        setMode(false);
      }
    }
  }, [show]);

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

    const fn = isEdit ? updateLicenseInfo : createLicenseInfo;
    fn(verifyParams, serverName, filePath, indexKey);
    toggleFunc(false);
  };

  return (
    <ModalContainer
      open={show}
      setOpen={() => {
        toggleFunc(false);
      }}
      title={intl.formatMessage({ id: "softwareinfomgt.modal3" })}
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
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
        </>
      )}
      <TextFieldControl
        onChange={handleInputServerName}
        value={serverName}
        label={intl.formatMessage({ id: "softwareinfomgt.ServerName" })}
      />
      <TextFieldControl
        multiline
        onChange={handleInputFilePath}
        value={filePath}
        label={intl.formatMessage({ id: "softwareinfomgt.OPTFilePath" })}
      />
      <TextFieldControl
        onChange={handleInputIndexKey}
        value={indexKey}
        label={intl.formatMessage({
          id: "softwareinfomgt.OPTFileIndexKey",
        })}
      />
    </ModalContainer>
  );
};

export default EditLicenseInfo;
