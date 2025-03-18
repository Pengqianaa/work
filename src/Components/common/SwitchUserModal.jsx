import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Box, TextField, Button, Modal, Typography } from "@mui/material";
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
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async () => {
    const { code, data } = await Api.getNewUserToken(newUser);
    if (code !== 0 || !data) {
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
    <Modal
      open={toggleTokenModal}
      onClose={() => toggleModal(false)}
      aria-labelledby="switch-user-modal-title"
      aria-describedby="switch-user-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="switch-user-modal-title" variant="h6" component="h2">
          Switch User
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          name="id"
          label="Account"
          value={newUser.id}
          onChange={handleChange}
          required
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ textTransform: "none" }}
          >
            <FormattedMessage id="adminCommon.save" />
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SwitchUserModal;
