import React, { Children, memo, isValidElement } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material/";
import { DropDownMenuProps } from "../../../../Common/constants";

const SelectorControl = ({
  label = "",
  value = "",
  message = "",
  list = [],
  multiple = false,
  required = false,
  error = false,
  valueName = "",
  displayName,
  renderValue,
  onChange = {},
  children,
  itemCount = 1,
  style = { width: "100%" },
  disabled = false,
  ...rest
}) => {
  const count = Children.count(children);
  const isLabelComponent = isValidElement(label);

  const items = count
    ? children
    : list?.map((item, index) => (
        <MenuItem key={index} value={item[valueName]} {...rest}>
          {children}
          {item[displayName]}
        </MenuItem>
      ));

  return (
    <Grid item xs={12} md={12 / itemCount}>
      <FormControl
        variant="standard"
        error={error}
        required={required}
        style={{ width: "100%" }}
        {...rest}
        disabled={disabled}
      >
        <InputLabel>{label}</InputLabel>
        <Select
          multiple={multiple}
          value={value}
          error={error}
          renderValue={renderValue}
          style={style}
          onChange={onChange}
          {...(isLabelComponent ? { label } : { labelId: label })}
          {...rest}
          // {...(multiple && { DropDownMenuProps: dropDownMenuProps })}
        >
          {items}
        </Select>
        {error && message && <FormHelperText>{message}</FormHelperText>}
      </FormControl>
    </Grid>
  );
};
export default memo(SelectorControl);
