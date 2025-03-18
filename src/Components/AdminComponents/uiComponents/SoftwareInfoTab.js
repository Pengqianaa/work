import {
  CInputGroup,
} from "@coreui/react";
import Checkbox from "@mui/material/Checkbox";
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
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import { ALL } from "../../../Common/constants";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import AdminTableFields from "../../../Common/AdminTableFields";
import {
  FilterContainer,
  FilterGroup,
  SearchInput,
  SubmitButton,
  TableHeadContainer,
} from "../uiComponents/AdminCommonUis";
import AdminPagination from "../uiComponents/AdminPagination";
import EditSoftwareInfo from "./EditSoftwareInfo";
import Switch from "@mui/material/Switch";
import styled from "styled-components";
// import { CategorySelector } from 'src/Components/admin/common/unit';
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const CheckBoxLabel = styled.div`
  padding: 9px 8px;
  font-size: 18px;
  margin-top: -3px;
`;
const columns = [...AdminTableFields.SoftwareInfoTabCols];

const SoftwareInfoTab = (props) => {
  const { brandList, getBrandList, areaList, getAreaList, queryResults, querySoftwareInfos } = props;
  const intl = useIntl();

  useEffect(() => {
    getBrandList();
    getAreaList();
    handleSearch();
  }, []);

  const [area, setArea] = useState(ALL);
  const [brand, setBrand] = useState([]);
  // const [type, setType] = useState('')
  const [category, setCategory] = useState(5);

  const [isPublic, setIsPublic] = useState(true);
  const [isNotPublic, setIsNotPublic] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isNotAvailable, setIsNotAvailable] = useState(false);

  const toParam = (a, n) => {
    if (a && n) {
      return null;
    }
    if (a) {
      return true;
    }
    if (n) {
      return false;
    }
    return null;
  };

  const [keyword, setKeyword] = useState("");

  const handleAreaChange = (e) => {
    setArea(e.target.value);
  };
  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const handleSearch = (e) => {
    querySoftwareInfos(
      keyword,
      [category],
      [],
      brand,
      area,
      1,
      rowsPerPage,
      toParam(isPublic, isNotPublic),
      toParam(isAvailable, isNotAvailable)
    );
    setPage(0);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    querySoftwareInfos(
      keyword,
      [category],
      [],
      brand,
      area,
      newPage + 1,
      rowsPerPage,
      toParam(isPublic, isNotPublic),
      toParam(isAvailable, isNotAvailable)
    );
  };

  const handleChangeRowsPerPage = (event) => {
    let newPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(newPageSize);
    querySoftwareInfos(
      keyword,
      [category],
      [],
      brand,
      area,
      page + 1,
      newPageSize,
      toParam(isPublic, isNotPublic),
      toParam(isAvailable, isNotAvailable)
    );
    setPage(0);
  };

  const handleInput = (e) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    querySoftwareInfos(
      keyword,
      [category],
      [],
      brand,
      area,
      1,
      rowsPerPage,
      toParam(isPublic, isNotPublic),
      toParam(isAvailable, isNotAvailable)
    );
    setPage(0);
  }, [keyword]);

  const [openEdit, setOpenEdit] = useState(false);
  const [editTarget, setEditTarget] = useState({});
  const handleEdit = (user) => {
    setEditTarget(user);
    setOpenEdit(true);
  };

  const handleSave = () => {
    querySoftwareInfos(
      keyword,
      [category],
      [],
      brand,
      area,
      page + 1,
      rowsPerPage,
      toParam(isPublic, isNotPublic),
      toParam(isAvailable, isNotAvailable)
    );
  };

  // let direction = isASC ? 'asc' : 'desc'
  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <TableHeadContainer>
          <FilterGroup>
            {/* <FilterContainer>
              <CategorySelector
                value={category}
                onChange={handleCategoryChange}
              />
            </FilterContainer> */}
            <FilterContainer>
              <InputLabel id="area-select-label">
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
              </Select>
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
            <SubmitButton onClick={handleSearch}>
              <FormattedMessage id="adminCommon.search" />
            </SubmitButton>
          </FilterGroup>
        </TableHeadContainer>
        <TableHeadContainer>
          <FilterContainer style={{ display: "flex", flexDirection: "row" }}>
            <CheckBoxLabel>
              <FormattedMessage id="softwareinfomgt.isPublic" />
            </CheckBoxLabel>
            <FormGroup style={{ flexDirection: "row" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isPublic}
                    onChange={() => {
                      setIsPublic(!isPublic);
                    }}
                    color="primary"
                  />
                }
                label={intl.formatMessage({ id: "softwareinfomgt.publicY" })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isNotPublic}
                    onChange={() => {
                      setIsNotPublic(!isNotPublic);
                    }}
                    color="primary"
                  />
                }
                label={intl.formatMessage({ id: "softwareinfomgt.publicN" })}
              />
            </FormGroup>
            <CheckBoxLabel>
              <FormattedMessage id="softwareinfomgt.isAvailable" />
            </CheckBoxLabel>
            <FormGroup style={{ flexDirection: "row" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAvailable}
                    onChange={() => {
                      setIsAvailable(!isAvailable);
                    }}
                    color="primary"
                  />
                }
                label={intl.formatMessage({ id: "softwareinfomgt.availableY" })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isNotAvailable}
                    onChange={() => {
                      setIsNotAvailable(!isNotAvailable);
                    }}
                    color="primary"
                  />
                }
                label={intl.formatMessage({ id: "softwareinfomgt.availableN" })}
              />
            </FormGroup>
          </FilterContainer>
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
              {columns.map((column) => {
                return (
                  <TableCell key={column.id}>
                    <FormattedMessage
                      id={`adminCols.softwareinfomgt.softwareinfo.${column.id}`}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {queryResults.list.map((result, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell>
                    <EditIcon
                      onClick={() => {
                        handleEdit(result);
                      }}
                      style={{ color: "rgb(76, 175, 80)" }}
                    />
                  </TableCell>
                  {columns.map((column) => {
                    if (column.id === "isPublic") {
                      return (
                        <TableCell key={column.id}>
                          <Switch
                            checked={result.isPublic === 1}
                            onChange={() => { }}
                            color="primary"
                          />
                        </TableCell>
                      );
                    }
                    if (column.id === "isValid") {
                      return (
                        <TableCell key={column.id}>
                          <Switch
                            checked={result.isValid === 1}
                            onChange={() => { }}
                            color="primary"
                          />
                        </TableCell>
                      );
                    }
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
      <EditSoftwareInfo
        key={openEdit}
        show={openEdit}
        item={editTarget}
        toggleFunc={setOpenEdit}
        saveFunc={handleSave}
      ></EditSoftwareInfo>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  areaList: state.query.areaList,
  brandList: state.query.brandList,
  queryResults: state.query.software,
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
  querySoftwareInfos: (
    q,
    categoriesSelected,
    functionsSelected,
    brandsSelected,
    areaSelected,
    pageNum,
    pageSize,
    isPublic,
    isAvailable
  ) =>
    dispatch({
      type: "querySoftwareInfos",
      payload: {
        q,
        categoriesSelected,
        functionsSelected,
        brandsSelected,
        areaSelected,
        pageNum,
        pageSize,
        isPublic,
        isAvailable,
      },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SoftwareInfoTab);
