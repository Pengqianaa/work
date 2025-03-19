import { useState, useEffect } from "react";
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
  ProductNameSelector,
  BrandSelector,
} from "src/Components/admin/common";
import { exportToExcel, generateTable } from "src/Common/commonMethod";
import { QueryOrDownloadCols } from "src/constants/admin/SWCollection";
import { styled } from "@mui/material/styles";
import { ALL } from "src/constants/common";
import { ACTIONS } from "src/Reducers/admin/SWCollection/SWReportReducer";
const COLUMNS = [...QueryOrDownloadCols];

const StyledSpan = styled("span")(({ theme }) => ({
  marginBlock: 0,
  marginInline: theme.spacing(2),
}));

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

const SearchQueries = ({ params, setParams, onSearch, 
  setEditTarget, setOpenEdit }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const [hadList, setHadList] = useState(false);
  const queryOrDownloadList = useSelector(
    (state) => state.SWReport.queryOrDownloadList
  );
  const exportDisable = useSelector((state) => state.SWReport.queryOrDownloadExportDisable);
  const uploadDisable = useSelector((state) => state.SWReport.queryOrDownloadUploadDisable);
  useEffect(() => {
    if(queryOrDownloadList){
      setHadList(queryOrDownloadList.length > 0);
    }
  }, [queryOrDownloadList]);

  const handleAdd = () => {
    setEditTarget({});
    setOpenEdit(true);
  };

  const onChange = (event, type) => {
    if (!event) {
      return;
    }
    if(type === "brand"){
      dispatch({ type: "setSelectedBrandId", payload: { brandId:event.target.value } });
    }
    const isYearChange = SEARCH_PARAMS.YEAR === type;

    setParams((prev) => ({
      ...prev,
      pageNum: 0,
      [type]: isYearChange ? new Date(event) : event.target.value,
      ...(isYearChange && {
        [SEARCH_PARAMS.BRAND]: ALL,
        [SEARCH_PARAMS.BG]: ALL,
        [SEARCH_PARAMS.BU]: ALL,
      }),
    }));
  };

  const onClickDownloadExample = () => {
    dispatch({
      type: ACTIONS.DOWNLOAD_TEMPLATE_EXCEL,
    });
  };

  const onClickImport = (file) => {
    dispatch({ type: ACTIONS.UPLOAD_QUERY_OR_DOWNLOAD_EXCEL, payload: { file } });
  };

  const onClickExport = () => {
    const _params = {
      ...params,
      year: params.year.getFullYear(),
      userFlag:1,
    };
    dispatch({
      type: ACTIONS.EXPORT_SW_COLLECTION_EXCEL,payload: _params 
    });
  };

  return (
    <>
      <TableHeadContainer>
        <StyledFilterGroup>
          <ErrorIcon />
          <FormattedMessage id="ADMIN.SW_COLLECTION.SW_QUERY_DOWNLOAD.TIPS" />
        </StyledFilterGroup>
        <StyledFilterGroup>
          <Buttons
            type={BUTTON_TYPES.DOWNLOAD_EXAMPLE}
            onClick={onClickDownloadExample}
            disabled={false}
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
            disabled={ exportDisable}
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
      <TableHeadContainer>
        <StyledFilterGroup>
          <Buttons type={BUTTON_TYPES.ADD} onClick={handleAdd} />
        </StyledFilterGroup>
      </TableHeadContainer>
    </>
  );
};

export default SearchQueries;
