import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { ErrorIcon, BUTTON_TYPES, Buttons } from "src/Components/common";
import {
  CostCenterBgSelector,
  CostCenterBuSelector,
  YearVersionSelector,
  TableHeadContainer,
  FilterGroup,
  FilterContainer,
  TextFieldControl,
  BrandSelector,
} from "src/Components/admin/common";
import { QueryOrDownloadCols } from "src/constants/admin/SWCollection";
import { styled } from "@mui/material/styles";
import { ACTIONS } from "src/Reducers/admin/SWCollection/SWReportReducer";

const StyledFilterGroup = styled(FilterGroup)({
  alignItems: "center",
});

const SEARCH_PARAMS = {
  YEAR: "year",
  BG: "bg",
  BU: "bu",
  COST_CENTER: "costCenter",
  PRODUCT_NAME: "productName",
  BRAND: "brand",
};

const SearchQueries = ({ params, setParams, onSearch }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const lockParams = useSelector((state) => state.SWReport.lockParams);
  const exportDisable = useSelector((state) => state.SWReport.queryOrDownloadExportDisable);
  const userFlag = useSelector((state) => state.SWReport.userFlag);

  const onChange = (event, type) => {
    if (!event) {
      return;
    }
    setParams((prev) => ({
      ...prev,
      pageNumber: 0,
      [type]:
        SEARCH_PARAMS.YEAR === type ? new Date(event) : event.target.value,
    }));
  };

  const onClickExport = () => {
    const _params = {
      ...params,
      year: params.year.getFullYear(),
      userFlag:userFlag,
    };
    dispatch({
      type: ACTIONS.EXPORT_SW_COLLECTION_EXCEL,payload: _params 
    });
  };

  const onClickTemplate = (file) => {
    dispatch({ type: ACTIONS.UPLOAD_TEMPLATE_EXCEL, payload: { file } });
  };
  

  const onClickLock = () => {
    dispatch({ type: "SET_SW_REPORT_LOCK", payload: {lockIds:lockParams.lockList, unLockIds:lockParams.unLockList}});
   };

  return (
    <>
      <TableHeadContainer>
        <StyledFilterGroup>
          <ErrorIcon />
          <FormattedMessage id="ADMIN.SW_COLLECTION.SW_COLLECTION_REPORT.TIPS" />
        </StyledFilterGroup>
        <StyledFilterGroup>
        </StyledFilterGroup>
      </TableHeadContainer>
      <TableHeadContainer>
        <FilterGroup>
          <YearVersionSelector
            value={params[SEARCH_PARAMS.YEAR]}
            onChange={(event) => onChange(event, SEARCH_PARAMS.YEAR)}
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
          <Buttons
            type={BUTTON_TYPES.TEMPLATE}
            onClick={ ()=>{}}
            onUpload={onClickTemplate}
            style={{ marginLeft: 14 }}
          />
          <Buttons
            disabled={!(Object.keys(lockParams).length > 0)}
            type={BUTTON_TYPES.LOCK_UPDATE}
            onClick={onClickLock}
            style={{ marginLeft: 14 }}
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
            <TextFieldControl
              label={intl.formatMessage({
                id: "ADMIN.COMMON.FORM_CONTROL_LABEL.COST_CENTER",
              })}
              value={params[SEARCH_PARAMS.COST_CENTER] ?? ""}
              onChange={(event) => onChange(event, SEARCH_PARAMS.COST_CENTER)}
              style={{ width: 120 }}
            />
          </FilterContainer>
          <BrandSelector
            showCheckbox={false}
            value={params[SEARCH_PARAMS.BRAND] ?? ""}
            onChange={(event) => onChange(event, SEARCH_PARAMS.BRAND)}
          />
          <TextFieldControl
            label={intl.formatMessage({
                  id: "ADMIN.COMMON.FORM_CONTROL_LABEL.PRODUCT_NAME",
            })}
            value={params[SEARCH_PARAMS.PRODUCT_NAME] ?? ""}
            onChange={(event) => onChange(event, SEARCH_PARAMS.PRODUCT_NAME)}
            style={{ width: 120 }}
          />
        </FilterGroup>
      </TableHeadContainer>
    </>
  );
};

export default SearchQueries;
