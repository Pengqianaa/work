import { useEffect, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { InputLabel, Select, MenuItem, Checkbox } from "@mui/material";
import { FilterContainer } from "../../StyledUnits";
import { ALL, LATEST } from "src/constants/common";
import { ACTIONS } from "src/Reducers/admin/CostCenterReducer";

const KEY = "areaName";

const CostCenterAreaSelector = ({
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
  const areas = useSelector((state) => state.costCenter.areaMap[_year] ?? []);
  // NOTE: 若有語系之分, 即可用到
  // const locale = useSelector((state) => state.view.currentLocale);
  // const key = locale.toLowerCase().includes("en") ? "areaEname" : "areaCname";
  const list = [
    showAllOption && {
      areaId: ALL,
      [KEY]: ALL,
    },
    ...areas,
  ];

  useEffect(() => {
    if (!!areas.length) {
      return;
    }

    dispatch({
      type: ACTIONS.GET_AREA_LIST,
      payload: { year },
    });
  }, [year]);

  const checked = (value, comparison) => value.includes(comparison);

  return (
    <FilterContainer>
      <InputLabel id="area-select-label">
        <FormattedMessage id="ADMIN.COMMON.FORM_CONTROL_LABEL.AREA" />
      </InputLabel>
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
          list.map((area, index) => {
            return (
              <MenuItem key={`${area[KEY]}-${index}`} value={area[KEY]}>
                {showCheckbox && (
                  <Checkbox
                    color="var(----delta-blue)"
                    checked={checked(value, area[KEY])}
                  />
                )}
                {!area[KEY] ? (
                  ""
                ) : area[KEY] === ALL ? (
                  <FormattedMessage id="ADMIN.COMMON.TEXT.ALL" />
                ) : (
                  area[KEY]
                )}
              </MenuItem>
            );
          })
        )}
      </Select>
    </FilterContainer>
  );
};

CostCenterAreaSelector.propTypes = {
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

export default memo(CostCenterAreaSelector);
