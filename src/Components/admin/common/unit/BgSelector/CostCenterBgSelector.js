import { useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { InputLabel, Select, MenuItem, Checkbox } from "@mui/material";
import { FilterContainer } from "../../StyledUnits";
import { ALL, LATEST } from "src/constants/common";
import { ACTIONS } from "src/Reducers/admin/CostCenterReducer";

const KEY = "bgName";

const CostCenterBgSelector = ({
  year,
  showAllOption = true,
  showCheckbox = true,
  multiple = false,
  value,
  onChange,
  renderValue,
}) => {
  const _year = year ?? LATEST;
  const dispatch = useDispatch();
  const bgList = useSelector((state) => state.costCenter.bgMap[_year] ?? []);
  const list = [
    showAllOption && {
      bgId: ALL,
      [KEY]: ALL,
    },
    ...bgList,
  ];

  useEffect(() => {
    if (bgList.length) {
      handleChange();
      return;
    }

    dispatch({
      type: ACTIONS.GET_BG_BU_MAP,
      payload: { year },
    });
  }, [year]);

  const checked = (value, comparison) =>
    !!value.filter((_value) => _value === comparison).length;

  const handleChange = (value) => {
    dispatch({
      type: "getCostCenterBuList",
      payload: !value ? ALL : value.target.value,
    });

    onChange(value);
  };

  return (
    <FilterContainer>
      <InputLabel id="bg-select-label">BG</InputLabel>
      <Select
        id="bg-select"
        variant="standard"
        labelId="bg-select-label"
        multiple={multiple}
        value={value}
        onChange={handleChange}
        {...(renderValue && { renderValue })}
      >
        {!list?.length ? (
          <MenuItem value="">
            <FormattedMessage id="ADMIN.COMMON.TEXT.NO_DATA" />
          </MenuItem>
        ) : (
          list.map((bg, index) => (
            <MenuItem key={`${bg[KEY]}-${index}`} value={bg[KEY]}>
              {showCheckbox && (
                <Checkbox
                  color="var(----delta-blue)"
                  checked={checked(value, bg[KEY])}
                />
              )}
              {!bg[KEY] ? (
                ""
              ) : bg[KEY] === ALL ? (
                <FormattedMessage id="ADMIN.COMMON.TEXT.ALL" />
              ) : (
                bg[KEY]
              )}
            </MenuItem>
          ))
        )}
      </Select>
    </FilterContainer>
  );
};

CostCenterBgSelector.propTypes = {
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showAllOption: PropTypes.bool,
  showCheckbox: PropTypes.bool,
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

export default memo(CostCenterBgSelector);
