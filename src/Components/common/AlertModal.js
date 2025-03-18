import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Buttons, { BUTTON_TYPES } from "./Buttons";
import { Actions } from "src/constants/common";

const AlertModal = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.view.alertShow);
  const props = useSelector((state) => state.view.alertProps);
  const { title, message, hasCancel, callback } = props;

  const handleConfirm = () => {
    if (callback) {
      callback();
    }

    toggle(false);
  };

  const toggle = (toggle) =>
    dispatch({
      type: Actions.TOGGLE_ALERT,
      payload: toggle,
    });

  return (
    <Dialog
      style={{ zIndex: "99999" }}
      open={open}
      fullWidth={true}
      maxWidth="xs"
      hideBackdrop={true}
      onClose={() => toggle(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {hasCancel && (
          <Buttons
            key={BUTTON_TYPES.CANCEL}
            type={BUTTON_TYPES.CANCEL}
            onClick={() => toggle(false)}
          />
        )}

        <Buttons
          key={BUTTON_TYPES.CONFIRM}
          type={BUTTON_TYPES.CONFIRM}
          onClick={handleConfirm}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AlertModal;
