import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { BUTTON_TYPES, Buttons } from "src/Components/common";
import {
  CostCenterBgSelector,
  CostCenterBuSelector,
  CostCenterQuery,
  RoleSelector,
  TableHeadContainer,
  FilterGroup,
  FilterContainer,
  TextFieldControl,
} from "src/Components/admin/common";
import { BG_BU_SELECTOR_TYPE } from "src/constants/common";
import { SearchInput } from "src/Components/AdminComponents/uiComponents/AdminCommonUis";
import { styled } from "@mui/material/styles";
import EditSWAuthorityMgt from "../../../AdminComponents/uiComponents/EditSWAuthorityMgt2";
import { ACTIONS } from "src/Reducers/admin/SWCollectionMgt/SWAuthorityMgtReducer";
// import ModifySWAuthorityModal from "./ModifySWAuthorityModal";

const StyledSpan = styled("span")(({ theme }) => ({
  marginBlock: 0,
  marginInline: theme.spacing(2),
}));

const StyledFilterGroup = styled(FilterGroup)({
  alignItems: "center",
});

const SEARCH_PARAMS = {
  BG: "bg",
  BU: "bu",
  COST_CENTER: "costCenter",
  ROLE: "role",
  KEYWORD: "keyword",
};

const SearchQueries = ({ params, setParams, onSearch }) => {
  const intl = useIntl();
  const [openEdit, setOpenEdit] = useState(false);
  const [editTarget, setEditTarget] = useState({});
  const [info, setInfo] = useState({});
  const exportDisable = useSelector((state) => state.SWAuthMgt.authMgtExportDisable);
  const uploadDisable = useSelector((state) => state.SWAuthMgt.authMgtUploadDisable);
  const handleAdd = () => {
    setEditTarget({});
    setOpenEdit(true);
  };
  const dispatch = useDispatch();

  const exportSwAuthorityMgtList = useSelector(
    (state) => state.swCollection.exportSwAuthorityMgtList
  );

  const handleChangeCostCenter = (v) => {
    setInfo(v);
    setParams((prev) => ({
      ...prev,
      pageNum: 0,
      costCenter: v,
    }));
  };

  const onChange = (event, type) => {
    if (!event) {
      return;
    }
    setParams((prev) => ({
      ...prev,
      pageNum: 0,
      [type]: event.target.value,
    }));
  };

  const onClickDownloadExample = () => {
    dispatch({
      type: ACTIONS.DOWNLOAD_AUTH_MGT_EXCEL,
    });
  };

  const onClickImport = (file) => {
    dispatch({ type:  ACTIONS.UPLOAD_AUTH_MGT_EXCEL, payload: { file } });
  };

  const getRoleList = () => {
    dispatch({
      type: "getSWRoles",
    });
  };

  useEffect(() => {
    if (exportSwAuthorityMgtList.length > 0) {
      onClickExport();
    }
  }, [exportSwAuthorityMgtList]);

  const onClickExport = () => {
    dispatch({
      type: ACTIONS.EXPORT_AUTH_MGT_EXCEL,
      payload: { pageSize:0 },
    });
  };
  
  return (
    <>
      <TableHeadContainer>
        <StyledFilterGroup>
          <StyledSpan></StyledSpan>
        </StyledFilterGroup>
        <StyledFilterGroup>
          <Buttons
            type={BUTTON_TYPES.DOWNLOAD_EXAMPLE}
            onClick={onClickDownloadExample}
            // disabled={true}
          />
          <StyledSpan>
            <FormattedMessage id="ADMIN.COMMON.TEXT.EXCEL_BATCH_IMPORT" />
          </StyledSpan>
          <Buttons
            type={BUTTON_TYPES.IMPORT}
            onUpload={onClickImport}
            disabled={uploadDisable}
          />
        </StyledFilterGroup>
      </TableHeadContainer>
      <TableHeadContainer>
        <FilterGroup>
          <CostCenterBgSelector
            showCheckbox={false}
            value={params[SEARCH_PARAMS.BG] ?? ""}
            onChange={(event) => onChange(event, SEARCH_PARAMS.BG)}
          />
          <CostCenterBuSelector
            showCheckbox={false}
            value={params[SEARCH_PARAMS.BU] ?? ""}
            selectedBgName={params[SEARCH_PARAMS.BG] ?? ""}
            onChange={(event) => onChange(event, SEARCH_PARAMS.BU)}
          />
          <FilterContainer>
            {/* <CostCenterQuery
              setInfo={handleChangeCostCenter}
              intl={intl}
              label={intl.formatMessage({
                id: "ADMIN.COMMON.FORM_CONTROL_LABEL.COST_CENTER",
              })}
              value={params[SEARCH_PARAMS.COST_CENTER] ?? ""}
              // onChange={(event) => onChange(event, SEARCH_PARAMS.COST_CENTER)}
            /> */}
              <TextFieldControl
                label={intl.formatMessage({
                  id: "ADMIN.COMMON.FORM_CONTROL_LABEL.COST_CENTER",
                })}
                value={params[SEARCH_PARAMS.COST_CENTER] ?? ""}
                onChange={(event) => onChange(event, SEARCH_PARAMS.COST_CENTER)}
                style={{ width: 120 }}
              />
          </FilterContainer>
          <RoleSelector
            type={BG_BU_SELECTOR_TYPE.SW}
            showCheckbox={false}
            value={params[SEARCH_PARAMS.ROLE] ?? ""}
            onChange={(event) => onChange(event, SEARCH_PARAMS.ROLE)}
            getRoleList={getRoleList}
          />
        </FilterGroup>
        <StyledFilterGroup>
          <Buttons type={BUTTON_TYPES.SEARCH} onClick={onSearch} />
          <Buttons
            type={BUTTON_TYPES.EXPORT}
            onClick={onClickExport}
            style={{ marginLeft: 14 }}
            disabled={exportDisable}
          />
        </StyledFilterGroup>
      </TableHeadContainer>
      <TableHeadContainer>
        <StyledFilterGroup>
          <Buttons type={BUTTON_TYPES.ADD} onClick={handleAdd} />
        </StyledFilterGroup>
        <StyledFilterGroup>
          <SearchInput
            value={params[SEARCH_PARAMS.KEYWORD] ?? ""}
            onChange={(event) => onChange(event, SEARCH_PARAMS.KEYWORD)}
            className="searchinput"
            placeholder={intl.formatMessage({ id: "adminCommon.keyword" })}
          ></SearchInput>
        </StyledFilterGroup>
      </TableHeadContainer>
      <EditSWAuthorityMgt
        key={openEdit}
        show={openEdit}
        intl={intl}
        item={editTarget}
        toggleFunc={setOpenEdit}
      />
       {/* {openEdit && <ModifySWAuthorityModal show={openEdit} toggleFunc={setOpenEdit} item={editTarget} intl={intl}/>} */}
    </>
  );
};

export default SearchQueries;
