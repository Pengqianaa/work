import { memo } from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { InputLabel, Select, MenuItem } from "@mui/material";
import { FilterContainer } from "../../StyledUnits";
const CategoryList = [{ cateId: 1, text: "ALL" } , { cateId: 5, text: "Commercial" }, { cateId: 3, text: "Freeware" }];
const CategorySelector = ({
  value,
  onChange,
}) => {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    // 触发外部的回调函数
    if (onChange) {
      onChange(value);
    }
  };
  return (
    <FilterContainer>
      <InputLabel id="category-select-label">
        <FormattedMessage id="ADMIN.COMMON.FORM_CONTROL_LABEL.CATEGORY" />
      </InputLabel>
      <Select
        variant="standard"
        labelId="category-select-label"
        id="category-select"
        value={value}
        onChange={handleChange}
      >
        {CategoryList.map((item,index) => {
          return (
            <MenuItem key={index} value={item.cateId}>
              <FormattedMessage id={`main.${item.text}`} />
            </MenuItem>
          )
        })
        }
      </Select>
    </FilterContainer>
  );
};

CategorySelector.propTypes = {
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
};

export default memo(CategorySelector);
