import React, { memo } from "react";
import { styled } from '@mui/material/styles';
import Switch from "@mui/material/Switch";
const PREFIX = 'SwitchControl';

const classes = {
  switchBase: `${PREFIX}-switchBase`,
  checked: `${PREFIX}-checked`,
  disabled: `${PREFIX}-disabled`
};

const StyledSwitch = styled(Switch)({
  [`& .${classes.switchBase}`]: {
    "&$checked$disabled": {
      color: " #7b83eb",
      "& + $track": {
        backgroundColor: "#3d4259",
      },
    },
  },

  [`& .${classes.checked}`]: {},
  [`& .${classes.disabled}`]: {}
});

const SwitchControl = ({
  checked = checked ,
  disabled = disabled,
  type = "string",
  value,
  required = false,
  multiline = false,
  error = false,
  message = "",
  label = "",
  itemCount = 1,
  minRows = 1,
  maxRows = 10,
  helperText = "",
  inputProps,
  onChange,
  style = { width: "100%" },
  ...other
}) => {
  return (
    <StyledSwitch>
    <Switch
      disabled = {true}
      defaultChecked 
      required
      multiline
      error
      message
      label
      itemCount
      minRows
      maxRows
      helperText
      inputProps
      onChange
      style={style}
      />
    </StyledSwitch>
)}
export default memo(SwitchControl);
