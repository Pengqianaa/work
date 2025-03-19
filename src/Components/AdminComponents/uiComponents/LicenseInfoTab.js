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
import { RegionAreaSelector } from 'src/Components/admin/common/unit';
import {
  AddButton,
  FilterContainer,
  FilterGroup,
  SearchInput,
  SubmitButton,
  TableHeadContainer,
} from "../uiComponents/AdminCommonUis";
import AdminPagination from "../uiComponents/AdminPagination";
import EditLicenseInfo from "./EditLicenseInfo";

const columns = [...AdminTableFields.LicenseTabCols];

const LicenseInfoTab = (props) => {
  const {
    brandList,
    getBrandList,
    queryResults,
    getLicenseList,
    licenseResultController,
    deleteLicenseInfo,
    setShowAlert,
  } = props;
  const intl = useIntl();

  let user = useSelector((state) => state.user.user);
  let areaList = useSelector((state) => state.query.areaList);

  const [area, setArea] = useState("");
  const [brand, setBrand] = useState(ALL);
  const [keyword, setKeyword] = useState("");
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
    if (area) {
      handleSearch()
    }
  }, [area]);

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };
  const handleAreaChange = (value) => {
    setArea(value);
  };
  const handleSearch = (e) => {
    if (Array.isArray(area)) {
      getLicenseList(1, rowsPerPage, area.toString(), brand);
    } else {
      getLicenseList(1, rowsPerPage, area, brand);
    }
    setPage(0);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortingColumn, setSortingColumn] = useState("Modified");
  const [isASC, setIsASC] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    licenseResultController(
      newPage,
      rowsPerPage,
      keyword,
      sortingColumn,
      isASC
    );
  };

  const handleChangeRowsPerPage = (event) => {
    let newPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(newPageSize);
    licenseResultController(0, newPageSize, keyword, sortingColumn, isASC);
    setPage(0);
  };

  const handleInput = (e) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    licenseResultController(0, rowsPerPage, keyword, sortingColumn, isASC);
    setPage(0);
  }, [keyword, queryResults.list]);

  const sortHandler = (property) => {
    const asc = sortingColumn === property ? !isASC : true;
    setIsASC(asc);
    setSortingColumn(property);
    licenseResultController(0, rowsPerPage, keyword, property, asc);
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
  const handleDelete = (result) => {
    setShowAlert({
      title: intl.formatMessage({ id: `adminCommon.title` }),
      message: intl.formatMessage({ id: `adminCommon.deleteMsg` }),
      hasCancel: true,
      callback: () => {
        deleteLicenseInfo(result);
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
              <RegionAreaSelector
                area={area}
                onChange={handleAreaChange}
                defaultSearch={handleSearch}
                multiple={false}
                selectOptionAll={true}
              />
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
              >
                <MenuItem value={ALL}>
                  <FormattedMessage id="adminCommon.all" />
                </MenuItem>
                {brandList.map((el) => {
                  return (
                    <MenuItem key={el.id} value={el.brandName}>
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
                        id={`adminCols.softwareinfomgt.license.${column.id}`}
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
      <TableContainer id="eform-query-table" component={Paper}>
        <AdminPagination
          queryResults={queryResults}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={rowsPerPage}
        ></AdminPagination>
      </TableContainer>
      <EditLicenseInfo
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
  queryResults: state.softwareInfo.license,
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
  getLicenseList: (pageNum, pageSize, area, brand) =>
    dispatch({
      type: "getLicenseList",
      payload: { pageNum, pageSize, area, brand },
    }),
  licenseResultController: (
    currentPage,
    pageSize,
    keyword,
    sortingColumn,
    isASC
  ) =>
    dispatch({
      type: "licenseResultController",
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
  deleteLicenseInfo: (item) =>
    dispatch({
      type: "deleteLicenseInfo",
      payload: item,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(LicenseInfoTab);
