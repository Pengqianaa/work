import { useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { InputLabel, Select, MenuItem, Checkbox } from "@mui/material";
import { FilterContainer } from "../StyledUnits";
import { ALL } from "src/constants/common";

const BrandSelector = ({
  showAllOption = true,
  showCheckbox = true,
  multiple = false,
  value,
  onChange,
  renderValue,
}) => {
  const dispatch = useDispatch();
  const brandList = useSelector((state) => state.swCollection.swBrandList);
  const noData = ! brandList?.length;

  useEffect(() => {
    getBrandList();
    if ( brandList.length) {
      return;
    }
  }, []);

  const getBrandList = () => {
    dispatch({
      type: "getSWBrandList",
    });
  };

  const checked = (value, comparison) =>
    !!value.filter((_value) => _value === comparison).length;

  return (
    <FilterContainer>
      <InputLabel id="brand-select-label"><FormattedMessage id="ADMIN.COMMON.FORM_CONTROL_LABEL.BRAND" /></InputLabel>
      <Select
        id="brand-select"
        variant="standard"
        labelId="brand-select-label"
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
          brandList.map((brand,index) => {
            return (
              <MenuItem key={index+"brandId"} value={brand["brandId"]}>
                {showCheckbox && (
                  <Checkbox
                    color="var(----delta-blue)"
                    checked={checked(value, brand["brandId"])}
                  />
                )}
                {brand["brandName"]}
              </MenuItem>
            );
          })}
      </Select>
    </FilterContainer>
  );
};

BrandSelector.propTypes = {
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

export default memo(BrandSelector);
