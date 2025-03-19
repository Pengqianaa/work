import { memo } from "react";
import { useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { InputLabel, Select, MenuItem, Checkbox } from "@mui/material";
import { FilterContainer } from "../../StyledUnits";
import { ALL, LATEST } from "src/constants/common";

const KEY = "buName";

const CostCenterBuSelector = ({
  showAllOption = true,
  showCheckbox = true,
  multiple = false,
  year,
  selectedBgName,
  value,
  onChange,
  renderValue,
}) => {
  const _year = year ?? LATEST;
  const buList = useSelector((state) => {
    const buMap = state.costCenter.buMap[_year];

    if (!buMap || !Object.keys(buMap)?.length) {
      return [];
    }
    return selectedBgName ? buMap[selectedBgName] : buMap[ALL];
  });
  const list = [
    showAllOption && {
      buId: ALL,
      [KEY]: ALL,
    },
    ...(buList ? buList : []),
  ];

  const checked = (value, comparison) =>
    !!value.filter((_value) => _value === comparison).length;

  return (
    <FilterContainer>
      <InputLabel id="area-select-label">BU</InputLabel>
      <Select
        id="area-select"
        variant="standard"
        labelId="area-select-label"
        multiple={multiple}
        value={value}
        onChange={onChange}
        {...(renderValue && { renderValue })}
      >
        {!list?.length ? (
          <MenuItem value="">
            <FormattedMessage id="ADMIN.COMMON.TEXT.NO_DATA" />
          </MenuItem>
        ) : (
          list.map((bu, index) => {
            return (
              <MenuItem key={`${bu[KEY]}-${index}`} value={bu[KEY]}>
                {showCheckbox && (
                  <Checkbox
                    color="var(----delta-blue)"
                    checked={checked(value, bu[KEY])}
                  />
                )}
                {!bu[KEY] ? (
                  ""
                ) : bu[KEY] === ALL ? (
                  <FormattedMessage id="ADMIN.COMMON.TEXT.ALL" />
                ) : (
                  bu[KEY]
                )}
              </MenuItem>
            );
          })
        )}
      </Select>
    </FilterContainer>
  );
};

CostCenterBuSelector.propTypes = {
  showAllOption: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  multiple: PropTypes.bool,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedBgName: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
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

export default memo(CostCenterBuSelector);
