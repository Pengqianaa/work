import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import { FormControl, MenuItem, Checkbox, Chip } from "@mui/material";
import {
  Buttons,
  BUTTON_TYPES,
  ModalContainer,
} from "src/Components/common/index";
import {
  SelectorControl,
  FilterGroup,
  CostCenterQuery,
  UserQueryMui,
} from "src/Components/admin/common/index";
import { MODIFY_ACTION_TYPE } from "src/constants/common";
import {
  ACTIONS,
  INIT_MODIFIED_DATA,
} from "src/Reducers/admin/AuthorizationMgtReducer";
import { checkRequiredInputsAreEmptyOrNot } from "src/Common/commonMethod";
import styled from "styled-components";

const ALL_INT = -1;
const ALL_STR = "-1";

export const INIT_SHOW_ERROR_MSGS = {
  userInfo: false,
  areaIds: false,
  buIds: false,
  brandIds: false,
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

const ModIfyAuthorizationMgtModal = ({ show, toggle }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { areaList, brandList, costDeptList } = useSelector(
    (state) => state.query
  );
  const { modifyData, bgbuList } = useSelector(
    (state) => state.authorizationMgt
  );

  const [lock, setLock] = useState(false);
  const [error, setError] = useState(INIT_SHOW_ERROR_MSGS);
  const [params, setParams] = useState({ ...modifyData });
  const [keyword, setKeyword] = useState(modifyData.name);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    !areaList.length && getAreaList();
    !bgbuList.length && getBgBuList();
    !brandList.length && getBrandList();
    !costDeptList.length && getCostDept();

    const userId = modifyData?.userId;

    setLock(!!userId);

    if (userId) {
      setUserInfo({
        userId: modifyData.userId,
        fullName: modifyData.name,
      });
    }

    return () => {
      dispatch({
        type: ACTIONS.SET_MODIFIED_AUTHORIZATION_MGT,
        payload: INIT_MODIFIED_DATA,
      });
    };
  }, []);

  const getAreaList = () =>
    dispatch({
      type: "getAreaList",
      payload: true,
    });

  const getBgBuList = () =>
    dispatch({
      type: ACTIONS.GET_BGBU_LIST,
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

  const handleChangeArea = (e) => {
    let result = e.target.value;
    if (result.includes(ALL_STR) && !params.areaIds.includes(ALL_STR)) {
      result = [ALL_STR];
    } else if (result.includes(ALL_STR) && params.areaIds.includes(ALL_STR)) {
      result.splice(result.indexOf(ALL_STR), 1);
    }

    setParams((prev) => ({
      ...prev,
      areaIds: result,
    }));
  };
  const handleChangeCostCenter = (v) => {
    let result = [...params.costCenters, v];
    if (v === "ALL") {
      result = ["ALL"];
    } else if (v !== "ALL" && result.includes("ALL")) {
      result = [v];
    }

    setParams((prev) => ({
      ...prev,
      costCenters: [...new Set(result)],
    }));
  };
  const handleChangeBrand = (e) => {
    let result = e.target.value;
    if (result.includes(ALL_INT) && !params.brandIds.includes(ALL_INT)) {
      result = [ALL_INT];
    } else if (result.includes(ALL_INT) && params.brandIds.includes(ALL_INT)) {
      result.splice(result.indexOf(ALL_INT), 1);
    }

    setParams((prev) => ({ ...prev, brandIds: result }));
  };
  const handleChangeBu = (e) => {
    let result = e.target.value;

    if (result.includes(ALL_INT) && !params.buIds.includes(ALL_INT)) {
      result = [ALL_INT];
    } else if (result.includes(ALL_INT) && params.buIds.includes(ALL_INT)) {
      result.splice(result.indexOf(ALL_INT), 1);
    }

    setParams((prev) => ({
      ...prev,
      buIds: result,
    }));
  };

  const handleSave = () => {
    const _params = {
      ...params,
      userId: userInfo.userId,
      empCode: userInfo.userId === null ? userInfo.empCode : null,
    };

    if (checkRequiredInputsAreEmptyOrNot(params, setError)) {
      return;
    }

    dispatch({
      type: ACTIONS.POST_AUTHORIZATION_MGT,
      payload: {
        action: lock ? MODIFY_ACTION_TYPE.EDIT : MODIFY_ACTION_TYPE.ADD,
        data: _params,
      },
    });
    toggle(false);
  };

  const renderValue = (originalList, selectedList, labelKey) => {
    if (selectedList.includes(ALL_STR) || selectedList.includes(ALL_INT)) {
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
        value={params.areaIds}
        error={error.areaIds}
        message={intl.formatMessage({
          id: "eformauth.errorMsg.area",
        })}
        renderValue={() => renderValue(areaList, params.areaIds, "areaEname")}
        onChange={handleChangeArea}
        required
      >
        <MenuItem value={ALL_STR}>
          <Checkbox
            style={{ color: "#0087DC" }}
            checked={params.areaIds.includes(ALL_STR)}
          />
          {intl.formatMessage({ id: `adminCommon.all` })}
        </MenuItem>
        {areaList.map((area, index) => (
          <MenuItem key={index} value={area.id}>
            <Checkbox
              style={{ color: "#0087DC" }}
              checked={params.areaIds.filter((e) => e === area.id).length > 0}
            />
            {area.areaEname}
          </MenuItem>
        ))}
      </SelectorControl>
      <SelectorControl
        multiple={true}
        label={intl.formatMessage({ id: "adminCommon.bgbu" })}
        value={params.buIds}
        error={error.buIds}
        message={intl.formatMessage({
          id: "eformauth.errorMsg.bgbu",
        })}
        renderValue={() => renderValue(bgbuList, params.buIds, "bgbuName")}
        onChange={handleChangeBu}
        required
      >
        <MenuItem value={ALL_INT}>
          <Checkbox
            style={{ color: "#0087DC" }}
            checked={params.buIds.includes(ALL_INT)}
          />
          {intl.formatMessage({ id: `adminCommon.all` })}
        </MenuItem>
        {bgbuList.map((item, index) => (
          <MenuItem key={index} value={item.id}>
            {item.bgName ? (
              item.bgShortName
            ) : (
              <>
                <Checkbox
                  style={{ color: "#0087DC" }}
                  checked={
                    params.buIds.filter((e) => e === item.buId).length > 0
                  }
                />
                {item.buShortName}
              </>
            )}
          </MenuItem>
        ))}
      </SelectorControl>
      <FormControl
        variant="standard"
        style={{ width: "100%", paddingLeft: "16px", paddingTop: "16px" }}
      >
        <CostCenterQuery setInfo={handleChangeCostCenter} intl={intl} />
        <FilterGroup
          style={{ width: "100%", display: "flex", flexWrap: "wrap" }}
        >
          {params.costCenters.includes("ALL") && (
            <SelectedChip
              size="small"
              style={{ margin: "4px" }}
              label={intl.formatMessage({ id: `adminCommon.all` })}
              onDelete={() => {
                debugger;
                setParams((prev) => ({
                  ...prev,
                  costCenters: [],
                }));
              }}
            />
          )}
          {!params.costCenters.includes("ALL") &&
            costDeptList.map((el) => {
              if (!params.costCenters.includes(el.costDeptCode)) {
                return null;
              }
              return (
                <SelectedChip
                  size="small"
                  key={el.costDeptCode}
                  label={el.costDeptCode}
                  style={{ margin: "4px" }}
                  onDelete={() => {
                    debugger;
                    setParams((prev) => ({
                      ...prev,
                      costCenters: [
                        ...params.costCenters.filter(
                          (e) => e !== el.costDeptCode
                        ),
                      ],
                    }));
                  }}
                />
              );
            })}
        </FilterGroup>
      </FormControl>
      <SelectorControl
        multiple={true}
        label={intl.formatMessage({ id: "adminCommon.brand" })}
        value={params.brandIds}
        error={error.brandIds}
        message={intl.formatMessage({
          id: "eformauth.errorMsg.brand",
        })}
        renderValue={() => renderValue(brandList, params.brandIds, "brandName")}
        onChange={handleChangeBrand}
        required
      >
        <MenuItem value={ALL_INT}>
          <Checkbox
            style={{ color: "#0087DC" }}
            checked={params.brandIds.includes(ALL_INT)}
          />
          {intl.formatMessage({ id: `adminCommon.all` })}
        </MenuItem>
        {brandList.map((brand, index) => (
          <MenuItem key={index} value={brand.id}>
            <Checkbox
              style={{ color: "#0087DC" }}
              checked={params.brandIds.filter((e) => e === brand.id).length > 0}
            />
            {brand.brandName}
          </MenuItem>
        ))}
      </SelectorControl>
    </ModalContainer>
  );
};

export default ModIfyAuthorizationMgtModal;
