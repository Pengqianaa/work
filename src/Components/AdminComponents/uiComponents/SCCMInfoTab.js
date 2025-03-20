import { CInputGroup } from "@coreui/react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect, useSelector } from "react-redux";
import AdminTableFields from "../../../Common/AdminTableFields";
import { Actions, ALL } from "../../../Common/constants";
import {
  AddButton,
  FilterContainer,
  FilterGroup,
  SearchInput,
  SubmitButton,
  TableHeadContainer,
} from "../uiComponents/AdminCommonUis";
import AdminPagination from "../uiComponents/AdminPagination";
import EditSCCMInfo from "./EditSCCMInfo";
import { CategorySelector, RegionAreaSelector } from 'src/Components/admin/common/unit';
const columns = [...AdminTableFields.SCCMTabCols];

const SCCMInfoTab = (props) => {
  const {
    brandList,
    getBrandList,
    queryResults,
    getSCCMList,
    sccmResultController,
    setShowAlert,
    deleteSCCMInfo,
  } = props;
  const intl = useIntl();
  const [area, setArea] = useState("");
  const [brand, setBrand] = useState(ALL);
  const [category, setCategory] = useState(5);
  const [keyword, setKeyword] = useState("");
  let user = useSelector((state) => state.user.user);
  let areaList = useSelector((state) => state.query.areaList);
  useEffect(() => {
    getBrandList();
     // 使用 useEffect 的依赖项来处理 areaList 更新后的逻辑
     const handleAreaListUpdate = () => {
      let areaIds = areaList.filter(areaItem => areaItem.areaEname === user.area);
      if (areaIds.length > 0) {
        setArea(areaIds[0].id);
      }
    };
    // 当 areaList 更新时调用此函数（但实际上，由于 areaList 是依赖项，useEffect 会自动重新运行）
    handleAreaListUpdate();
  }, [areaList, user.area]);

  useEffect(() => {
    if(area){
      handleSearch()
    }
  }, [area]);

  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };
  const handleAreaChange = (value) => {
    setArea(value);
  };
  const handleSearch = (e) => {
    if(Array.isArray(area)){
      getSCCMList(1, rowsPerPage, area.toString(), brand, category);
    }else{
      getSCCMList(1, rowsPerPage, area, brand, category);
    }
    setPage(0);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortingColumn, setSortingColumn] = useState("Modified");
  const [isASC, setIsASC] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    sccmResultController(newPage, rowsPerPage, keyword, sortingColumn, isASC);
  };

  const handleChangeRowsPerPage = (event) => {
    let newPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(newPageSize);
    sccmResultController(0, newPageSize, keyword, sortingColumn, isASC);
    setPage(0);
  };

  const handleInput = (e) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    sccmResultController(0, rowsPerPage, keyword, sortingColumn, isASC);
    setPage(0);
  }, [keyword, queryResults.list]);

  const sortHandler = (property) => {
    const asc = sortingColumn === property ? !isASC : true;
    setIsASC(asc);
    setSortingColumn(property);
    sccmResultController(0, rowsPerPage, keyword, property, asc);
  };

  const [openEdit, setOpenEdit] = useState(false);
  const [editTarget, setEditTarget] = useState({});

  const handleAdd = () => {
    setEditTarget({});
    setOpenEdit(true);
  };
  const handleEdit = (user) => {
    setEditTarget(user);
    setOpenEdit(true);
  };
  const handleDelete = (item) => {
    setShowAlert({
      title: intl.formatMessage({ id: `common.title` }),
      message: intl.formatMessage({ id: `adminCommon.deleteMsg` }),
      hasCancel: true,
      callback: () => {
        deleteSCCMInfo(item);
      },
    });
  };

  let direction = isASC ? "asc" : "desc";
  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <TableHeadContainer>
          <FilterGroup>
            <FilterContainer>
              <CategorySelector
                value={category}
                onChange={handleCategoryChange}
              />
            </FilterContainer>
            <FilterContainer>
              {/* <InputLabel id="area-select-label">
                <FormattedMessage id="adminCommon.area" />
              </InputLabel>
              <Select
                variant="standard"
                labelId="area-select-label"
                id="area-select"
                value={area}
                onChange={handleAreaChange}
              >
                <MenuItem value={ALL}>All</MenuItem>
                {areaList.map((el, index) => {
                  return (
                    <MenuItem key={index} value={el.id}>
                      {el.areaEname}
                    </MenuItem>
                  );
                })}
              </Select> */}
              <RegionAreaSelector
                area={area}
                onChange={handleAreaChange}
                defaultSearch={handleSearch}
                multiple={ false }
                selectOptionAll = { true }
              />
            </FilterContainer>
            <FilterContainer>
              <InputLabel id="brand-select-label">Brand</InputLabel>
              <Select
                variant="standard"
                labelId="brand-select-label"
                id="brand-select"
                value={brand}
                onChange={handleBrandChange}
              >
                <MenuItem value={ALL}>All</MenuItem>
                {brandList.map((el, index) => {
                  return (
                    <MenuItem key={index} value={el.brandName}>
                      {el.brandName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FilterContainer>
          </FilterGroup>
          <FilterGroup>
            <SubmitButton onClick={handleSearch}>
              <FormattedMessage id="adminCommon.search" />
            </SubmitButton>
          </FilterGroup>
        </TableHeadContainer>
        <TableHeadContainer>
          <AddButton variant="contained" onClick={handleAdd}>
            <FormattedMessage id="adminCommon.add" />
          </AddButton>
          <CInputGroup style={{ width: "250px" }}>
            <SearchInput
              value={keyword}
              onChange={handleInput}
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
              {columns.map((column, index) => {
                return (
                  <TableCell key={index}>
                    <TableSortLabel
                      onClick={() => {
                        sortHandler(column.id);
                      }}
                      active={sortingColumn === column.id}
                      direction={direction}
                      hideSortIcon={sortingColumn !== column.id}
                    >
                      <FormattedMessage
                        id={`adminCols.softwareinfomgt.sccm.${column.id}`}
                      />
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {queryResults.viewList.map((result, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell style={{ minWidth: "65px" }}>
                    <DeleteIcon
                      onClick={() => {
                        handleDelete(result);
                      }}
                      style={{ color: "#FF5252" }}
                    />
                    <EditIcon
                      onClick={() => {
                        handleEdit(result);
                      }}
                      style={{ color: "rgb(76, 175, 80)" }}
                    />
                  </TableCell>
                  {columns.map((column) => {
                    let value = result[column.id];
                    return (
                      <TableCell key={column.id}>
                        {column.viewCallback(value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper}>
        <AdminPagination
          queryResults={queryResults}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={rowsPerPage}
        ></AdminPagination>
      </TableContainer>
      <EditSCCMInfo
        key={openEdit}
        show={openEdit}
        item={editTarget}
        toggleFunc={setOpenEdit}
      />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  areaList: state.query.areaList,
  brandList: state.query.brandList,
  queryResults: state.softwareInfo.sccm,
});
const mapDispatchToProps = (dispatch) => ({
  getAreaList: () =>
    dispatch({
      type: "getAreaList",
    }),
  getBrandList: () =>
    dispatch({
      type: "getBrandList",
      payload: true,
    }),
  getSCCMList: (pageNum, pageSize, area, brand, category) =>
    dispatch({
      type: "getSCCMList",
      payload: { pageNum, pageSize, area, brand, category },
    }),
  sccmResultController: (
    currentPage,
    pageSize,
    keyword,
    sortingColumn,
    isASC
  ) =>
    dispatch({
      type: "sccmResultController",
      payload: { currentPage, pageSize, keyword, sortingColumn, isASC },
    }),
  setShowAlert: (props) =>
    dispatch({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props,
      },
    }),
  deleteSCCMInfo: (item) =>
    dispatch({
      type: "deleteSCCMInfo",
      payload: item,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SCCMInfoTab);
