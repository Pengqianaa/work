import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const LicenseEnoughTip = ({ open, onClose }) => {
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Application Warning</DialogTitle>
        <DialogContent>
            Insufficient licenses for the selected time slot. Please choose another!
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LicenseEnoughTip;