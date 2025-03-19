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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloudDownload from "@mui/icons-material/CloudDownload";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import AdminTableFields from "../../../Common/AdminTableFields";
import { Actions, ALL } from "../../../Common/constants";
import { BUTTON_TYPES, Buttons } from "src/Components/common";
import {
  FilterContainer,
  FilterGroup,
  SearchInput,
  SubmitButton,
  ExportButton,
  TableHeadContainer,
} from "./AdminCommonUis";
import AdminPagination from "./AdminPagination";
import EditSWInfoMaintain from "./EditSWInfoMaintain";

const columns = [...AdminTableFields.SwInfoMaintainTabTabCols];

const SWInfoMaintainTab = (props) => {
  const {
    swBrandList,
    getSWBrandList,
    getSoftwareInfo,
    getSoftwareInfoExport,
    updateSWSoftwareInfo,
    swSoftwareInfoList,
    setShowAlert,
  } = props;
  const intl = useIntl();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortingColumn, setSortingColumn] = useState("Modified");
  const [isASC, setIsASC] = useState(false);
  const [versionDate, setVersionDate] = useState(new Date());
  const [source, setSource] = useState(ALL);
  const [brand, setBrand] = useState(ALL);

  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState(true);
  const [newSwSoftwareInfoList, setNewSwSoftwareInfoList] = useState([]);
  const [newSWbrand, setNewSWbrand] = useState(null);
  
  useEffect(() => {
    getSWBrandList();
    query();
  }, []);

  useEffect(() => {
    // 遍历content数组中的每个元素  
    if(swSoftwareInfoList.hasOwnProperty('content')){
        swSoftwareInfoList.content.forEach(item => {  
        if (item.brandId === null) {  
          // 如果brandId为null，则进行复制操作   
          item.brandName = item.swCollectionBrandName;  
        }  
      });  
        setNewSwSoftwareInfoList(swSoftwareInfoList.content)
    }else{
      setNewSwSoftwareInfoList([])
    }
  }, [swSoftwareInfoList]);

  const sourceList = [
    { id: 1, name: "Manual", value: "manual" },
    { id: 2, name: "System", value: "system" },
  ];

  const handleVersionDateChange = (value) => {
    setVersionDate(new Date(value));
  };

  const handleBrandChange = (e) => {
    let currBrandId = e.target.value
    if(currBrandId.toString().length > 6){
      let filterArr = swBrandList.filter(item =>{return currBrandId===item.brandId})
      if(filterArr.length >0){
        setNewSWbrand(filterArr[0].swCollectionBrandId);
        setBrand(currBrandId);
      }
    }else{
      setBrand(currBrandId);
      setNewSWbrand(null);
    }
  };
  const handleSourceChange = (e) => {
    setSource(e.target.value);
  };
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };
  const handleSearch = (e) => {
    query();
    setPage(0);
  };

  const query = () => {
    getSoftwareInfo({
      pageNum: page,
      pageSize: rowsPerPage,
      keyword: keyword,
      brandId: brand,
      swCollectionBrandId:newSWbrand,
      sourceSystemId: source,
      year: versionDate,
      status: status,
    });
  };

  const handleChangePage = (event, newPage) => {
    getSoftwareInfo({
      pageNum: newPage,
      pageSize: rowsPerPage,
      keyword: keyword,
      brandId: brand,
      swCollectionBrandId:newSWbrand,
      sourceSystemId: source,
      year: versionDate,
      status: status,
    });
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    let newPageSize = parseInt(event.target.value, 10);
    getSoftwareInfo({
      pageNum: 0,
      pageSize: newPageSize,
      keyword: keyword,
      brandId: brand,
      swCollectionBrandId:newSWbrand,
      sourceSystemId: source,
      year: versionDate,
      status: status,
    });
    setRowsPerPage(newPageSize);
    setPage(0);
  };

  const handleInput = (e) => {
    setKeyword(e.target.value);
    getSoftwareInfo({
      pageNum: 0,
      pageSize: rowsPerPage,
      keyword: e.target.value,
      brandId: brand,
      swCollectionBrandId:newSWbrand,
      sourceSystemId: source,
      year: versionDate,
      status: status,
    });
  };

  const exportCsvFile = (e) => {
    getSoftwareInfoExport({
      keyword: keyword,
      brandId: brand,
      swCollectionBrandId:newSWbrand,
      sourceSystemId: source,
      year: versionDate,
      status: status,
    });
  };

  const sortHandler = (property) => {
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
        updateSWSoftwareInfo({
          swCollectionNewSWId: item.id.assetId,
          brandId: item.brandId,
          type: "delete",
        });
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  variant="inline"
                  openTo="year"
                  views={["year"]}
                  label={intl.formatMessage({
                    id: `swCollectionMgt.swinfoModal.version`,
                  })}
                  value={dayjs(versionDate)}
                  onChange={handleVersionDateChange}
                />
              </LocalizationProvider>
            </FilterContainer>
            <FilterContainer>
              <InputLabel id="source-select-label">
                <FormattedMessage id="swCollectionMgt.swinfoModal.source" />
              </InputLabel>
              <Select
                variant="standard"
                labelId="source-select-label"
                id="source-select"
                value={source}
                onChange={handleSourceChange}
              >
                <MenuItem key={0} value={ALL}>
                  All
                </MenuItem>
                {sourceList.map((el) => {
                  return (
                    <MenuItem key={el.id} value={el.id}>
                      {el.name}
                    </MenuItem>
                  );
                })}
              </Select>
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
                {swBrandList.map((el) => {
                  return (
                    <MenuItem key={el.brandId} value={el.brandId}>
                      {el.brandName}
                    </MenuItem>
                  );
                })}
              </Select>
            </FilterContainer>
            <FilterContainer>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                variant="standard"
                labelId="status-select-label"
                id="status-select"
                value={status}
                onChange={handleStatusChange}
              >
                <MenuItem value={ALL}>All</MenuItem>
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </FilterContainer>
          </FilterGroup>
          <FilterGroup>
            <SubmitButton onClick={handleSearch}>
              <FormattedMessage id="adminCommon.search" />
            </SubmitButton>
            <ExportButton onClick={exportCsvFile}>
              {" "}
              <CloudDownload /> <FormattedMessage id="adminCommon.export" />
            </ExportButton>
          </FilterGroup>
        </TableHeadContainer>
        <TableHeadContainer>
          <Buttons type={BUTTON_TYPES.ADD} onClick={handleAdd} />
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
                    <TableSortLabel
                      onClick={() => {
                        sortHandler(column.id);
                      }}
                      active={sortingColumn === column.id}
                      direction={direction}
                      hideSortIcon={sortingColumn !== column.id}
                    >
                      <FormattedMessage
                        id={`swCollectionMgt.swinfoModal.${column.id}`}
                      />
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {newSwSoftwareInfoList.map((result, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell style={{ minWidth: "65px" }}>
                    {result.source === "mannual" && (
                      <DeleteIcon
                        onClick={() => {
                          handleDelete(result);
                        }}
                        style={{ color: "#FF5252" }}
                      />
                    )}
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
          queryResults={{
            total: swSoftwareInfoList.page.totalElements,
            totalPages: swSoftwareInfoList.page.totalPages,
          }}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={rowsPerPage}
        ></AdminPagination>
      </TableContainer>
      <EditSWInfoMaintain
        key={openEdit}
        show={openEdit}
        item={editTarget}
        toggleFunc={setOpenEdit}
      />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  swBrandList: state.swCollection.swBrandList,
  swSoftwareInfoList: state.swCollection.swSoftwareInfoList,
  swSoftwareInfoExportList: state.swCollection.swSoftwareInfoExportList,
});
const mapDispatchToProps = (dispatch) => ({
  getSWBrandList: () =>
    dispatch({
      type: "getSWBrandList",
    }),
  getSoftwareInfo: ({
    pageNum,
    pageSize,
    keyword,
    brandId,
    swCollectionBrandId,
    sourceSystemId,
    year,
    status,
  }) =>
    dispatch({
      type: "getSWSoftwareInfoList",
      payload: {
        pageNum,
        pageSize,
        keyword,
        brandId,
        swCollectionBrandId,
        sourceSystemId,
        year,
        status,
      },
    }),
  getSoftwareInfoExport: ({ keyword, brandId,swCollectionBrandId, sourceSystemId, year, status }) =>
    dispatch({
      type: "getSoftwareInfoExport",
      payload: { keyword, brandId,swCollectionBrandId, sourceSystemId, year, status },
    }),
  updateSWSoftwareInfo: ({
    swCollectionNewSWId,
    brandId,
    mainFlag,
    mainSoftDetail,
    oldSoftDetail,
    productName,
    referenceCurrency,
    referencePrice,
    type,
  }) =>
    dispatch({
      type: "updateSWSoftwareInfo",
      payload: {
        swCollectionNewSWId,
        brandId,
        mainFlag,
        mainSoftDetail,
        oldSoftDetail,
        productName,
        referenceCurrency,
        referencePrice,
        type,
      },
    }),
  setShowAlert: (props) =>
    dispatch({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props,
      },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SWInfoMaintainTab);
