import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { InputLabel, Select, MenuItem, Checkbox } from "@mui/material";
import { FilterContainer } from "../../StyledUnits";
import { connect, useSelector } from "react-redux";
const KEY = "areaName";

const RegionAreaSelector = ({
  showAllOption = true,
  showCheckbox = true,
  selectOptionAll = false,
  multiple = true,
  getAreaList,
  areaList,
  area,
  onChange,
  renderValue,
  defaultSearch,
}) => {
  const ALL_VALUE = "ALL";
  const SEPARATOR = ",";

  const [defaultAreaId, setDefaultAreaId] = useState(area || []);
  let user = useSelector((state) => state.user.user);

  useEffect(() => {
    getAreaList();
    if (!!areaList.length) {
      return;
    }
  }, []);

  useEffect(() => {
    if (areaList.length > 0) {
      let areaDefaultArr = [];
      let userArea = user.area;
      areaDefaultArr = areaList.filter(
        (areaItem) => areaItem.areaEname === userArea
      );
      if (areaDefaultArr.length > 0) {
        setDefaultAreaId([areaDefaultArr[0].id]);
      }
    }
  }, [areaList]);

  function renderValue(selected) {
    if (!Array.isArray(selected)) {
      selected = selected.split(SEPARATOR);
    }

    if (selected.includes(ALL_VALUE)) {
      return ALL_VALUE;
    }

    const select = selected
      .map((id) => areaList.find((area) => area.id === id))
      .filter((area) => area !== undefined)
      .map((area) => area.areaEname);

    return select.join(SEPARATOR);
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    let newSelection = [...value];

    if (newSelection.includes(ALL_VALUE) &&newSelection[0] !== ALL_VALUE) {
      if (defaultAreaId.includes(ALL_VALUE)) {
        // 如果当前选中 ALL，则取消 ALL
        newSelection = [];
      } else {
        // 如果当前未选中 ALL，则仅选中 ALL，清空其他选项
        newSelection = [ALL_VALUE];
      }
    } else {
       // 取消ALL 再選擇ALL的情況
       if(newSelection.includes(ALL_VALUE) && newSelection.length === 1){
        newSelection = [ALL_VALUE];
      }else{
        newSelection = newSelection.filter((id) => id !== ALL_VALUE);
      }
    }

    // 更新状态
    setDefaultAreaId(newSelection);

    // 触发外部的回调函数
    if (onChange) {
      onChange(newSelection);
    }
  };

  return (
    <FilterContainer>
      <InputLabel id="brand-select-label">
        <FormattedMessage id="adminCommon.regionArea" />
      </InputLabel>
      <Select
        variant="standard"
        multiple={multiple}
        labelId="area-select-label"
        id="area-select"
        value={defaultAreaId}
        onChange={handleChange}
        renderValue={(selected) => renderValue(selected)}
      >
        {areaList.length > 0 && multiple && (
          <MenuItem value={ALL_VALUE}>
            <Checkbox
              style={{ color: "#0087DC" }}
              checked={defaultAreaId.includes(ALL_VALUE)}
            />
            <FormattedMessage id={`adminCommon.all`} />
          </MenuItem>
        )}
        {areaList.map((el, index) => {
          return (
            <MenuItem key={el.id + index} value={el.id}>
              {multiple && (
                <Checkbox
                  style={{ color: "#0087DC" }}
                  checked={defaultAreaId.includes(el.id)}
                />
              )}
              {el.areaEname}
            </MenuItem>
          );
        })}
      </Select>
    </FilterContainer>
  );
};

const mapStateToProps = (state) => ({
  areaList: state.query.areaList,
});

const mapDispatchToProps = (dispatch) => ({
  getAreaList: () =>
    dispatch({
      type: "getAreaList",
    }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegionAreaSelector);
