import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MenuItem, Checkbox, Chip } from "@mui/material";
import UserQueryMui from "./UserQueryMui";
import ModalContainer from "./ModalContainer";
import { SelectorControl } from "./FormControls";
import { Buttons, BUTTON_TYPES } from "../../common/index";
import { checkRequiredInputsAreEmptyOrNot } from "src/Common/commonMethod";

export const INIT_SHOW_ERROR_MSGS = {
  user: false,
  role: false,
};

const ModifyPermissionModal = (props) => {
  const { show, toggle, focusUser, intl } = props;

  const dispatch = useDispatch();
  const userRoles = useSelector((state) => state.permission.userRoles);

  const lock = !!Object.keys(focusUser).length;
  const [keyword, setKeyword] = useState(focusUser?.fullName ?? "");
  const [userInfo, setUserInfo] = useState(focusUser);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState(INIT_SHOW_ERROR_MSGS);

  useEffect(() => {
    if (!show) {
      setError(INIT_SHOW_ERROR_MSGS);
      return;
    }
    !userRoles.length &&
      dispatch({
        type: "getUserRoles",
      });
  }, [show]);

  useEffect(() => {
    setSelected(
      !userInfo.roles?.length ? [] : [...userInfo.roles.map((el) => el.roleId)]
    );
  }, [userInfo]);

  const handleChange = (e) => {
    setSelected(e.target.value);
  };

  const handleSave = () => {
    const params = { user: userInfo, role: selected };

    if (checkRequiredInputsAreEmptyOrNot(params, setError)) {
      return;
    }

    dispatch({
      type: "updateRole",
      payload: params,
    });
    toggle(false);
  };

  return (
    <ModalContainer
      open={show}
      setOpen={() => {
        toggle(false);
      }}
      title={intl.formatMessage({ id: "permissionmgt.modal" })}
      buttons={<Buttons type={BUTTON_TYPES.SAVE} onClick={handleSave} />}
    >
      <UserQueryMui
        intl={intl}
        keyword={keyword}
        setKeyword={setKeyword}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        isLock={lock}
        error={error.user}
        required
      />
      <SelectorControl
        label={intl.formatMessage({ id: "permissionmgt.group" })}
        value={selected}
        error={error.role}
        message={
          error.role
            ? intl.formatMessage({
                id: "permissionmgt.errorMsg.role",
              })
            : ""
        }
        onChange={handleChange}
        renderValue={(selected) => {
          const selectedRoles = userRoles.filter((el) =>
            selected.includes(el.roleId)
          );
          return (
            <div style={{ display: "flex" }}>
              {selectedRoles.map((el, index) => (
                <Chip key={index} label={el.roleName} />
              ))}
            </div>
          );
        }}
        multiple
        required
      >
        {userRoles.map((role, index) => (
          <MenuItem key={index} value={role.roleId}>
            <Checkbox
              style={{ color: "#0087DC" }}
              checked={!!selected.find((e) => e === role.roleId)}
            />
            {role.roleName}
          </MenuItem>
        ))}
      </SelectorControl>
    </ModalContainer>
  );
};

export default ModifyPermissionModal;
