import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import { Grid, MenuItem, FormControl, Chip } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import "../../../CSS/common.scss";
import ImageUpload from "./ImageUpload";
import SWStockQuery from "./SWStockQuery";
import ModalContainer from "../uiComponents/ModalContainer";
import { FilterGroup } from "./AdminCommonUis";
import {
  TextFieldControl,
  SelectorControl,
} from "../uiComponents/FormControls";
import { Buttons, BUTTON_TYPES } from "../../common/index";
import styled from "styled-components";

const SelectedChip = styled(Chip)`
  margin-left: 4px;
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

const EditSoftwareInfo = (props) => {
  let { show, item } = props;

  const intl = useIntl();
  const dispatch = useDispatch();
  const [desc, setDesc] = useState("");
  const [eDesc, setEDesc] = useState("");
  const [url, setUrl] = useState("");
  const [eUrl, setEUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [mainFlag, setMainFlag] = useState(1);
  const [subMainFlag, setSubMainFlag] = useState([]);

  const updateSoftwareInfo = (
    assetId,
    graph,
    refEUrl,
    refUrl,
    softwareDesc,
    softwareEDesc,
    mainFlag,
    mainSoftDetailList
  ) =>
    dispatch({
      type: "updateSoftwareInfo",
      payload: {
        assetId,
        graph,
        refEUrl,
        refUrl,
        softwareDesc,
        softwareEDesc,
        mainFlag,
        mainSoftDetailList,
      },
    });

  const handleDescChange = (e) => {
    setDesc(e.target.value);
  };
  const handleEDescChange = (e) => {
    setEDesc(e.target.value);
  };
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };
  const handleEUrlChange = (e) => {
    setEUrl(e.target.value);
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

  useEffect(() => {
    if (show) {
      let {
        assetRefUrlEN,
        assetRefUrlTC,
        assetDescTC,
        assetDescEN,
        graph,
        mainFlag,
        mainSoftDetails,
      } = item;

      setDesc(assetDescTC ? assetDescTC : "");
      setEDesc(assetDescEN ? assetDescEN : "");
      setUrl(assetRefUrlTC ? assetRefUrlTC : "");
      setEUrl(assetRefUrlEN ? assetRefUrlEN : "");
      setFileName(graph === "NA" ? null : graph);
      setMainFlag(mainFlag ? 1 : 0);
      if (mainSoftDetails) {
        let mainFlagListJson = JSON.parse(mainSoftDetails);
        if (mainFlagListJson !== null && mainFlagListJson.length > 0) {
          setSubMainFlag(mainFlagListJson);
        }
      }
    } else {
      setDesc("");
      setEDesc("");
      setUrl("");
      setEUrl("");
      setMainFlag(1);
      setSubMainFlag([]);
    }
  }, [show]);

  const handleSubmit = () => {
    let mainSoftDetail = [];
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
    updateSoftwareInfo(
      item.assetId,
      fileName,
      eUrl,
      url,
      desc,
      eDesc,
      mainFlag === 1 ? true : false,
      mainSoftDetail
    );
    props.toggleFunc(false);
  };

  return (
    <ModalContainer
      open={show}
      setOpen={() => {
        props.toggleFunc(false);
      }}
      title={intl.formatMessage({ id: "softwareinfomgt.modal1" })}
      buttons={<Buttons type={BUTTON_TYPES.SAVE} onClick={handleSubmit} />}
    >
      <Grid item lg={4}>
        <ImageUpload
          fileName={fileName}
          setFileName={setFileName}
          refresh={show}
        />
      </Grid>
      <Grid item lg={8}>
        <SoftwareName>{item.softwareName}</SoftwareName>
        <ItemInfo>{`Stock ID: ${item.sourceNumber}`}</ItemInfo>
        <ItemInfo>{`${intl.formatMessage({
          id: "softwareinfomgt.brandName",
        })}${item.brandName}`}</ItemInfo>
        <ItemInfo>{`${intl.formatMessage({
          id: "softwareinfomgt.category",
        })}${item.categoryNameEN}`}</ItemInfo>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <TextFieldControl
        multiline
        onChange={handleDescChange}
        value={desc}
        label={intl.formatMessage({ id: "softwareinfomgt.softwareDesc" })}
      />
      <TextFieldControl
        multiline
        onChange={handleEDescChange}
        value={eDesc}
        label={intl.formatMessage({
          id: "softwareinfomgt.softwareEDesc",
        })}
      />
      <TextFieldControl
        multiline
        onChange={handleUrlChange}
        value={url}
        label={intl.formatMessage({ id: "softwareinfomgt.refUrl" })}
      />
      <TextFieldControl
        multiline
        onChange={handleEUrlChange}
        value={eUrl}
        label={intl.formatMessage({ id: "softwareinfomgt.refEUrl" })}
      />
      <SelectorControl
        label="MainFlag"
        onChange={handleMainFlagChange}
        value={mainFlag}
      >
        <MenuItem value={0}>0</MenuItem>
        <MenuItem value={1}>1</MenuItem>
      </SelectorControl>

      {mainFlag !== 1 && (
        <Grid item xs={12} md={12}>
          <FormControl variant="standard" style={{ width: "100%" }}>
            <SWStockQuery
              setInfo={handleSubMainFlagChange}
              intl={intl}
              isDisabled={false}
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
        </Grid>
      )}
      <Grid item xs={12} md={12}>
        <ErrorIcon style={{ color: "#FFC107" }} />
        <span style={{ color: "#138496", fontSize: "14px" }}>
          1代表單一主程式; 0代表副程式(如果填寫0需選擇關聯的主程式)
        </span>
      </Grid>
    </ModalContainer>
  );
};

export default EditSoftwareInfo;
