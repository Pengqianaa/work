import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material/";
import { CCol } from "@coreui/react";
import ModalContainer from "../AdminComponents/uiComponents/ModalContainer";
import { SubmitButton } from "../AdminComponents/uiComponents/AdminCommonUis";
import { TextFieldControl } from "../AdminComponents/uiComponents/FormControls";
import { Actions } from "../../Common/constants";
import Api from "../../Common/api";

export const ACCOUNT_TYPE = {
  sam: 1,
  employee: 2,
};

const INIT_STATE = {
  id: "",
  type: ACCOUNT_TYPE.employee,
};

const SwitchUserModal = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const toggleTokenModal = useSelector((state) => state.view.toggleTokenModal);
  const [newUser, setNewUser] = useState(INIT_STATE);

  const handleChange = (event) => {
    const { target } = event;
    const fieldName = target?.name;

    if (!target || !fieldName) {
      return;
    }
    const type = ACCOUNT_TYPE[fieldName];
    let newUserData = {};
    if (type) {
      newUserData = {
        ...newUser,
        type,
      };
    } else {
      newUserData = {
        ...newUser,
        id: target.value,
      };
    }

    setNewUser(newUserData);
  };

  const handleSubmit = async () => {
    const { code, data } = await Api.getNewUserToken(newUser);
    if (code !== 0 && !data) {
      return;
    }
    dispatch({
      type: Actions.STORE_USER,
      payload: { token: data?.data },
    });
    toggleModal(false);
    history.go(0);
  };

  const toggleModal = (display) => {
    dispatch({ type: Actions.SET_TOGGLE_TOKEN_MODAL, payload: display });
  };

  return (
    <ModalContainer
      open={toggleTokenModal}
      setOpen={toggleModal}
      title="Switch User"
      buttons={
        <SubmitButton onClick={handleSubmit}>
          <FormattedMessage id="adminCommon.save" />
        </SubmitButton>
      }
    >
      <CCol>
        <TextFieldControl
          name="account"
          label="Account"
          value={newUser.id}
          onChange={handleChange}
          required
        />
        <FormControl className="mt-4" component="fieldset">
          <FormLabel component="legend">Choose Account Type</FormLabel>
          <FormGroup row>
            <FormControlLabel
              label="SAM ID"
              control={
                <Checkbox
                  name="sam"
                  checked={newUser.type === ACCOUNT_TYPE.sam}
                  onChange={handleChange}
                />
              }
            />
            <FormControlLabel
              label="Employee ID"
              control={
                <Checkbox
                  name="employee"
                  checked={newUser.type === ACCOUNT_TYPE.employee}
                  onChange={handleChange}
                />
              }
            />
          </FormGroup>
        </FormControl>
      </CCol>
    </ModalContainer>
  );
};

export default SwitchUserModal;
