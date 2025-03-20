import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { CInputGroup } from "@coreui/react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Checkbox from "@mui/material/Checkbox";

import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { Actions, ALL } from "../../../Common/constants";
import EditInstallationPath from "./EditInstallationPath";
import AdminPagination from "../uiComponents/AdminPagination";
import {
  TableHeadContainer,
  SearchInput,
  SubmitButton,
  FilterContainer,
  FilterGroup,
  AddButton,
} from "./AdminCommonUis";
import AdminTableFields from "../../../Common/AdminTableFields";
import { CategorySelector, RegionAreaSelector } from 'src/Components/admin/common/unit';
const columns = [...AdminTableFields.InstallationPathCols];

const InstallationPathTab = (props) => {
  const {
    brandList,
    getBrandList,
    queryResults,
    getInstallationPathList,
    installationPathController,
    setShowAlert,
    deleteInstallationPath,
    clearStocIdList,
  } = props;

  let user = useSelector((state) => state.user.user);
  let areaList = useSelector((state) => state.query.areaList);
  const intl = useIntl();
  const [area, setArea] = useState([]);
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState(5);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    getBrandList();
    // 使用 useEffect 的依赖项来处理 areaList 更新后的逻辑
    const handleAreaListUpdate = () => {
      let areaIds = areaList.filter(areaItem => areaItem.areaEname === user.area);
      if (areaIds.length > 0) {
        setArea([areaIds[0].id]);
      }
    };
    // 当 areaList 更新时调用此函数（但实际上，由于 areaList 是依赖项，useEffect 会自动重新运行）
    handleAreaListUpdate();
  }, [areaList, user.area]);

  useEffect(() => {
    handleSearch()
  }, [area]);

  const handleAreaChange = (value) => {
    setArea(value);
  };
  const handleBrandChange = (e) => {
    if (e.target.value.includes(ALL) && !brand.includes(ALL)) {
      setBrand([ALL]);
    } else if (e.target.value.includes(ALL) && brand.includes(ALL)) {
      let arr = [...e.target.value];
      arr.splice(arr.indexOf(ALL), 1);
      setBrand(arr);
    } else {
      setBrand(e.target.value);
    }
  };
  const handleCategoryChange = (value) => {
    setCategory(value);
  };

  const handleSearch = (e) => {
    if (area.length > 0 && area === "_all") {
      getInstallationPathList(1, rowsPerPage, brand, "", category);
    } else {
      getInstallationPathList(1, rowsPerPage, brand, area, category);
    }
    setPage(0);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortingColumn, setSortingColumn] = useState("modifiedTime");
  const [isASC, setIsASC] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    installationPathController(newPage, rowsPerPage, keyword);
  };

  const handleChangeRowsPerPage = (event) => {
    let newPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(newPageSize);
    installationPathController(0, newPageSize, keyword);
    setPage(0);
  };

  const handleInput = (e) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    installationPathController(0, rowsPerPage, keyword);
    setPage(0);
  }, [keyword, queryResults.list]);

  const sortHandler = (property) => {
    const asc = sortingColumn === property ? !isASC : true;
    setIsASC(asc);
    setSortingColumn(property);
    installationPathController(0, rowsPerPage, keyword, property, asc);
  };

  const [openEdit, setOpenEdit] = useState(false);
  const [editTarget, setEditTarget] = useState({});

  const handleAdd = () => {
    setEditTarget({});
    setOpenEdit(true);
    clearStocIdList();
  };
  const handleEdit = (user) => {
    setEditTarget(user);
    setOpenEdit(true);
    clearStocIdList();
  };
  const handleDelete = (id) => {
    setShowAlert({
      title: intl.formatMessage({ id: `adminCommon.title` }),
      message: intl.formatMessage({ id: `adminCommon.deleteMsg` }),
      hasCancel: true,
      callback: () => {
        deleteInstallationPath(id);
      },
    });
  };

  let direction = isASC ? "asc" : "desc";
  return (
    <React.Fragment>
      <TableContainer id="eform-query-table" component={Paper}>
        <TableHeadContainer>
          <FilterGroup>
            <FilterContainer>
              <CategorySelector
                value={category}
                onChange={handleCategoryChange}
              />
            </FilterContainer>
            {/* <FilterContainer>
              <InputLabel id="brand-select-label">
                <FormattedMessage id="adminCommon.category" />
              </InputLabel>
              <Select
                variant="standard"
                labelId="brand-select-label"
                id="brand-select"
                value={category}
                onChange={handleCategoryChange}
              >
                <MenuItem value={5}>
                  <FormattedMessage id="main.commercial" />
                </MenuItem>
              </Select>
            </FilterContainer> */}
            <FilterContainer>
              <RegionAreaSelector
                area={area}
                onChange={handleAreaChange}
                defaultSearch={handleSearch}
              />
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
            </FilterContainer>
            <FilterContainer>
              <InputLabel id="brand-select-label">
                <FormattedMessage id="adminCommon.brand" />
              </InputLabel>
              <Select
                variant="standard"
                labelId="brand-select-label"
                id="brand-select"
                value={brand}
                onChange={handleBrandChange}
                multiple
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
                {brandList.map((el) => {
                  return (
                    <MenuItem key={el.id} value={el.id}>
                      <Checkbox
                        style={{ color: "#0087DC" }}
                        checked={brand.filter((e) => e === el.id).length > 0}
                      />
                      {el.brandName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FilterContainer>
          </FilterGroup>
          <FilterGroup>
            <SubmitButton onClick={handleSearch}>Search</SubmitButton>
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
              placeholder={intl.formatMessage({ id: "main.placeHolder" })}
            ></SearchInput>
          </CInputGroup>
        </TableHeadContainer>
      </TableContainer>
      <TableContainer id="eform-query-table" component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <FormattedMessage id="adminCommon.operate" />
              </TableCell>
              {columns.map((column) => {
                return (
                  <TableCell key={column.id}>
                    <TableSortLabel
                      onClick={() => {
                        sortHandler(column.id);
                      }}
                      active={sortingColumn === column.id}
                      direction={direction}
                      hideSortIcon={sortingColumn !== column.id}
                    >
                      <FormattedMessage
                        id={`adminCols.softwareinfomgt.installationPath.${column.id}`}
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
                        handleDelete(result.id);
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
      <TableContainer id="eform-query-table" component={Paper}>
        <AdminPagination
          queryResults={queryResults}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={rowsPerPage}
        ></AdminPagination>
      </TableContainer>
      <EditInstallationPath
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
  queryResults: state.softwareInfo.installationPath,
});
const mapDispatchToProps = (dispatch) => ({
  getAreaList: () =>
    dispatch({
      type: "getAreaList",
    }),
  getInstallationPathList: (pageNum, pageSize, brandIds, area, catId) =>
    dispatch({
      type: "getInstallationPathList",
      payload: { pageNum, pageSize, brandIds, area, catId },
    }),
  installationPathController: (
    currentPage,
    pageSize,
    keyword,
    sortingColumn,
    isASC
  ) =>
    dispatch({
      type: "installationPathController",
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
  deleteInstallationPath: (id) =>
    dispatch({
      type: "deleteInstallationPath",
      payload: id,
    }),
  getBrandList: () =>
    dispatch({
      type: "getBrandList",
      payload: true,
    }),
  clearStocIdList: () =>
    dispatch({
      type: Actions.SET_STOCK_ID_LIST,
      payload: [],
    }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallationPathTab);
