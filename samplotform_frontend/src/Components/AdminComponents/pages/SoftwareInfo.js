import { CContainer, CInputGroup, CRow } from "@coreui/react";
import { connect, useSelector } from "react-redux";
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
import TableSortLabel from "@mui/material/TableSortLabel";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import AdminTableFields from "../../../Common/AdminTableFields";
import {
  FilterContainer,
  FilterGroup,
  SearchInput,
  SubmitButton,
  TableHeadContainer,
} from "../uiComponents/AdminCommonUis";
import AdminPagination from "../uiComponents/AdminPagination";
import { ALL, SOFTWARE_INFO_TABS } from "../../../Common/constants";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { CategorySelector, RegionAreaSelector } from 'src/Components/admin/common/unit';

const columns = [...AdminTableFields.SoftwareInfoCols];
const columns2 = [...AdminTableFields.TrialwareInfoCols];
const SoftwareInfo = (props) => {
  const {
    brandList,
    getBrandList,
    getTrialWareBrandList,
    queryResults,
    getInstallationPathList,
    installationPathController,
    trialWareController,
    getTrialWareList,
  } = props;
  const intl = useIntl();
  const [tab, setTab] = useState("1");

  let user = useSelector((state) => state.user.user);
  let areaList = useSelector((state) => state.query.areaList);
  const [brand, setBrand] = useState([]);
  const [brandName, setBrandName] = useState([]);
  const [category, setCategory] = useState(5);
  const [area, setArea] = useState([]);
  const [areaInstall, setAreaInstall] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    // 使用 useEffect 的依赖项来处理 areaList 更新后的逻辑
    const handleAreaListUpdate = () => {
      let areaIds = areaList.filter(areaItem => areaItem.areaEname === user.area);
      if (areaIds.length > 0) {
        setAreaInstall([areaIds[0].id]);
        setArea([areaIds[0].id])
      }
    };

    handleAreaListUpdate(); // 当 areaList 更新时调用此函数（但实际上，由于 areaList 是依赖项，useEffect 会自动重新运行）

    if (tab === "1") {
      getBrandList();
    } else {
      getTrialWareBrandList();
    }
  }, [areaList, user.area, tab]);

  useEffect(() => {
    handleSearch()
  }, [areaInstall, area]);

  const handleBrandChange = (e) => {
    if (tab === "1") {
      if (e.target.value.includes(ALL) && !brand.includes(ALL)) {
        setBrand([ALL]);
      } else if (e.target.value.includes(ALL) && brand.includes(ALL)) {
        let arr = [...e.target.value];
        arr.splice(arr.indexOf(ALL), 1);
        setBrand(arr);
      } else {
        setBrand(e.target.value);
      }
    } else {
      setBrand(e.target.value);
      let arr = brandList.map((bItem) => {
        let brandIds = e.target.value;
        let br = [];
        for (let item of brandIds) {
          if (item === bItem.id) {
            br.push(bItem.brandName);
          }
        }
        return br;
      });
      setBrandName(arr);
    }
  };
  const handleCategoryChange = (value) => {
    setCategory(value);
  };
  const handleAreaInstallChange = (value) => {
    setAreaInstall(value);
  };

  const handleSearch = (e) => {
    if (tab === "1") {
      if (areaInstall.length > 0 && areaInstall[0] === "_all") {
        getInstallationPathList(1, rowsPerPage, brand, [], category);
      } else {
        getInstallationPathList(1, rowsPerPage, brand, areaInstall, category);
      }
    } else {
      if (area.length > 0 && area[0] === "_all") {
        getTrialWareList(1, rowsPerPage, brandName, []);
      } else {
        getTrialWareList(1, rowsPerPage, brandName, area);
      }
    }
    setPage(0);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortingColumn, setSortingColumn] = useState("");
  const [isASC, setIsASC] = useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (tab === "1") {
      installationPathController(
        newPage,
        rowsPerPage,
        keyword,
        sortingColumn,
        isASC
      );
    } else {
      trialWareController(newPage, rowsPerPage, keyword, sortingColumn, isASC);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    let newPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(newPageSize);
    if (tab === "1") {
      installationPathController(0, rowsPerPage, keyword, sortingColumn, isASC);
    } else {
      trialWareController(0, rowsPerPage, keyword, sortingColumn, isASC);
    }
    setPage(0);
  };

  const handleInput = (e) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    if (tab === "1") {
      installationPathController(0, rowsPerPage, keyword, sortingColumn, isASC);
    } else {
      trialWareController(0, rowsPerPage, keyword, sortingColumn, isASC);
    }
    setPage(0);
  }, [keyword, queryResults.list]);

  const sortHandler = (property) => {
    const asc = sortingColumn === property ? !isASC : true;
    setIsASC(asc);
    setSortingColumn(property);
    if (tab === "1") {
      installationPathController(0, rowsPerPage, keyword, sortingColumn, isASC);
    } else {
      trialWareController(0, rowsPerPage, keyword, sortingColumn, isASC);
    }
    setPage(0);
  };

  const handleClickTab = (event, newValue) => {
    setTab(newValue);
    setArea([]);
    setBrand([]);
    if (newValue === SOFTWARE_INFO_TABS.INSTALLATION) {
    }
    if (newValue === SOFTWARE_INFO_TABS.TRIALWARE) {
    }
  };

  const handleAreaChange = (value) => {
    setArea(value);
    // if (e.target.value.includes(ALL) && !area.includes(ALL)) {
    //   setArea([ALL]);
    // } else if (e.target.value.includes(ALL) && area.includes(ALL)) {
    //   let arr = [...e.target.value];
    //   arr.splice(arr.indexOf(ALL), 1);
    //   setArea(arr);
    // } else {
    //   setArea(e.target.value);
    // }
  };

  let direction = isASC ? "asc" : "desc";
  return (
    <CContainer>
      <CRow style={{ marginBottom: "20px" }}>
        <h1>
          <FormattedMessage id="softwareinfo.title" />
        </h1>
      </CRow>
      <CRow>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <Tabs
            value={tab}
            onChange={handleClickTab}
            aria-label="simple tabs example"
          >
            <Tab
              value={SOFTWARE_INFO_TABS.INSTALLATION}
              label={intl.formatMessage({ id: `softwareinfo.tab1` })}
            />
            <Tab
              value={SOFTWARE_INFO_TABS.TRIALWARE}
              label={intl.formatMessage({ id: `softwareinfo.tab2` })}
            />
          </Tabs>
        </div>
        <TableContainer id="eform-query-table" component={Paper}>
          <TableHeadContainer>
            <FilterGroup>
              {tab === SOFTWARE_INFO_TABS.INSTALLATION && (
                <>
                  <FilterContainer>
                    <CategorySelector
                      value={category}
                      onChange={handleCategoryChange}
                    />
                  </FilterContainer>
                  <RegionAreaSelector
                    area={areaInstall}
                    onChange={handleAreaInstallChange}
                    defaultSearch={handleSearch}
                  />
                </>
              )}
              {tab === SOFTWARE_INFO_TABS.TRIALWARE && (
                <FilterContainer>
                  {/* <InputLabel id="brand-select-label">
                    <FormattedMessage id="adminCommon.regionArea" />
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
                        <MenuItem key={el.id} value={el.areaEname}>
                          <Checkbox
                            style={{ color: "#0087DC" }}
                            checked={
                              area.filter((e) => e === el.areaEname).length > 0
                            }
                          />
                          {el.areaEname}
                        </MenuItem>
                      );
                    })}
                  </Select> */}
                  <RegionAreaSelector
                    area={area}
                    onChange={handleAreaChange}
                    defaultSearch={handleSearch}
                  />
                </FilterContainer>
              )}
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
                  renderValue={(selected) =>
                    `${selected.length} items selected`
                  }
                >
                  {(brandList.length && tab === "1") > 0 && (
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
              <SubmitButton onClick={handleSearch}>
                <FormattedMessage id="adminCommon.search" />
              </SubmitButton>
            </FilterGroup>
          </TableHeadContainer>

          <TableHeadContainer>
            <FilterGroup></FilterGroup>
            <CInputGroup style={{ width: "250px" }}>
              <SearchInput
                value={keyword}
                onChange={handleInput}
                className="searchinput"
                placeholder={intl.formatMessage({ id: `adminCommon.keyword` })}
              ></SearchInput>
            </CInputGroup>
          </TableHeadContainer>
          <Table>
            <TableHead>
              <TableRow>
                {tab === SOFTWARE_INFO_TABS.INSTALLATION &&
                  columns.map((column) => {
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
                            id={`adminCols.softwareinfo.${column.id}`}
                          />
                        </TableSortLabel>
                      </TableCell>
                    );
                  })}
                {tab === SOFTWARE_INFO_TABS.TRIALWARE &&
                  columns2.map((column) => {
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
                            id={`adminCols.softwareinfo.${column.id}`}
                          />
                        </TableSortLabel>
                      </TableCell>
                    );
                  })}
              </TableRow>
            </TableHead>
            <TableBody>
              {tab === SOFTWARE_INFO_TABS.INSTALLATION &&
                queryResults.viewList.map((result, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        let value = result[column.id];
                        return <TableCell key={column.id}>{value}</TableCell>;
                      })}
                    </TableRow>
                  );
                })}
              {tab === SOFTWARE_INFO_TABS.TRIALWARE &&
                queryResults.viewList.map((result, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns2.map((column) => {
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
      </CRow>
    </CContainer>
  );
};

const mapStateToProps = (state) => ({
  brandList: state.query.brandList,
  queryResults: state.softwareInfo.installationPath,
});
const mapDispatchToProps = (dispatch) => ({
  getBrandList: () =>
    dispatch({
      type: "getBrandList",
    }),
  getTrialWareBrandList: () =>
    dispatch({
      type: "getBrandList",
      payload: { trialWare: true },
    }),
  getInstallationPathList: (pageNum, pageSize, brandIds, area, catId) =>
    dispatch({
      type: "getInstallationPathList",
      payload: { pageNum, pageSize, brandIds, area, catId },
    }),
  getTrialWareList: (pageNum, pageSize, brands, regions) =>
    dispatch({
      type: "getTrialWareList",
      payload: { pageNum, pageSize, brands, regions },
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
  trialWareController: (currentPage, pageSize, keyword, sortingColumn, isASC) =>
    dispatch({
      type: "trialWareController",
      payload: { currentPage, pageSize, keyword, sortingColumn, isASC },
    }),
  getAreaList: () =>
    dispatch({
      type: "getAreaList",
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SoftwareInfo);
