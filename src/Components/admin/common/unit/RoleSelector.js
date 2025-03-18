import { useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { InputLabel, Select, MenuItem, Checkbox } from "@mui/material";
import { FilterContainer } from "../StyledUnits";
import { ALL, BG_BU_SELECTOR_TYPE } from "src/constants/common";

const RoleSelector = ({
  showAllOption = true,
  showCheckbox = true,
  multiple = false,
  value,
  onChange,
  renderValue,
  getRoleList,
}) => {
  const dispatch = useDispatch();
  // const roleKey = locale.toLowerCase().includes("en") ? "areaEname" : "areaNam";
  const roleList = useSelector((state) => state.swCollection.swRolesList);
  const noData = !roleList?.length;

  useEffect(() => {
    getRoleList();
    if (roleList.length) {
      return;
    }
  }, []);

  const checked = (value, comparison) =>
    !!value.filter((_value) => _value === comparison).length;

  return (
    <FilterContainer>
      <InputLabel id="area-select-label"><FormattedMessage id="ADMIN.COMMON.FORM_CONTROL_LABEL.ROLE" /></InputLabel>
      <Select
        id="area-select"
        variant="standard"
        labelId="area-select-label"
        multiple={multiple}
        value={value}
        onChange={onChange}
        {...(renderValue && { renderValue })}
      >
        {noData && (
          <MenuItem value="">
            <FormattedMessage id="ADMIN.COMMON.TEXT.NO_DATA" />
          </MenuItem>
        )}
        {!noData && showAllOption && (
          <MenuItem key={ALL} value={ALL}>
            {showCheckbox && (
              <Checkbox
                color="var(----delta-blue)"
                checked={checked(value, ALL)}
              />
            )}
            <FormattedMessage id="ADMIN.COMMON.TEXT.ALL" />
          </MenuItem>
        )}
        {!noData &&
          roleList.map((role,index) => {
            return (
              <MenuItem key={index+"roleId"} value={role["roleId"]}>
                {showCheckbox && (
                  <Checkbox
                    color="var(----delta-blue)"
                    checked={checked(value, role["roleName"])}
                  />
                )}
                {role["roleName"]}
              </MenuItem>
            );
          })}
      </Select>
    </FilterContainer>
  );
};

RoleSelector.propTypes = {
  showAllOption: PropTypes.bool,
  multiple: PropTypes.bool,
  value: function (props, propName, componentName) {
    let msg = "";
    const valueProp = props[propName];
    if (
      props.showCheckbox &&
      (typeof valueProp !== "object" ||
        (typeof valueProp === "object" && !Array.isArray(valueProp)))
    ) {
      msg = "Array";
    } else if (typeof valueProp !== "string" && typeof valueProp !== "number") {
      msg = "String or Number";
    }
    if (msg) {
      return new Error(
        `[${componentName}][Invalid prop: ${propName}] supplied to be ${msg}. Validation failed!`
      );
    }
  },
  onChange: PropTypes.func.isRequired,
  renderValue: PropTypes.func,
};

export default memo(RoleSelector);
