import { CContainer, CInputGroup, CRow } from "@coreui/react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import CloudDownload from "@mui/icons-material/CloudDownload";
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import AdminTableFields from "../../../Common/AdminTableFields";
import { exportToExcel, generateTable } from "../../../Common/commonMethod";
import { ALL, E_FORM_QUERY_TABS, Actions } from "../../../Common/constants";
import {
  FilterContainer,
  FilterGroup,
  SearchInput,
  SubmitButton,
  TableHeadContainer,
} from "../uiComponents/AdminCommonUis";
import AdminPagination from "../uiComponents/AdminPagination";
import { DEFAULT_SORTING_COL } from "../../../Common/TableSorting";
import Autocomplete from "@mui/material/Autocomplete";

const IN_KEY = ["installTime", "sourceInstallId"];
const UN_KEY = ["uninstallTime", "sourceUninstallId"];

const columns = [...AdminTableFields.EFormQueryCols];
const columns2 = [...AdminTableFields.EFormQueryOngoingCols];

const excelColumns = [...AdminTableFields.ExcelCols];
const excelColumns2 = [...AdminTableFields.ExcelOngoingCols];
const ExportButton = styled(Button)`
  background-color: green !important;
  color: #fff !important;
  cursor: pointer !important;
  display: block;
  height: 80%;
  margin-left: 8px !important;
  &.Mui-disabled {
    background-color: #ddd !important;
    color: #aaa !important;
  }
`;

const SelectedChip = styled(Chip)`
  margin-left: 4px;
`;

const EFormQuery = (props) => {
  const {
    areaList,
    bgbuList,
    brandList,
    costDeptList,
    statusList,
    getAreaList,
    getBgBuList,
    getBrandList,
    getCostDept,
    getStatusList,
    queryInstallRecords,
    queryResults,
    resultController,
    clearResults,
  } = props;
  const intl = useIntl();

  useEffect(() => {
    getAreaList();
    getBgBuList();
    getBrandList();
    getCostDept();
    getStatusList(true);
    setPage(0);
    clearResults();
  }, []);

  const [formStatus, setFormStatus] = useState([]);

  const handleStatusChange = (e) => {
    setFormStatus(e.target.value);
  };

  const [brand, setBrand] = useState([]);
  const [bgbu, setBgbu] = useState([]);
  const [area, setArea] = useState([]);
  const [costDept, setCostDept] = useState([]);
  const [type, setType] = useState(ALL);
  const [keyword, setKeyword] = useState("");

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
  const handleAreaChange = (e) => {
    if (e.target.value.includes(ALL) && !area.includes(ALL)) {
      setArea([ALL]);
    } else if (e.target.value.includes(ALL) && area.includes(ALL)) {
      let arr = [...e.target.value];
      arr.splice(arr.indexOf(ALL), 1);
      setArea(arr);
    } else {
      setArea(e.target.value);
    }
  };
  const handleBgbuChange = (e) => {
    if (e.target.value.includes(ALL) && !bgbu.includes(ALL)) {
      setBgbu([ALL]);
    } else if (e.target.value.includes(ALL) && bgbu.includes(ALL)) {
      let arr = [...e.target.value];
      arr.splice(arr.indexOf(ALL), 1);
      setBgbu(arr);
    } else {
      setBgbu(e.target.value);
    }
  };
  const handleCostDeptChange = (e) => {
    if (e.target.value.includes(ALL) && !costDept.includes(ALL)) {
      setCostDept([ALL]);
    } else if (e.target.value.includes(ALL) && costDept.includes(ALL)) {
      let arr = [...e.target.value];
      arr.splice(arr.indexOf(ALL), 1);
      setCostDept(arr);
    } else {
      setCostDept(e.target.value);
    }
  };
  const handleCostDeptChange2 = (e, v) => {
    let newList = new Set([...costDept]);
    newList.add(v);
    setCostDept([...newList]);
  };
  const handleTypeChange = (e) => {
    setType(e.target.value);
  };
  const [tab, setTab] = useState("1");

  const handleClickTab = (event, newValue) => {
    setBrand([]);
    setBgbu([]);
    setArea([]);
    setCostDept([]);
    setKeyword("");
    setType(ALL);
    setTab(newValue);
    setFormStatus([]);
    if (newValue === E_FORM_QUERY_TABS.INSTALL) {
      setSortingColumn(DEFAULT_SORTING_COL["install"]);
    }
    if (newValue === E_FORM_QUERY_TABS.UNINSTALL) {
      setSortingColumn(DEFAULT_SORTING_COL["uninstall"]);
    }
    if (newValue === E_FORM_QUERY_TABS.ONGOING) {
      setSortingColumn(DEFAULT_SORTING_COL["ongoing"]);
      getStatusList(true);
    }
    if (newValue === E_FORM_QUERY_TABS.CANCEL) {
      setSortingColumn(DEFAULT_SORTING_COL["ongoing"]);
      getStatusList(false);
    }
    clearResults();
  };

  const [startDate, setStartDate] = useState(
    moment().subtract(90, "days").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  const handleStartDateChange = (e) => {
    let mEnd = moment(`${endDate} 23:59:59`);
    let mStart = moment(`${e.target.value} 00:00:00`);
    if (!mEnd.isAfter(mStart)) {
      return;
    }
    setStartDate(e.target.value);
  };
  const handleEndDateChange = (e) => {
    let mEnd = moment(`${e.target.value} 23:59:59`);
    let mStart = moment(`${startDate} 00:00:00`);
    if (!mEnd.isAfter(mStart)) {
      return;
    }
    setEndDate(e.target.value);
  };

  const handleSearch = (e) => {
    let mEnd = moment(`${endDate} 23:59:59`);
    let mStart = moment(`${startDate} 00:00:00`);
    if (!mEnd.isAfter(mStart)) {
      alert("Invalid date range"); // TODO date vaidation
      return;
    }
    let endStr = mEnd.format("YYYY-MM-DD HH:mm:ss");
    let startStr = mStart.format("YYYY-MM-DD HH:mm:ss");

    let bgIds = new Set([]);
    let buIds = [];
    bgbuList.forEach((el) => {
      if (el.buId && (bgbu.includes(el.buId) || bgbu.includes(ALL))) {
        bgIds.add(el.bgId);
        buIds.push(el.buId);
      }
    });
    let brandParam = [...brand];
    let areaParam = [...area];
    let costDeptParam = [...costDept];
    if (brand.includes(ALL)) {
      brandParam = [...brandList.map((e) => e.id)];
    }
    if (area.includes(ALL)) {
      areaParam = [...areaList.map((e) => e.id)];
    }
    if (costDept.includes(ALL)) {
      costDeptParam = [...costDeptList.map((e) => e.costDeptCode)];
    }

    if (tab === E_FORM_QUERY_TABS.ONGOING || tab === E_FORM_QUERY_TABS.CANCEL) {
      queryInstallRecords(
        tab,
        areaParam,
        null,
        brandParam,
        buIds,
        costDeptParam,
        endStr,
        1,
        rowsPerPage,
        startStr,
        formStatus,
        type
      );
    } else {
      queryInstallRecords(
        tab,
        areaParam,
        [...bgIds],
        brandParam,
        buIds,
        costDeptParam,
        endStr,
        1,
        rowsPerPage,
        startStr,
        null,
        tab
      );
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortingColumn, setSortingColumn] = useState(
    DEFAULT_SORTING_COL["install"]
  );
  const [isASC, setIsASC] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    resultController(tab, newPage, rowsPerPage, keyword, sortingColumn, isASC);
  };

  const handleChangeRowsPerPage = (event) => {
    let newPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(newPageSize);
    resultController(tab, 0, newPageSize, keyword, sortingColumn, isASC);
    setPage(0);
  };

  const handleInput = (e) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    resultController(tab, 0, rowsPerPage, keyword, sortingColumn, isASC);
    setPage(0);
  }, [keyword, queryResults.list]);

  const sortHandler = (property) => {
    const asc = sortingColumn === property ? !isASC : true;
    setIsASC(asc);
    setSortingColumn(property);
    resultController(tab, 0, rowsPerPage, keyword, property, asc);
    setPage(0);
  };
  const exportCsvFile = () => {
    exportToExcel(
      generateTable(
        tab === E_FORM_QUERY_TABS.ONGOING ? excelColumns2 : excelColumns,
        queryResults.list
      )
    );
  };

  let direction = isASC ? "asc" : "desc";

  let searchEnable = [...brand, ...bgbu, ...area, ...costDept].length > 0;

  return (
    <CContainer>
      <CRow variant="standard" style={{ marginBottom: "20px" }}>
        <h1>
          <FormattedMessage id="eformquery.title" />
        </h1>
      </CRow>
      <CRow variant="standard">
        <div
          style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <Tabs
            value={tab}
            onChange={handleClickTab}
            aria-label="simple tabs example"
          >
            <Tab
              value={E_FORM_QUERY_TABS.INSTALL}
              label={intl.formatMessage({ id: `eformquery.tab1` })}
            />
            <Tab
              value={E_FORM_QUERY_TABS.UNINSTALL}
              label={intl.formatMessage({ id: `eformquery.tab2` })}
            />
            <Tab
              value={E_FORM_QUERY_TABS.ONGOING}
              label={intl.formatMessage({ id: `eformquery.tab3` })}
            />
            <Tab
              value={E_FORM_QUERY_TABS.CANCEL}
              label={intl.formatMessage({ id: `eformquery.tab4` })}
            />
          </Tabs>
        </div>
        <TableContainer id="eform-query-table" component={Paper}>
          <TableHeadContainer>
            <FilterGroup>
              <FilterContainer>
                <TextField
                  variant="standard"
                  id="dateStart"
                  label={intl.formatMessage({ id: `eformquery.start` })}
                  type="date"
                  onChange={handleStartDateChange}
                  value={startDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FilterContainer>
              <FilterContainer>
                <TextField
                  variant="standard"
                  id="dateEnd"
                  label={intl.formatMessage({ id: `eformquery.end` })}
                  type="date"
                  onChange={handleEndDateChange}
                  value={endDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FilterContainer>
              {(tab === E_FORM_QUERY_TABS.ONGOING ||
                tab === E_FORM_QUERY_TABS.CANCEL) && (
                <FilterContainer>
                  <InputLabel id="formtype-select-label">
                    <FormattedMessage id="eformquery.type" />
                  </InputLabel>
                  <Select
                    variant="standard"
                    labelId="formtype-select-label"
                    id="formtype-select"
                    value={type}
                    onChange={handleTypeChange}
                  >
                    <MenuItem value={ALL}>
                      {intl.formatMessage({ id: `adminCommon.all` })}
                    </MenuItem>
                    <MenuItem value={1}>
                      {intl.formatMessage({ id: `eformquery.tab1` })}
                    </MenuItem>
                    <MenuItem value={2}>
                      {intl.formatMessage({ id: `eformquery.tab2` })}
                    </MenuItem>
                  </Select>
                </FilterContainer>
              )}
              {(tab === E_FORM_QUERY_TABS.ONGOING ||
                tab === E_FORM_QUERY_TABS.CANCEL) && (
                <FilterContainer>
                  <InputLabel id="status-select-label">
                    <FormattedMessage id="eformquery.status" />
                  </InputLabel>
                  <Select
                    variant="standard"
                    multiple
                    labelId="status-select-label"
                    id="status-select"
                    value={formStatus}
                    onChange={handleStatusChange}
                    renderValue={(selected) =>
                      `${selected.length} items selected`
                    }
                  >
                    {statusList.map((el, index) => {
                      return (
                        <MenuItem key={index} value={el.statusCode}>
                          <Checkbox
                            style={{ color: "#0087DC" }}
                            checked={
                              formStatus.filter((e) => {
                                return e === el.statusCode;
                              }).length > 0
                            }
                          />
                          {el.statusNameEN}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FilterContainer>
              )}
            </FilterGroup>
          </TableHeadContainer>
          <TableHeadContainer>
            <FilterGroup>
              <FilterContainer>
                <InputLabel id="brand-select-label">
                  <FormattedMessage id="adminCommon.brand" />
                </InputLabel>
                <Select
                  variant="standard"
                  multiple
                  disabled={brandList.length === 0}
                  labelId="brand-select-label"
                  id="brand-select"
                  value={brand}
                  onChange={handleBrandChange}
                  renderValue={(selected) =>
                    `${selected.length} items selected`
                  }
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
                {/* </CRow> */}
              </FilterContainer>
              <FilterContainer>
                <InputLabel id="area-select-label">
                  <FormattedMessage id="adminCommon.area" />
                </InputLabel>
                <Select
                  variant="standard"
                  multiple
                  labelId="area-select-label"
                  id="area-select"
                  value={area}
                  onChange={handleAreaChange}
                  renderValue={(selected) =>
                    `${selected.length} items selected`
                  }
                >
                  {areaList.length > 0 && (
                    <MenuItem value={ALL}>
                      <Checkbox
                        style={{ color: "#0087DC" }}
                        checked={area.filter((e) => e === ALL).length > 0}
                      />
                      {intl.formatMessage({ id: `adminCommon.all` })}
                    </MenuItem>
                  )}
                  {areaList.map((el) => {
                    return (
                      <MenuItem key={el.id} value={el.id}>
                        <Checkbox
                          style={{ color: "#0087DC" }}
                          checked={area.filter((e) => e === el.id).length > 0}
                        />
                        {el.areaEname}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FilterContainer>
              <FilterContainer>
                <InputLabel>
                  <FormattedMessage id="adminCommon.bgbu" />
                </InputLabel>
                <Select
                  variant="standard"
                  labelId="bgbu-mutiple-label"
                  id="bgbu-mutiple"
                  multiple
                  value={bgbu}
                  onChange={handleBgbuChange}
                  renderValue={(selected) =>
                    `${selected.length} items selected`
                  }
                >
                  {bgbuList.length > 0 && (
                    <MenuItem value={ALL}>
                      <Checkbox
                        style={{ color: "#0087DC" }}
                        checked={bgbu.filter((e) => e === ALL).length > 0}
                      />
                      {intl.formatMessage({ id: `adminCommon.all` })}
                    </MenuItem>
                  )}
                  {bgbuList.map((item, index) => {
                    if (item.bgName) {
                      return (
                        <MenuItem key={index} value={item.id}>
                          {/* <Checkbox style={{ color: '#0087DC' }} checked={selectedAreas.filter(e => e === area.id).length > 0} /> */}
                          {item.bgShortName}
                        </MenuItem>
                      );
                    } else {
                      return (
                        <MenuItem key={index} value={item.id}>
                          <Checkbox
                            style={{ color: "#0087DC" }}
                            checked={
                              bgbu.filter((e) => e === item.buId).length > 0
                            }
                          />
                          {item.buShortName}
                        </MenuItem>
                      );
                    }
                  })}
                </Select>
              </FilterContainer>
              <FilterContainer>
                {costDeptList.length <= 10 && (
                  <InputLabel id="cost-dept-select-label">
                    <FormattedMessage id="adminCommon.costCenter" />
                  </InputLabel>
                )}
                {costDeptList.length <= 10 && (
                  <Select
                    variant="standard"
                    multiple
                    labelId="cost-dept-select-label"
                    id="cost-dept-select"
                    value={costDept}
                    onChange={handleCostDeptChange}
                    renderValue={(selected) =>
                      `${selected.length} items selected`
                    }
                  >
                    {costDeptList.map((el) => {
                      return (
                        <MenuItem key={el.costDeptCode} value={el.costDeptCode}>
                          <Checkbox
                            style={{ color: "#0087DC" }}
                            checked={
                              costDept.filter((e) => e === el.costDeptCode)
                                .length > 0
                            }
                          />
                          {el.costDeptName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
                {costDeptList.length > 10 && (
                  <Autocomplete
                    size="small"
                    style={{ marginTop: "3px" }}
                    options={costDeptList
                      .map((e) => e.costDeptCode)
                      .filter((e) => !!e)}
                    onChange={handleCostDeptChange2}
                    isOptionEqualToValue={(option, value) =>
                      value === undefined ||
                      value === "" ||
                      option.id === value.id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label={intl.formatMessage({
                          id: "adminCommon.costCenter",
                        })}
                      />
                    )}
                    getOptionLabel={(option, value) => {
                      return option;
                    }}
                    value={""}
                    disableClearable={true}
                  />
                )}
              </FilterContainer>
            </FilterGroup>
            <FilterGroup>
              <SubmitButton disabled={!searchEnable} onClick={handleSearch}>
                {" "}
                <SearchIcon /> <FormattedMessage id="adminCommon.search" />
              </SubmitButton>
              <ExportButton
                disabled={
                  !searchEnable ||
                  (queryResults.list && queryResults.list.length === 0)
                }
                onClick={exportCsvFile}
              >
                {" "}
                <CloudDownload /> <FormattedMessage id="adminCommon.export" />
              </ExportButton>
            </FilterGroup>
          </TableHeadContainer>
          <TableHeadContainer>
            <FilterGroup style={{ maxWidth: "95%", flexWrap: "wrap" }}>
              <div>
                <h5>Search Filter: </h5>
              </div>
              <SelectedChip size="small" label={`${startDate} ~ ${endDate}`} />
              {brand.includes(ALL) && (
                <SelectedChip
                  size="small"
                  label={intl.formatMessage({ id: `eformquery.allBrand` })}
                  onDelete={() => {
                    setBrand([...brand.filter((e) => e !== ALL)]);
                  }}
                />
              )}
              {brandList.map((el) => {
                if (!brand.includes(el.id)) {
                  return null;
                }
                return (
                  <SelectedChip
                    size="small"
                    key={el.id}
                    label={`${el.brandName}`}
                    onDelete={() => {
                      setBrand([...brand.filter((e) => e !== el.id)]);
                    }}
                  />
                );
              })}
              {area.includes(ALL) && (
                <SelectedChip
                  size="small"
                  label={intl.formatMessage({ id: `eformquery.allArea` })}
                  onDelete={() => {
                    setArea([...area.filter((e) => e !== ALL)]);
                  }}
                />
              )}
              {areaList.map((el) => {
                if (!area.includes(el.id)) {
                  return null;
                }
                return (
                  <SelectedChip
                    size="small"
                    key={el.id}
                    label={`${el.areaEname}`}
                    onDelete={() => {
                      setArea([...area.filter((e) => e !== el.id)]);
                    }}
                  />
                );
              })}
              {bgbu.includes(ALL) && (
                <SelectedChip
                  size="small"
                  label={intl.formatMessage({ id: `eformquery.allBgbu` })}
                  onDelete={() => {
                    setBgbu([...bgbu.filter((e) => e !== ALL)]);
                  }}
                />
              )}
              {bgbuList.map((el) => {
                if (!bgbu.includes(el.id)) {
                  return null;
                }
                return (
                  <SelectedChip
                    size="small"
                    key={el.id}
                    label={`${el.bgbuName}`}
                    onDelete={() => {
                      setBgbu([...bgbu.filter((e) => e !== el.id)]);
                    }}
                  />
                );
              })}
              {costDept.includes(ALL) && (
                <SelectedChip
                  size="small"
                  label={intl.formatMessage({ id: `eformquery.allCostCenter` })}
                  onDelete={() => {
                    setCostDept([...costDept.filter((e) => e !== ALL)]);
                  }}
                />
              )}
              {costDeptList.map((el) => {
                if (!costDept.includes(el.costDeptCode)) {
                  return null;
                }
                return (
                  <SelectedChip
                    size="small"
                    key={el.costDeptCode}
                    label={`${el.costDeptCode}`}
                    onDelete={() => {
                      setCostDept([
                        ...costDept.filter((e) => e !== el.costDeptCode),
                      ]);
                    }}
                  />
                );
              })}
              {statusList.map((el) => {
                if (!formStatus.includes(el.statusCode)) {
                  return null;
                }
                return (
                  <SelectedChip
                    size="small"
                    key={el.statusCode}
                    label={`${el.statusNameEN}`}
                    onDelete={() => {
                      setFormStatus([
                        ...formStatus.filter((e) => e !== el.statusCode),
                      ]);
                    }}
                  />
                );
              })}
            </FilterGroup>
            <SearchInput
              value={keyword}
              onChange={handleInput}
              className="searchinput"
              placeholder={intl.formatMessage({ id: `adminCommon.keyword` })}
            ></SearchInput>
            {/* </CInputGroup> */}
          </TableHeadContainer>
        </TableContainer>
        <TableContainer id="eform-query-table" component={Paper}>
          <Table padding="none">
            <TableHead>
              <TableRow>
                {tab !== E_FORM_QUERY_TABS.ONGOING &&
                  tab !== E_FORM_QUERY_TABS.CANCEL &&
                  columns.map((column) => {
                    let columnId = column.id;
                    if (IN_KEY.includes(columnId) && tab === "2") {
                      return null;
                    }
                    if (UN_KEY.includes(columnId) && tab === "1") {
                      return null;
                    }
                    return (
                      <TableCell key={column.id}>
                        <TableSortLabel
                          key={columnId}
                          onClick={() => {
                            sortHandler(columnId);
                          }}
                          active={sortingColumn === columnId}
                          direction={direction}
                          hideSortIcon={Boolean(
                            `${sortingColumn !== columnId}`
                          )}
                        >
                          <FormattedMessage
                            id={`adminCols.eformquery.applications.${column.id}`}
                          />
                        </TableSortLabel>
                      </TableCell>
                    );
                  })}
                {(tab === E_FORM_QUERY_TABS.ONGOING ||
                  tab === E_FORM_QUERY_TABS.CANCEL) &&
                  columns2.map((column) => {
                    return (
                      <TableCell key={column.id}>
                        <TableSortLabel
                          key={column.id}
                          onClick={() => {
                            sortHandler(column.id);
                          }}
                          active={sortingColumn === column.id}
                          direction={direction}
                          hideSortIcon={Boolean(
                            `${sortingColumn !== column.id}`
                          )}
                        >
                          <FormattedMessage
                            id={`adminCols.eformquery.ongoing.${column.id}`}
                          />
                        </TableSortLabel>
                      </TableCell>
                    );
                  })}
              </TableRow>
            </TableHead>
            <TableBody>
              {tab !== E_FORM_QUERY_TABS.ONGOING &&
                tab !== E_FORM_QUERY_TABS.CANCEL &&
                queryResults.viewList.map((result, index) => {
                  console.log("result", result);
                  
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        if (IN_KEY.includes(column.id) && tab === "2") {
                          return null;
                        }
                        if (UN_KEY.includes(column.id) && tab === "1") {
                          return null;
                        }
                        return (
                          <TableCell
                            key={column.id}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.viewCallback(result[column.id])}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              {(tab === E_FORM_QUERY_TABS.ONGOING ||
                tab === E_FORM_QUERY_TABS.CANCEL) &&
                queryResults.viewList.map((result, index) => {
                  console.log("result", result);
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns2.map((column) => {
                        return (
                          <TableCell
                            key={column.id}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.viewCallback(result[column.id], result)}
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
      </CRow>
    </CContainer>
  );
};

const mapStateToProps = (state) => ({
  areaList: state.query.areaList,
  bgbuList: state.authorizationMgt.bgbuList,
  brandList: state.query.brandList,
  costDeptList: state.query.costDeptList,
  statusList: state.query.statusList,
  queryResults: state.query.eForm,
});
const mapDispatchToProps = (dispatch) => ({
  getAreaList: () =>
    dispatch({
      type: "getAreaList",
    }),
  getBgBuList: () =>
    dispatch({
      type: "getBgBuList",
    }),
  getBrandList: () =>
    dispatch({
      type: "getBrandList",
    }),
  getCostDept: () =>
    dispatch({
      type: "getCostDept",
    }),
  getStatusList: (isProcessing) =>
    dispatch({
      type: "getStatusList",
      payload: isProcessing,
    }),
  queryInstallRecords: (
    tab,
    areaIds,
    bgIds,
    brandIds,
    buIds,
    costCenters,
    endDate,
    pageNum,
    pageSize,
    startDate,
    status,
    type
  ) =>
    dispatch({
      type: "queryInstallRecords",
      payload: {
        tab,
        areaIds,
        bgIds,
        brandIds,
        buIds,
        costCenters,
        endDate,
        pageNum,
        pageSize,
        startDate,
        status,
        type,
      },
    }),
  resultController: (
    tab,
    currentPage,
    pageSize,
    keyword,
    sortingColumn,
    isASC
  ) =>
    dispatch({
      type: "resultController",
      payload: { tab, currentPage, pageSize, keyword, sortingColumn, isASC },
    }),
  clearResults: () =>
    dispatch({
      type: Actions.SET_EFORM_QUERY_RESULTS,
      payload: {
        currentPage: 1,
        total: 0,
        pageSize: 10,
        totalPages: 0,
        list: [],
        viewList: [],
      },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EFormQuery);
