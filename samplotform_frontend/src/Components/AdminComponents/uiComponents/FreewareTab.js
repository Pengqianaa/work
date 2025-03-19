import React, { useEffect, useState, memo } from "react";
import { connect } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { CInputGroup } from "@coreui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  Tooltip,
  Switch,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";
// components
import AdminTableFields from "src/Common/AdminTableFields";
import {
  FilterContainer,
  FilterGroup,
  SearchInput,
  SubmitButton,
  TableHeadContainer,
  AddButton,
} from "../uiComponents/AdminCommonUis";
import AdminPagination from "../uiComponents/AdminPagination";
import AddFreeware from "./AddFreeware";
import {
  SwitchControl,
  AvailabilityCheckboxGroup,
} from "../uiComponents/FormControls";
import {
  ALL,
  Actions,
  SW_ASSET_INFO,
  SW_ASSET_EDIT_INFO,
} from "../../../Common/constants";
import { BlueDotTooltip } from "src/Components/admin/common/unit/index";

const toSortParam = ({ isAsc, column }) => {
  return isAsc ? column + ",asc" : column + ",desc";
};
const COLUMNS = [...AdminTableFields.SWAssetFreewareCols];

const FreewareTab = (props) => {
  const {
    freewareResult,
    getFreewareList,
    brandList,
    getBrandList,
    deleteFreeware,
    setShowAlert,
    msg,
    setMsg,
  } = props;
  const INIT_DATA = {
    brandList: [],
    isValid: true,
    keyword: "",
    listType: 2,
    pageNum: 0,
    pageSize: 10,
    unPage: false,
  };
  const INIT_SORTING_COLUMN = {
    isAsc: false,
    column: "freewareCode",
  };
  const [data, setData] = useState(INIT_DATA);
  const [showModal, setShowModal] = useState(false);
  const [modifyData, setModifyData] = useState(SW_ASSET_EDIT_INFO.EDIT_INFO);
  const [brand, setBrand] = useState([]);
  const [sortingColumn, setSortingColumn] = useState(INIT_SORTING_COLUMN);
  const intl = useIntl();

  const Columns = memo(({ result }) =>
    COLUMNS.map((column, childIdx) => (
      <TableCell
        key={`${result.freeware}${childIdx}`}
        style={{ minWidth: "75px", textAlign: "center",
                 whiteSpace: 'nowrap', // 防止文本换行  
                 textOverflow: 'ellipsis', // 用省略号表示被隐藏的内容  
         }}
      >
        {(() => {
          switch (column.id) {
            case "valid":
              return <Switch
              checked={result[column.id]}
              disabled
              onChange={() => { }}
              color="primary"
            />;
            case "name":
              return (
                  <span style={{ position: 'relative' }}>
                    {column.viewCallback(result[column.id])}
                    <BlueDotTooltip content={result.remark} top={0}/>
                  </span>
                // <Tooltip title={result.remark}>
                //    <span>{column.viewCallback(result[column.id])}</span>
                // </Tooltip>               
              );
            case "categoryList":
              let categoryValue =
                result[column.id].length > 0
                  ? result[column.id]
                      .map((el) => {
                        return el.name;
                      })
                      .join(",")
                  : "-";
                  if(categoryValue.length > 15){
                    return (<Tooltip
                      title={
                        <span style={{ fontSize: "15px" }}>
                          {column.viewCallback(categoryValue)}
                        </span>
                      }
                    >
                      <span>
                        {categoryValue.length > 15 && (
                          <MoreHorizIcon style={{ fontSize: 14 }} />
                        )}
                      </span>
                    </Tooltip>)
                  }else{
                    return column.viewCallback(categoryValue)
                  }
            case "desc":
            case "descEn":
              const descValue = column.viewCallback(result[column.id]);
              if(descValue.length > 15){
                return (
                  <Tooltip
                    title={
                      <span style={{ fontSize: "15px" }}>
                        {column.viewCallback(result[column.id])}
                      </span>
                    }
                  >
                    <span>
                      {(
                        <MoreHorizIcon style={{ fontSize: 14 }} />
                      )}
                    </span>
                  </Tooltip>)
              }else{
                  return descValue
              }
              case "reason":
                if(result[column.id] === null || result[column.id] === undefined || result[column.id] === ""){
                  return '-'
                }
                const reasonDetail = intl.formatMessage({ id: `swassetmgt.freewareTab.reasonDetail${result[column.id]}` });
                if(reasonDetail.length > 15){
                  return (
                    <Tooltip
                      title={
                        <span style={{ fontSize: "15px" }}>
                          {reasonDetail}
                        </span>
                      }
                    >
                      <span>
                        {(
                          <MoreHorizIcon style={{ fontSize: 14 }} />
                        )}
                      </span>
                    </Tooltip>
                    );
                }else{
                  return reasonDetail
                }
            default:
              const value = result[column.id];
              return column.viewCallback(value);
          }
        })()}
      </TableCell>
    ))
  );

  if (brandList.length === 0) {
    getBrandList();
  }
  useEffect(() => {
    getFreewareList({
      ...data,
      sort: toSortParam(sortingColumn),
    });
  }, [data.pageNum, data.keyword, data.pageSize, sortingColumn]);
  const handleChange = (e, newPage) => {
    let { name, value } = e.target;
    let _value = null;
    switch (name) {
      case "brandList":
        if (value.includes(ALL)) {
          if (brand.includes(ALL)) {
            value.splice(value.indexOf(ALL), 1);
          } else {
            value = [ALL];
          }
        }
        _value = value.length === 0 || value.includes("_all") ? null : value;
        setBrand(value);
        break;
      case "pageSize":
        console.log("pageSize");
        _value = parseInt(value, 10);
        break;
      case "pageNum":
      case undefined:
        if (!name) {
          name = "pageNum";
        }
        // ?
        _value = !name ? newPage + 1 : newPage;
        break;
      default:
        _value = value;
        break;
    }
    setData((prev) => ({
      ...prev,
      [name]: _value,
      ...((name === "pageSize" || name === "keyword") && { pageNum: 0 }),
    }));
  };
  const handleSearch = () => {
    getFreewareList({
      ...data,
      pageNum: 0,
      sort: toSortParam(sortingColumn),
    });
    setData((prev) => ({ ...prev, pageNum: 0 }));
  };
  const handleModify = (freeware) => {
    if (freeware.name) {
      setModifyData({
        ...freeware,
        descEN: freeware.descEn,
        category: freeware?.categoryList?.map((el) => el.id),
      });
    } else {
      setModifyData(SW_ASSET_EDIT_INFO.EDIT_INFO);
    }
    setShowModal(true);
  };
  const handleDelete = (item) => {
    setShowAlert({
      title: intl.formatMessage({ id: `adminCommon.title` }),
      message: intl.formatMessage({ id: `adminCommon.deleteMsg` }),
      hasCancel: true,
      callback: () => {
        deleteFreeware(item.assetId);
      },
    });
  };
  const sortHandle = (column) => {
    setSortingColumn((prev) => ({
      isAsc: column === prev.column ? !prev.isAsc : true,
      column,
    }));
  };
  useEffect(() => {
    if (!msg || msg.flag !== 3) {
      return;
    }
    setMsg(null);
    handleSearch();
  }, [msg]);

  return (
    <>
      <TableContainer component={Paper}>
        <TableHeadContainer>
          <FilterGroup>
            <FilterContainer>
              <InputLabel id="listType-select-label">
                <FormattedMessage id="swassetmgt.freewareTab.listType" />
              </InputLabel>
              <Select
                variant="standard"
                name="listType"
                labelId="brand-select-label"
                id="brand-select"
                value={data.listType}
                onChange={handleChange}
              >
                {SW_ASSET_INFO.LIST_TYPE.map((el) => {
                  return (
                    <MenuItem key={el.id} value={el.id}>
                      {intl.formatMessage({
                        id: `swassetmgt.freewareTab.listType${el.id}`,
                      })}
                    </MenuItem>
                  );
                })}
              </Select>
            </FilterContainer>
            <FilterContainer>
              <InputLabel id="brand-select-label">
                <FormattedMessage id="adminCommon.brand" />
              </InputLabel>
              <Select
                variant="standard"
                name="brandList"
                multiple
                disabled={brandList.length === 0}
                labelId="brand-select-label"
                id="brand-select"
                value={brand}
                onChange={handleChange}
                renderValue={(selected) => `${selected.length} items selected`}
              >
                {brandList.length > 0 && (
                  <MenuItem value={ALL}>
                    <Checkbox
                      style={{ color: "#0087DC" }}
                      checked={brand.filter((e) => e === ALL).length > 0}
                    />
                    {intl.formatMessage({ id: `adminCommon.all` })}
                  </MenuItem>
                )}
                {brandList.map((el) => (
                  <MenuItem key={el.sourceNumber} value={el.sourceNumber}>
                    <Checkbox
                      style={{ color: "#0087DC" }}
                      checked={
                        brand.filter((e) => e === el.sourceNumber).length > 0
                      }
                    />
                    {el.sourceNumber}
                  </MenuItem>
                ))}
              </Select>
            </FilterContainer>
            <FilterContainer>
              <AvailabilityCheckboxGroup
                onCheck={(value) => {
                  handleChange({ target: { value, name: "isValid" } });
                }}
              />
            </FilterContainer>
          </FilterGroup>
          <FilterGroup>
            <SubmitButton style={{ height: "70%" }} onClick={handleSearch}>
              <FormattedMessage id="adminCommon.search" />
            </SubmitButton>
          </FilterGroup>
        </TableHeadContainer>
        <TableHeadContainer>
          <AddButton variant="contained" onClick={handleModify}>
            <FormattedMessage id="adminCommon.add" />
          </AddButton>
          <CInputGroup style={{ width: "250px" }}>
            <SearchInput
              value={data.keyword}
              onChange={handleChange}
              name="keyword"
              className="searchinput"
              placeholder={intl.formatMessage({ id: "adminCommon.keyword" })}
            ></SearchInput>
          </CInputGroup>
        </TableHeadContainer>
      </TableContainer>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="adminCommon.operate" />
              </TableCell>
              {COLUMNS.map((column) => (
                <TableCell style={{ textAlign: "center" }} key={column.id}>
                  <TableSortLabel
                    onClick={() => sortHandle(column.id)}
                    active={sortingColumn.column === column.id}
                    hideSortIcon={sortingColumn.column !== column.id}
                    direction={sortingColumn.isAsc ? "asc" : "desc"}
                  >
                    <FormattedMessage
                      id={`swassetmgt.freewareTab.${column.id}`}
                    />
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {freewareResult.list.map((result, parentIdx) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={`${result.id}${parentIdx}`}
                >
                  <TableCell style={{ minWidth: "65px" }}>
                    <DeleteIcon
                      onClick={() => {
                        handleDelete(result);
                      }}
                      style={{ color: "var(--error-color)" }}
                    />
                    <EditIcon
                      onClick={() => handleModify(result)}
                      style={{ color: "var(--success-color)" }}
                    />
                  </TableCell>
                  <Columns result={result} />
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper}>
        <AdminPagination
          pageName="pageNum"
          rowsPerPageName="pageSize"
          queryResults={{
            total: freewareResult.total,
            totalPages: freewareResult.totalPages,
          }}
          page={data.pageNum}
          rowsPerPage={data.pageSize}
          handleChangePage={handleChange}
          handleChangeRowsPerPage={handleChange}
        />
      </TableContainer>
      <AddFreeware
        key={showModal}
        show={showModal}
        toggle={setShowModal}
        intl={intl}
        focusFreeware={modifyData}
        brandList={brandList}
        getBrandList={getBrandList}
        handleSearch={handleSearch}
      />
    </>
  );
};
const mapStateToProps = (state) => ({
  freewareResult: state.swAsset.freewareResult,
  brandList: state.swAsset.freewareBrandList,
  msg: state.swAsset.msg,
});
const mapDispatchToProps = (dispatch) => ({
  getFreewareList: (payload) => dispatch({ type: "getFreewareList", payload }),
  getBrandList: () =>
    dispatch({
      type: "getFreewareBrandList",
    }),
  setShowAlert: (props) =>
    dispatch({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props,
      },
    }),
  deleteFreeware: (assetId) =>
    dispatch({
      type: "deleteFreeware",
      payload: { assetId },
    }),
  setMsg: (msg) =>
    dispatch({
      type: "setMsg",
      payload: { msg },
    }),
});
export default connect(mapStateToProps, mapDispatchToProps)(FreewareTab);
