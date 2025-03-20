import React, { useState } from "react";
import UserQueryMui from "./UserQueryMui";
import ModalContainer from "./ModalContainer";
import { Buttons, BUTTON_TYPES } from "../../common/index";
import { checkRequiredInputsAreEmptyOrNot } from "src/Common/commonMethod";

export const INIT_SHOW_ERROR_MSGS = {
  userInfo: false,
  userInfoA: false,
};

const ModifyVipModal = ({ show, toggle, intl, onSave }) => {
  const [keyword, setKeyword] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [keywordA, setKeywordA] = useState("");
  const [userInfoA, setUserInfoA] = useState({});
  const [error, setError] = useState(INIT_SHOW_ERROR_MSGS);

  const handleSave = () => {
    const params = {
      agentEmpCode: userInfoA.empCode,
      agentId: userInfoA.userId,
      userEmpCode: userInfo.empCode,
      userId: userInfo.userId,
    };

    if (checkRequiredInputsAreEmptyOrNot({ userInfo, userInfoA }, setError)) {
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
      title={intl.formatMessage({ id: "vipmgt.modal" })}
      buttons={<Buttons type={BUTTON_TYPES.SAVE} onClick={handleSave} />}
    >
      <UserQueryMui
        intl={intl}
        labelId={"vipmgt.applicantName"}
        excludeNonEmp={true}
        keyword={keyword}
        setKeyword={setKeyword}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        isLock={false}
        error={error.userInfo}
        message={intl.formatMessage({
          id: "vipmgt.errorMsg.userInfo",
        })}
        required
      />

      <UserQueryMui
        intl={intl}
        labelId={"vipmgt.agentName"}
        excludeNonEmp={true}
        keyword={keywordA}
        setKeyword={setKeywordA}
        userInfo={userInfoA}
        setUserInfo={setUserInfoA}
        isLock={false}
        error={error.userInfoA}
        message={intl.formatMessage({
          id: "vipmgt.errorMsg.userInfoA",
        })}
        required
      />
    </ModalContainer>
  );
};

export default ModifyVipModal;
