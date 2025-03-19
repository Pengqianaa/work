import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useIntl } from "react-intl";
import { MenuItem } from "@mui/material";
import ModalContainer from "../uiComponents/ModalContainer";
import {
  TextFieldControl,
  SelectorControl,
} from "../uiComponents/FormControls";
import { Buttons, BUTTON_TYPES } from "../../common/index";
import { checkRequiredInputsAreEmptyOrNot } from "src/Common/commonMethod";
import "../../../CSS/common.scss";

const INIT_SHOW_ERROR_MSGS = {
  approvalInfo: false,
  brand: false,
  installationMethod: false,
  installationPath: false,
  licensesSn: false,
  productName: false,
  regionArea: false,
  sdpId: false,
};

const EditTrialwareInfo = ({
  show,
  item,
  toggleFunc,
  updateTrialWare,
  createTrialWare,
  areaList,
}) => {
  const intl = useIntl();
  const [mode, setMode] = useState(false);
  const [brand, setBrand] = useState("");
  const [productName, setProduct] = useState("");
  const [sdpId, setSdpId] = useState("");
  const [installationMethod, setMethod] = useState("");
  const [installationPath, setPath] = useState("");
  const [regionArea, setArea] = useState("");
  const [licensesSn, setSn] = useState("");
  const [model, setModel] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [showEffectiveDate, setShowEffectiveDate] = useState("");
  const [approvalInfo, setApprovalInfo] = useState("");
  const [id, setId] = useState("");
  const [error, setError] = useState(INIT_SHOW_ERROR_MSGS);

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };
  const handleProductChange = (e) => {
    setProduct(e.target.value);
  };
  const handleSdpIdChange = (e) => {
    setSdpId(e.target.value);
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
  const handleModuleChange = (e) => {
    setModel(e.target.value);
  };
  const handleEffectiveDateChange = (e) => {
    Date.prototype.format = function (format) {
      var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds(),
      };
      if (/(y+)/i.test(format)) {
        format = format.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? date[k]
              : ("00" + date[k]).substr(("" + date[k]).length)
          );
        }
      }
      return format;
    };
    setShowEffectiveDate(new Date(e.target.value).format("yyyy-MM-dd"));
    setEffectiveDate(new Date(e.target.value).format("yyyy-MM-dd hh:mm:ss"));
  };
  const handleApprovalInfoChange = (e) => {
    setApprovalInfo(e.target.value);
  };

  useEffect(() => {
    if (show) {
      if (item && Object.keys(item).length === 0) {
        setApprovalInfo("");
        setBrand("");
        setProduct("");
        setSdpId("");
        setMethod("");
        setPath("");
        setSn("");
        setArea("");
        setEffectiveDate("");
        setModel("");
        setMode(true);
      } else {
        let {
          approvalInfo,
          brand,
          sdpId,
          regionArea,
          effectiveDate,
          model,
          installationMethod,
          installationPath,
          licensesSn,
          productName,
          id,
        } = item;
        setArea(regionArea.toLocaleUpperCase());
        setApprovalInfo(approvalInfo);
        setBrand(brand);
        setProduct(productName);
        setSdpId(sdpId);
        if (effectiveDate) {
          setShowEffectiveDate(effectiveDate.slice(0, 10));
        }
        setEffectiveDate(effectiveDate);
        setModel(model);
        setMethod(installationMethod);
        setPath(installationPath);
        setSn(licensesSn);
        setId(id);
        setMode(false);
      }
    }
  }, [show]);

  const handleSubmit = () => {
    const params = {
      approvalInfo,
      brand,
      effectiveDate,
      installationMethod,
      installationPath,
      licensesSn,
      model,
      productName,
      regionArea,
      sdpId,
    };

    if (checkRequiredInputsAreEmptyOrNot(params, setError)) {
      return;
    }

    const fn = mode ? createTrialWare : updateTrialWare;

    fn({
      ...params,
      ...(!mode && { id }),
    });
    toggleFunc(false, true);
  };

  return (
    <ModalContainer
      open={show}
      setOpen={() => {
        toggleFunc(false, false);
      }}
      title={intl.formatMessage({ id: "softwareinfomgt.modal5" })}
      buttons={<Buttons type={BUTTON_TYPES.SAVE} onClick={handleSubmit} />}
    >
      <SelectorControl
        label={intl.formatMessage({ id: "adminCommon.regionArea" })}
        value={regionArea}
        error={error.regionArea}
        message={intl.formatMessage({
          id: "softwareinfomgt.errorMsg.modal5.regionArea",
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
      <TextFieldControl
        multiline
        onChange={handleBrandChange}
        value={brand}
        label={intl.formatMessage({ id: "softwareinfomgt.brand" })}
        error={error.brand}
        message={intl.formatMessage({
          id: "softwareinfomgt.errorMsg.modal5.brand",
        })}
        required
      />
      <TextFieldControl
        multiline
        onChange={handleProductChange}
        value={productName}
        label={intl.formatMessage({ id: "softwareinfomgt.product" })}
        error={error.productName}
        message={intl.formatMessage({
          id: "softwareinfomgt.errorMsg.modal5.productName",
        })}
        required
      />
      <TextFieldControl
        onChange={handleSdpIdChange}
        value={sdpId}
        label={intl.formatMessage({ id: "softwareinfomgt.sdpId" })}
        error={error.sdpId}
        message={intl.formatMessage({
          id: "softwareinfomgt.errorMsg.modal5.sdpId",
        })}
        required
      />
      <TextFieldControl
        multiline
        onChange={handlePathChange}
        value={installationPath}
        label={intl.formatMessage({
          id: "softwareinfomgt.installationPath",
        })}
        error={error.installationPath}
        message={intl.formatMessage({
          id: "softwareinfomgt.errorMsg.modal5.installationPath",
        })}
        required
      />
      <TextFieldControl
        multiline
        onChange={handleMethodChange}
        value={installationMethod}
        label={intl.formatMessage({
          id: "softwareinfomgt.installationMethod",
        })}
        error={error.installationMethod}
        message={intl.formatMessage({
          id: "softwareinfomgt.errorMsg.modal5.installationMethod",
        })}
        required
      />
      <TextFieldControl
        onChange={handleSnChange}
        value={licensesSn}
        label={intl.formatMessage({ id: "softwareinfomgt.licensesSn" })}
        error={error.licensesSn}
        message={intl.formatMessage({
          id: "softwareinfomgt.errorMsg.modal5.licensesSn",
        })}
        required
      />
      <TextFieldControl
        multiline
        onChange={handleModuleChange}
        value={model}
        label={intl.formatMessage({ id: "softwareinfomgt.module" })}
      />
      <TextFieldControl
        type="date"
        label={intl.formatMessage({
          id: `softwareinfomgt.effectiveDate`,
        })}
        onChange={handleEffectiveDateChange}
        value={showEffectiveDate}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextFieldControl
        onChange={handleApprovalInfoChange}
        value={approvalInfo}
        label={intl.formatMessage({ id: "softwareinfomgt.approvalInfo" })}
        error={error.approvalInfo}
        message={intl.formatMessage({
          id: "softwareinfomgt.errorMsg.modal5.approvalInfo",
        })}
        required
      />
    </ModalContainer>
  );
};

const mapStateToProps = (state) => ({
  areaList: state.query.areaList,
});
const mapDispatchToProps = (dispatch) => ({
  updateTrialWare: ({
    approvalInfo,
    brand,
    effectiveDate,
    id,
    installationMethod,
    installationPath,
    licensesSn,
    model,
    productName,
    regionArea,
    sdpId,
  }) =>
    dispatch({
      type: "updateTrialWare",
      payload: {
        approvalInfo,
        brand,
        effectiveDate,
        id,
        installationMethod,
        installationPath,
        licensesSn,
        model,
        productName,
        regionArea,
        sdpId,
      },
    }),
  createTrialWare: ({
    approvalInfo,
    brand,
    effectiveDate,
    installationMethod,
    installationPath,
    licensesSn,
    model,
    productName,
    regionArea,
    sdpId,
  }) =>
    dispatch({
      type: "createTrialWare",
      payload: {
        approvalInfo,
        brand,
        effectiveDate,
        installationMethod,
        installationPath,
        licensesSn,
        model,
        productName,
        regionArea,
        sdpId,
      },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditTrialwareInfo);
