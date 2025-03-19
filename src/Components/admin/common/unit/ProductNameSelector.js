import { useState, useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { InputLabel, Select, MenuItem, Checkbox } from "@mui/material";
import { FilterContainer } from "../StyledUnits";
import { ALL } from "src/constants/common";

const ProductNameSelector = ({
  showAllOption = true,
  showCheckbox = true,
  multiple = false,
  value,
  selectedBrandId,
  onChange,
  renderValue,
}) => {
  const dispatch = useDispatch();
  const swNewBrandList = useSelector((state) => state.swCollection.swBrandList);
  const swProductNameList = useSelector((state) => state.swCollection.swProductNameList);
  const noData = !swProductNameList?.length;
  useEffect(() => {
    getSwProductNameList();
  }, [selectedBrandId]);

  const getSwProductNameList = () => {
    let brandId = ''
    let swCollectionBrandId = ''
    if(selectedBrandId.toString().length > 6){
      let selectOption = swNewBrandList.find(option => option.brandId === selectedBrandId);
      swCollectionBrandId = selectOption.swCollectionBrandId
    }else{
      brandId = selectedBrandId
    }
    dispatch({
      type: "getSWProductNameList",
      payload: { brandId , swCollectionBrandId },
    })
  };

  

  const checked = (value, comparison) =>
    !!value.filter((_value) => _value === comparison).length;

  return (
    <FilterContainer>
      <InputLabel id="area-select-label"><FormattedMessage id="ADMIN.COMMON.FORM_CONTROL_LABEL.PRODUCT_NAME" /></InputLabel>
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
          swProductNameList.map((item,index) => {
            return (
              <MenuItem key={index+"product"} value={item["assetId"]}>
                {showCheckbox && (
                  <Checkbox
                    color="var(----delta-blue)"
                    checked={checked(value, item["productName"])}
                  />
                )}
                {item["productName"]}
              </MenuItem>
            );
          })}
      </Select>
    </FilterContainer>
  );
};

ProductNameSelector.propTypes = {
  showAllOption: PropTypes.bool,
  multiple: PropTypes.bool,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // selectedBrandId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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

export default memo(ProductNameSelector);
