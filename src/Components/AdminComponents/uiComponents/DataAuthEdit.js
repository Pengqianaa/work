import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormControl, MenuItem, Checkbox, Chip } from "@mui/material";
import UserQueryMui from "./UserQueryMui";
import CostCenterQuery from "src/Components/admin/common/unit/CostCenterQuery";
import { FilterGroup } from "../uiComponents/AdminCommonUis";
import ModalContainer from "../uiComponents/ModalContainer";
import { SelectorControl } from "../uiComponents/FormControls";
import styled from "styled-components";
import { Buttons, BUTTON_TYPES } from "../../common/index";
import { checkRequiredInputsAreEmptyOrNot } from "src/Common/commonMethod";

const ALL_INT = -1;
const ALL_STR = "-1";

export const INIT_SHOW_ERROR_MSGS = {
  user: false,
  area: false,
  brand: false,
  bgbu: false,
  costCenter: false,
};

const PillContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;
const SelectedPill = styled(Chip)`
  margin: 1px;
`;

const SelectedChip = styled(Chip)`
  margin-left: 4px;
`;
const DataAuthEdit = ({ show, toggle, focusUser, intl }) => {
  const dispatch = useDispatch();
  const areaList = useSelector((state) => state.query.areaList);
  const bgbuList = useSelector((state) => state.dataAuth.bgbuList);
  const brandList = useSelector((state) => state.query.brandList);
  const costDeptList = useSelector((state) => state.query.costDeptList);
  const userRoles = useSelector((state) => state.permission.userRoles);
  const [keyword, setKeyword] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCostDepts, setSelectedCostDepts] = useState([]);

  const [selectedBgbu, setSelectedBgbu] = useState([]);

  const [lock, setLock] = useState(false);

  const [error, setError] = useState(INIT_SHOW_ERROR_MSGS);

  useEffect(() => {
    !areaList.length && getAreaList();
    !bgbuList.length && getBgBuList();
    !brandList.length && getBrandList();
    !costDeptList.length && getCostDept();
  }, []);

  useEffect(() => {
    if (show) {
      if (focusUser && Object.keys(focusUser).length === 0) {
        setSelectedBgbu([]);
        setSelectedCostDepts([]);
        setSelectedBrands([]);
        setSelectedAreas([]);
        setUserInfo({});
        setKeyword("");
        setLock(false);
      } else {
        let { bus, costCenters, name, areas, brands, userId } = focusUser;

        setSelectedBgbu(bus.map((bu) => bu.id));
        setSelectedCostDepts(costCenters.map((c) => c.costDeptCode));
        setSelectedBrands(brands.map((brand) => brand.id));
        setSelectedAreas(areas.map((area) => area.id));
        setUserInfo({
          userId,
          fullName: name,
        });
        setKeyword(name);
        setLock(true);
      }
    }
  }, [show]);

  const getAreaList = () =>
    dispatch({
      type: "getAreaList",
      payload: true,
    });

  const getBgBuList = () =>
    dispatch({
      type: "getBgBuList",
      payload: true,
    });

  const getBrandList = () =>
    dispatch({
      type: "getBrandList",
      payload: true,
    });

  const getCostDept = () =>
    dispatch({
      type: "getCostDept",
      payload: true,
    });

  const handleSave = () => {
    const params = {
      user: userInfo,
      area: selectedAreas,
      brand: selectedBrands,
      bgbu: selectedBgbu,
    };
    if (checkRequiredInputsAreEmptyOrNot(params, setError)) {
      return;
    }
    //  BUG: 待修
    lock
      ? dispatch({
          type: "updateDataAuthUser",
          payload: { ...params, costCenter: selectedCostDepts },
        })
      : dispatch({
          type: "createDataAuthUser",
          payload: { ...params, costCenter: selectedCostDepts },
        });
    toggle(false);
  };
  const handleChange = (e) => {
    // console.warn('e.target.value', e.target.value)
    if (e.target.value.includes(ALL_STR) && !selectedAreas.includes(ALL_STR)) {
      setSelectedAreas([ALL_STR]);
    } else if (
      e.target.value.includes(ALL_STR) &&
      selectedAreas.includes(ALL_STR)
    ) {
      let arr = [...e.target.value];
      arr.splice(arr.indexOf(ALL_STR), 1);
      setSelectedAreas(arr);
    } else {
      setSelectedAreas(e.target.value);
    }
  };
  const handleChangeCostCenter = (v) => {
    // console.warn('e.target.value', e.target.value)
    // setSelectedCostDepts(e.target.value)
    let newList = [...selectedCostDepts];
    if (v) {
      newList.push(v);
    }
    if (v === "ALL") {
      newList = ["ALL"];
    }
    if (newList.includes("ALL") && v !== "ALL") {
      newList = [v];
    }

    setSelectedCostDepts(newList);
  };
  const handleChangeBrand = (e) => {
    // console.warn('e.target.value', e.target.value)
    if (e.target.value.includes(ALL_INT) && !selectedBrands.includes(ALL_INT)) {
      setSelectedBrands([ALL_INT]);
    } else if (
      e.target.value.includes(ALL_INT) &&
      selectedBrands.includes(ALL_INT)
    ) {
      let arr = [...e.target.value];
      arr.splice(arr.indexOf(ALL_INT), 1);
      setSelectedBrands(arr);
    } else {
      setSelectedBrands(e.target.value);
    }
  };
  const handleChangeBgbu = (e) => {
    // console.warn('e.target.value', e.target.value)
    if (e.target.value.includes(ALL_INT) && !selectedBgbu.includes(ALL_INT)) {
      setSelectedBgbu([ALL_INT]);
    } else if (
      e.target.value.includes(ALL_INT) &&
      selectedBgbu.includes(ALL_INT)
    ) {
      let arr = [...e.target.value];
      arr.splice(arr.indexOf(ALL_INT), 1);
      setSelectedBgbu(arr);
    } else {
      setSelectedBgbu(e.target.value);
    }
  };

  const renderValue = (originalList, selectedList, labelKey) => {
    if (selectedList.includes(ALL_INT) || selectedList.includes(ALL_STR)) {
      // 當選擇了 ALL 時，返回對應的文本
      return (
        <PillContainer>
          <SelectedPill label={intl.formatMessage({ id: `adminCommon.all` })} />
        </PillContainer>
      );
    }
  
    const list = originalList.filter((el) => selectedList.includes(el.id));
    return (
      <PillContainer>
        {list.map((el, index) => {
          return <SelectedPill key={index} label={el[labelKey]} />;
        })}
      </PillContainer>
    );
  };
  

  return (
    <ModalContainer
      open={show}
      setOpen={() => toggle(false)}
      title={intl.formatMessage({ id: "eformauth.modal" })}
      buttons={<Buttons type={BUTTON_TYPES.SAVE} onClick={handleSave} />}
    >
      <UserQueryMui
        intl={intl}
        keyword={keyword}
        setKeyword={setKeyword}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        isLock={lock}
        error={error.userInfo}
        message={intl.formatMessage({
          id: "adminCommon.errorMsg.user",
        })}
        required
      />

      <SelectorControl
        multiple={true}
        label={intl.formatMessage({ id: "adminCommon.area" })}
        value={selectedAreas}
        error={error.area}
        message={intl.formatMessage({
          id: "eformauth.errorMsg.area",
        })}
        renderValue={() => renderValue(areaList, selectedAreas, "areaEname")}
        // renderValue={(selectedAreas) => {
        //   if (selectedAreas.includes(ALL_STR)) {
        //     return (
        //       <PillContainer>
        //         <SelectedPill
        //           label={intl.formatMessage({ id: `adminCommon.all` })}
        //         />
        //       </PillContainer>
        //     );
        //   }
        //   let list = areaList.filter((el) => selectedAreas.includes(el.id));
        //   return (
        //     <PillContainer>
        //       {list.map((el, index) => {
        //         return <SelectedPill key={index} label={el.areaEname} />;
        //       })}
        //     </PillContainer>
        //   );
        // }}
        onChange={handleChange}
        required
      >
        <MenuItem value={ALL_STR}>
          <Checkbox
            style={{ color: "#0087DC" }}
            checked={selectedAreas.includes(ALL_STR)}
          />
          {intl.formatMessage({ id: `adminCommon.all` })}
        </MenuItem>
        {areaList.map((area, index) => (
          <MenuItem key={index} value={area.id}>
            <Checkbox
              style={{ color: "#0087DC" }}
              checked={selectedAreas.filter((e) => e === area.id).length > 0}
            />
            {area.areaEname}
          </MenuItem>
        ))}
      </SelectorControl>
      <SelectorControl
        multiple={true}
        label={intl.formatMessage({ id: "adminCommon.bgbu" })}
        value={selectedBgbu}
        error={error.bgbu}
        message={intl.formatMessage({
          id: "eformauth.errorMsg.bgbu",
        })}
        renderValue={() => renderValue(bgbuList, selectedBgbu, "bgbuName")}
        onChange={handleChangeBgbu}
        required
      >
        <MenuItem value={ALL_INT}>
          <Checkbox
            style={{ color: "#0087DC" }}
            checked={selectedBgbu.includes(ALL_INT)}
          />
          {intl.formatMessage({ id: `adminCommon.all` })}
        </MenuItem>
        {bgbuList.map((item, index) => {
          if (item.bgName) {
            return (
              <MenuItem key={index} value={item.id}>
                {item.bgShortName}
              </MenuItem>
            );
          } else {
            return (
              <MenuItem key={index} value={item.id}>
                <Checkbox
                  style={{ color: "#0087DC" }}
                  checked={
                    selectedBgbu.filter((e) => e === item.buId).length > 0
                  }
                />
                {item.buShortName}
              </MenuItem>
            );
          }
        })}
      </SelectorControl>
      <FormControl
        variant="standard"
        required
        style={{ width: "100%", paddingLeft: "16px", paddingTop: "16px" }}
      >
        <CostCenterQuery
          setInfo={handleChangeCostCenter}
          intl={intl}
        ></CostCenterQuery>
        <FilterGroup
          style={{ width: "100%", display: "flex", flexWrap: "wrap" }}
        >
          {selectedCostDepts.includes("ALL") && (
            <SelectedChip
              size="small"
              style={{ margin: "4px" }}
              label={intl.formatMessage({ id: `adminCommon.all` })}
              onDelete={() => {
                setSelectedCostDepts([]);
              }}
            />
          )}
          {!selectedCostDepts.includes("ALL") &&
            costDeptList.map((el) => {
              if (!selectedCostDepts.includes(el.costDeptCode)) {
                return null;
              }
              return (
                <SelectedChip
                  size="small"
                  key={el.costDeptCode}
                  label={`${el.costDeptCode}`}
                  style={{ margin: "4px" }}
                  onDelete={() => {
                    setSelectedCostDepts([
                      ...selectedCostDepts.filter((e) => e !== el.costDeptCode),
                    ]);
                  }}
                />
              );
            })}
        </FilterGroup>
      </FormControl>
      <SelectorControl
        multiple={true}
        label={intl.formatMessage({ id: "adminCommon.brand" })}
        value={selectedBrands}
        error={error.brand}
        message={intl.formatMessage({
          id: "eformauth.errorMsg.brand",
        })}
        renderValue={() => renderValue(brandList, selectedBrands, "brandName")}
        onChange={handleChangeBrand}
        required
      >
        <MenuItem value={ALL_INT}>
          <Checkbox
            style={{ color: "#0087DC" }}
            checked={selectedBrands.includes(ALL_INT)}
          />
          {intl.formatMessage({ id: `adminCommon.all` })}
        </MenuItem>
        {brandList.map((brand, index) => (
          <MenuItem key={index} value={brand.id}>
            <Checkbox
              style={{ color: "#0087DC" }}
              checked={selectedBrands.filter((e) => e === brand.id).length > 0}
            />
            {brand.brandName}
          </MenuItem>
        ))}
      </SelectorControl>
    </ModalContainer>
  );
};

export default DataAuthEdit;
