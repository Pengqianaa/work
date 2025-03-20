import React, { memo } from "react";
import { styled } from "@mui/material/styles";
import { Grid, FormControl, TextField } from "@mui/material/";
const PREFIX = "TextFieldControl";

const classes = {
  root: `${PREFIX}-root`,
};

const StyledGrid = styled(Grid)({
  [`& .${classes.root}`]: {
    width: "100%",
  },
});

const TextFieldControl = ({
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
    <StyledGrid item xs={12} md={12 / itemCount}>
      <FormControl
        className={classes.root}
        error={error}
        required={required}
        {...other}
      >
        <TextField
          variant="standard"
          type={type}
          label={label}
          value={value}
          error={error}
          required={required}
          multiline={multiline}
          minRows={minRows}
          maxRows={maxRows}
          helperText={error && message ? message : helperText}
          inputProps={inputProps}
          onChange={onChange}
          style={style}
          {...other}
        />
      </FormControl>
    </StyledGrid>
  );
};

export default memo(TextFieldControl);
