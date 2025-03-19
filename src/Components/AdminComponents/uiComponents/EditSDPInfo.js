import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import {
  CButton,
  CRow,
  CCol,
} from "@coreui/react";
import "../../../CSS/common.scss";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/lab/Alert";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ModalContainer from "../uiComponents/ModalContainer";

const CartItem = styled(CRow)`
  margin: 0 10px;
`;
const ItemCol = styled(CCol)``;

const EditSDPInfo = (props) => {
  let { show, toggleFunc, item, setterFunc, doSubmit, bindSDP } = props;
  const intl = useIntl();

  const [applicant, setApplicant] = useState("");
  const [agent, setAgent] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [floor, setFloor] = useState("");
  const [bgbu, setBgbu] = useState("");
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (show) {
      setApplicant(item.applicantNtAccount);
      setAgent(item.applicantAgentNtAccount);
      setArea(item.applicantRegion);
      setLocation(item.applicantLocation);
      setFloor(item.applicantFloor);
      setBgbu(item.applicantBg);
      setTitle(item.sdpTitle);
      setMemo(item.memo);
      setSdp("");
      setErrorMsg(item.errorMsg);
    }
  }, [show]);

  const getTitle = (item) => {
    // [軟體安裝/軟體卸載]-{M手動/A自動}-{電腦名稱}-{軟體編號}-{軟體名稱}
    // [軟體安裝/軟體卸載] - 使用[form_type]判斷
    // {M手動/A自動}- 使用[package_status]判斷
    // {電腦名稱}- [computer]
    // {軟體編號}- [source_number]
    // {軟體名稱} - [asset_name]
    const { formType, isPackage, computerName, stockID, productName } = item;
    return `[軟體${
      formType === 1 ? "安裝" : "卸載"
    }]-${isPackage}-${computerName}-${stockID}-${productName}`;
  };

  const getMemo = (item) => {
    const con1 =
      "請由(Sofware Center)內自行安裝，若安裝失敗，請聯繫案件處理工程師協助";
    const con2 =
      "SmartIT自動派送有突發狀況，請Server Team協助授予權限，並等待案件處理工程師通知後續作業";
    const con3 = "請等待案件處理工程師與您聯繫";

    const {
      formType,
      formId,
      computerName,
      stockID,
      productName,
      empName,
      applicant,
      reason,
    } = item;
    return `[軟體安裝]需求已被核准。 
軟體名稱：${stockID}-${productName} 
使用者：${applicant} 
電腦名稱：${computerName} 
授權資訊：${formId}
安裝方式：
${con1}

申請人：${empName} 
填單人： ${applicant} 
申請原因：${reason} `;
  };

  const handleChangeField1 = (e) => {
    if (!!e.target) {
      setApplicant(e.target.value);
    }
  };
  const handleChangeField2 = (e) => {
    if (!!e.target) {
      setAgent(e.target.value);
    }
  };
  const handleChangeField3 = (e) => {
    if (!!e.target) {
      setArea(e.target.value);
    }
  };
  const handleChangeField4 = (e) => {
    if (!!e.target) {
      setLocation(e.target.value);
    }
  };
  const handleChangeField5 = (e) => {
    if (!!e.target) {
      setFloor(e.target.value);
    }
  };
  const handleChangeField6 = (e) => {
    if (!!e.target) {
      setBgbu(e.target.value);
    }
  };
  const handleChangeField7 = (e) => {
    if (!!e.target) {
      setTitle(e.target.value);
    }
  };
  // const handleChangeField8 = e => {
  //   if (!!e.target) {
  //     setMemo(e.target.value)
  //   }
  // }

  const clearAllFields = () => {
    setApplicant("");
    setAgent("");
    setArea("");
    setLocation("");
    setFloor("");
    setBgbu("");
    setTitle("");
    setMemo("");
    setSdp("");
  };

  const handleSubmit = () => {
    let params = {
      fromTypey: item.formType,
      sdpAgent: agent,
      sdpApplicant: applicant,
      sdpArea: area,
      sdpBg: bgbu,
      sdpFloor: floor,
      sdpLocation: location,
      sdpMemo: memo,
      sdpSubject: title,
      subId: item.subID,
    };
    doSubmit(params);

    clearAllFields();
    toggleFunc(false);
    setterFunc({});
  };
  const handleClose = () => {
    clearAllFields();
    toggleFunc(false);
    setterFunc({});
  };

  const [sdp, setSdp] = useState("");
  const handleChangeSdp = (e) => {
    if (!!e.target) {
      setSdp(e.target.value);
    }
  };
  const handleBindSDP = () => {
    bindSDP(item.subID, sdp);
  };

  return (
    <ModalContainer
      open={show}
      setOpen={handleClose}
      title={intl.formatMessage({ id: "softwaresdpmgt.sdpModal.title" })}
      // TODO: 待確認按鈕類型並修改 <Buttons type={BUTTON_TYPES.SAVE}  onClick={handleBindSDP/>
      buttons={
        <ItemCol lg="12" style={{ width: "100%", display: "flex" }}>
          <div style={{ width: "150px" }}>
            <TextField
              variant="standard"
              style={{ width: "100%" }}
              multiline
              onChange={handleChangeSdp}
              value={sdp}
              label={intl.formatMessage({
                id: "softwaresdpmgt.sdpModal.sdpIdField",
              })}
            />
          </div>
          <Button variant="contained" size="small" onClick={handleBindSDP}>
            <FormattedMessage id="softwaresdpmgt.sdpModal.sdpIdField" />
          </Button>
        </ItemCol>
      }
    >
      <CartItem>
        <ItemCol lg="6">
          <TextField
            variant="standard"
            style={{ width: "100%" }}
            multiline
            onChange={handleChangeField1}
            value={applicant}
            label={intl.formatMessage({ id: "softwaresdpmgt.sdpModal.field1" })}
          />
          <TextField
            variant="standard"
            style={{ width: "100%" }}
            multiline
            onChange={handleChangeField3}
            value={area}
            label={intl.formatMessage({ id: "softwaresdpmgt.sdpModal.field3" })}
          />
          <TextField
            variant="standard"
            style={{ width: "100%" }}
            multiline
            onChange={handleChangeField5}
            value={floor}
            label={intl.formatMessage({ id: "softwaresdpmgt.sdpModal.field5" })}
          />
        </ItemCol>
        <ItemCol lg="6">
          <TextField
            variant="standard"
            style={{ width: "100%" }}
            multiline
            onChange={handleChangeField2}
            value={agent}
            label={intl.formatMessage({ id: "softwaresdpmgt.sdpModal.field2" })}
          />
          <TextField
            variant="standard"
            style={{ width: "100%" }}
            multiline
            onChange={handleChangeField4}
            value={location}
            label={intl.formatMessage({ id: "softwaresdpmgt.sdpModal.field4" })}
          />
          <TextField
            variant="standard"
            style={{ width: "100%" }}
            multiline
            onChange={handleChangeField6}
            value={bgbu}
            label={intl.formatMessage({ id: "softwaresdpmgt.sdpModal.field6" })}
          />
        </ItemCol>
        <ItemCol lg="12">
          <TextField
            variant="standard"
            style={{ width: "100%" }}
            multiline
            onChange={handleChangeField7}
            value={title}
            label={intl.formatMessage({ id: "softwaresdpmgt.sdpModal.field7" })}
          />
          <p style={{ margin: "8px 0 0" }}>
            {intl.formatMessage({ id: "softwaresdpmgt.sdpModal.field8" })}
          </p>
          <CKEditor
            editor={ClassicEditor}
            data={memo}
            // onReady={editor => { console.log( 'Editor is ready to use!', editor ) }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setMemo(data);
            }}
            config={{
              toolbar: [],
            }}
          />
        </ItemCol>
        {!!errorMsg && (
          <ItemCol lg="12" style={{ display: "flex", marginTop: "8px" }}>
            <Alert severity="error">{errorMsg}</Alert>
          </ItemCol>
        )}
        <ItemCol
          lg="12"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "8px",
          }}
        >
          <Button
            variant="contained"
            size="small"
            style={{
              backgroundColor: "#0087DC",
              color: "#fff",
              maxHeight: "32px",
              marginLeft: "4px",
            }}
            onClick={handleSubmit}
          >
            <FormattedMessage id="adminCommon.save" />
          </Button>
        </ItemCol>
      </CartItem>
    </ModalContainer>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
  doSubmit: (params) =>
    dispatch({
      type: "editSDPInfo",
      payload: params,
    }),
  bindSDP: (subId, caseId) =>
    dispatch({
      type: "bindSDP",
      payload: { subId, caseId },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditSDPInfo);
