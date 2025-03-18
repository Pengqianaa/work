import React, { useState } from "react";
import ModalContainer from "./ModalContainer";
import { TextFieldControl } from "./FormControls";
import { checkRequiredInputsAreEmptyOrNot } from "src/Common/commonMethod";
import { Buttons, BUTTON_TYPES } from "../../common/index";

export const INIT_SHOW_ERROR_MSGS = {
  factoryCode: false,
  groupName: false,
  sdpSite: false,
  technician: false,
  sdpArea: false,
};

const ModifySiteModal = ({ show, toggle, intl, onSave, editSite }) => {
  const [isEdit, setIsEdit] = useState(!!editSite?.groupName);
  const [groupName, setGroupName] = useState(editSite?.groupName ?? "");
  const [factoryCode, setFactoryCode] = useState(editSite?.factoryCode ?? "");
  const [factoryCodeInvalid, setFactoryCodeInvalid] = useState("");
  const [sdpSite, setSdpSite] = useState(editSite?.sdpSite ?? "");
  const [technician, setTechnician] = useState(editSite?.technician ?? "");
  const [technicianInvalid, setTechnicianInvalid] = useState("");
  const [sdpArea, setSdpArea] = useState(editSite?.sdpArea ?? "");
  const [error, setError] = useState(INIT_SHOW_ERROR_MSGS);

  const groupNameChange = (e) => {
    setGroupName(e.target.value);
  };
  const factoryChange = (e) => {
    const { value } = e.target;
    setFactoryCode(value);
    setError((prev) => ({
      ...prev,
      factoryCode: value.length > 5,
    }));
    setFactoryCodeInvalid(value.length > 5 ? "Length exceeds limit" : "");
  };
  const sdpSiteChange = (e) => {
    setSdpSite(e.target.value);
  };
  const technicianChange = (e) => {
    const { value } = e.target;
    const reg =
      /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    const isOk = reg.test(value);
    setError((prev) => ({
      ...prev,
      technician: !isOk,
    }));

    setTechnicianInvalid(isOk ? "" : "Email format error");

    setTechnician(value);
  };

  const sdpAreaChange = (e) => {
    const { value } = e.target;
    setSdpArea(value);
  };

  const handleSave = () => {
    const params = {
      factoryCode: factoryCode,
      groupName: groupName,
      sdpSite: sdpSite,
      technician: technician,
      sdpArea: sdpArea,
    };

    if (checkRequiredInputsAreEmptyOrNot(params, setError)) {
      return;
    }

    onSave(params);
    toggle(false);
  };

  return (
    <ModalContainer
      open={show}
      setOpen={() => {
        toggle(false);
      }}
      title={
        isEdit
          ? intl.formatMessage({ id: "peoplecontrolsetting.modify" })
          : intl.formatMessage({ id: "peoplecontrolsetting.modal" })
      }
      buttons={<Buttons type={BUTTON_TYPES.SAVE} onClick={handleSave} />}
    >
      <TextFieldControl
        label={intl.formatMessage({ id: "adminCols.sitemgt.groupName" })}
        value={groupName}
        error={error.groupName}
        message={
          error.groupName
            ? intl.formatMessage({
                id: "peoplecontrolsetting.errorMsg.groupName",
              })
            : ""
        }
        onChange={groupNameChange}
        multiline
        required
      />
      {!isEdit && (
        <TextFieldControl
          value={factoryCode}
          label={intl.formatMessage({
            id: "adminCols.sitemgt.factoryCode",
          })}
          error={error.factoryCode}
          message={
            error.factoryCode
              ? factoryCodeInvalid
                ? factoryCodeInvalid
                : intl.formatMessage({
                    id: "peoplecontrolsetting.errorMsg.factoryCode",
                  })
              : ""
          }
          onChange={factoryChange}
          multiline
          required
        />
      )}
      <TextFieldControl
        value={sdpSite}
        label={intl.formatMessage({ id: "adminCols.sitemgt.sdpSite" })}
        error={error.sdpSite}
        message={
          error.sdpSite
            ? intl.formatMessage({
                id: "peoplecontrolsetting.errorMsg.sdpSite",
              })
            : ""
        }
        onChange={sdpSiteChange}
        required
      />
      <TextFieldControl
        value={technician}
        label={intl.formatMessage({ id: "adminCols.sitemgt.technician" })}
        error={error.technician}
        message={
          error.technician
            ? technicianInvalid
              ? technicianInvalid
              : intl.formatMessage({
                  id: "peoplecontrolsetting.errorMsg.technician",
                })
            : ""
        }
        onChange={technicianChange}
        multiline
        required
      />
      <TextFieldControl
        value={sdpArea}
        label={intl.formatMessage({ id: "adminCols.sitemgt.sdpArea" })}
        error={error.sdpArea}
        message={
          error.sdpArea
            ? intl.formatMessage({
                id: "peoplecontrolsetting.errorMsg.sdpArea",
              })
            : ""
        }
        onChange={sdpAreaChange}
        required
      />
    </ModalContainer>
  );
};

export default ModifySiteModal;
