import React, { createContext, useContext, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { CInputGroup } from "@coreui/react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CloudDownload,
  ErrorOutline as ErrorOutlineIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Search as SearchIcon,
  FileCopy as FileCopyIcon,
} from "@mui/icons-material";
import moment from "moment";

import { exportToExcel, generateTable2 } from "src/Common/commonMethod";
import AdminTableFields from "src/Common/AdminTableFields";
import { ALL, SDP_STATUS_COLORS } from "src/Common/constants";
import { sdpUrl } from "src/Common/common";
import {
  FilterContainer,
  FilterGroup,
  SearchInput,
  SubmitButton,
  TableHeadContainer,
  ExportButton,
} from "../uiComponents/AdminCommonUis";
import AdminPagination from "../uiComponents/AdminPagination";
import ModalContainer from "../uiComponents/ModalContainer";
import { Buttons, BUTTON_TYPES } from "../../common/index";

const PREFIX = "SdpUnprocessedTab";

const classes = {
  arrow: `${PREFIX}-arrow`,
  tooltip: `${PREFIX}-tooltip`,
};

const SDPContext = createContext();
const StyledSDPContextProvider = styled(SDPContext.Provider)(({ theme }) => ({
  [`& .${classes.arrow}`]: {
    "&:before": {
      border: "1px solid #58E06F",
    },
    color: "#58E06F",
  },

  [`& .${classes.tooltip}`]: {
    backgroundColor: "rgb(212, 245, 213)",
    border: "2px solid #60E001",
    color: "rgba(0, 0, 0, 0.87)",
    width: 230,
    height: 300,
    fontSize: theme.typography.pxToRem(12),
    fontWeight: "bold",
  },
}));

const sprUrl = process.env.REACT_APP_SAM_PORTAL_SPR_VIEW;
const columns = [...AdminTableFields.SDPUnprocessed];
const subColumns = [...AdminTableFields.SDPUnprocessedSub];

const ALL_STR = "-1";
const CLOSE_ALL_STR = "1";

const HtmlTooltip = Tooltip;

const NoteModal = (props) => {
  const { intl, noteInfo, toggle, show, saveFunc } = props;

  const [note, setNote] = useState("");
  const handleChange = (e) => {
    if (!!e.target) {
      setNote(e.target.value);
    }
  };

  useEffect(() => {
    if (show) {
      setNote(noteInfo.note);
    }
  }, [show]);

  const handleSave = () => {
    saveFunc(noteInfo.subId, note);
    toggle(false);
    setNote("");
  };
  const handleClose = () => {
    toggle(false);
    setNote("");
  };

  return (
    <ModalContainer
      open={show}
      setOpen={handleClose}
      title={intl.formatMessage({ id: "softwaresdpmgt.noteModal.title" })}
      buttons={<Buttons type={BUTTON_TYPES.SAVE} onClick={handleSave} />}
    >
      <DialogContent style={{ width: "500px" }}>
        <TextField
          style={{ width: "100%", marginTop: "16px" }}
          id="outlined-multiline-static"
          label={intl.formatMessage({ id: "softwaresdpmgt.noteModal.title" })}
          multiline
          rows={4}
          defaultValue=""
          variant="outlined"
          placeholder={intl.formatMessage({
            id: "softwaresdpmgt.noteModal.placeHolder",
          })}
          value={note}
          onChange={handleChange}
        />
      </DialogContent>
    </ModalContainer>
  );
};

const SdpRow = (props) => {
  const { item } = props;

  const copyString = () => {
    let caseIds = [];
    item.subList.forEach((el) => {
      caseIds.push(el.caseId);
    });
    window.navigator.clipboard.writeText(caseIds.join(","));
  };

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="close"
            style={{ color: "#00A0E9", fontSize: "1rem", padding: "0" }}
            onClick={() => {
              copyString();
            }}
            size="large"
          >
            <FileCopyIcon />
          </IconButton>
        </TableCell>
        <TableCell>
          <a target="_blank" href={`${sprUrl}#/?InstanceCode=${item.eForm}&FlowCode=0`}>
            {item.eForm}
          </a>
        </TableCell>
        <TableCell>
          <span style={{ color: "green" }}>{item.status}</span>
        </TableCell>
        <TableCell>
          <span style={{ color: "red" }}>{item.closedAll}</span>
        </TableCell>
        <TableCell>
          <FormattedMessage id={`adminCommon.type${item.type}`} />
        </TableCell>
        <TableCell>{item.area}</TableCell>
        <TableCell>{item.bgbu}</TableCell>
        <TableCell>{item.department}</TableCell>
        <TableCell>{item.applicant}</TableCell>
        <TableCell>
          <HtmlTooltip
            open={showTooltip}
            title={<ReasonTootip desc={item.reason} interactive />}
            aria-label="add"
            arrow
            classes={{
              arrow: classes.arrow,
              tooltip: classes.tooltip,
            }}
          >
            <Button
              onClick={() => {
                setShowTooltip(!showTooltip);
              }}
              onBlur={() => {
                setShowTooltip(false);
              }}
              variant="contained"
              size="small"
              style={{ backgroundColor: "#67C3D0", color: "#fff" }}
            >
              Reason
            </Button>
          </HtmlTooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={AdminTableFields.SDPUnprocessed.length + 1}>
          <div style={{ padding: "20px 4px 4px 60px" }}>
            <SdpSubTable list={item.subList}></SdpSubTable>
          </div>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const ReasonTootip = (props) => {
  const { desc } = props;
  return (
    <div style={{ padding: "16px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div>{desc}</div>
      </div>
    </div>
  );
};

const SdpSubTable = (props) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell style={{ backgroundColor: "#FFD75E" }}>
              <FormattedMessage id="adminCommon.operate" />
            </TableCell>
            {subColumns.map((column) => {
              return (
                <TableCell
                  key={column.id}
                  style={{ backgroundColor: "#FFD75E" }}
                >
                  <FormattedMessage
                    id={`adminCols.softwaresdpmgt.unprocessedSub.${column.id}`}
                  />
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.list.map((el, index) => {
            return <SdpSubRow key={index} subItem={el}></SdpSubRow>;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const SendResult = (props) => {
  const {
    stockId,
    productName,
    applicantNtAccount,
    applyComputer,
    isVIP,
    packageStatus,
    serviceAdStatus,
    bathSccmStatus,
    serviceSccmStatus,
    bathLicenseStatus,
  } = props;

  const styleStrs = { 1: "", 0: "red" };

  return (
    <div style={{ padding: "16px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div>
          <FormattedMessage id="softwaresdpmgt.toolTip.field1" />
        </div>
        <div style={{ color: "", textAlign: "right" }}>{stockId}</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div>
          <FormattedMessage id="softwaresdpmgt.toolTip.field2" />
        </div>
        <div style={{ color: "", textAlign: "right" }}>{productName}</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div>
          <FormattedMessage id="softwaresdpmgt.toolTip.field3" />
        </div>
        <div style={{ color: "", textAlign: "right" }}>
          {applicantNtAccount}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div>
          <FormattedMessage id="softwaresdpmgt.toolTip.field4" />
        </div>
        <div style={{ color: "", textAlign: "right" }}>
          {applyComputer.toUpperCase()}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div>
          <FormattedMessage id="softwaresdpmgt.toolTip.field5" />
        </div>
        <div style={{ color: styleStrs[isVIP + ""], textAlign: "right" }}>
          {<FormattedMessage id={`softwaresdpmgt.vip${isVIP}`} />}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div>
          <FormattedMessage id="softwaresdpmgt.toolTip.field6" />
        </div>
        <div style={{ color: "", textAlign: "right" }}>
          {packageStatus === "A" && (
            <span style={{ color: "red" }}>
              <FormattedMessage id={`softwaresdpmgt.sccm${packageStatus}`} />
            </span>
          )}
          {packageStatus !== "A" && (
            <FormattedMessage id={`softwaresdpmgt.sccm${packageStatus}`} />
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div>
          <FormattedMessage id="softwaresdpmgt.toolTip.field7" />
        </div>
        <div style={{ color: styleStrs[serviceAdStatus], textAlign: "right" }}>
          <FormattedMessage id={`softwaresdpmgt.str${serviceAdStatus}`} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div>
          <FormattedMessage id="softwaresdpmgt.toolTip.field8" />
        </div>
        <div style={{ color: styleStrs[bathSccmStatus], textAlign: "right" }}>
          <FormattedMessage id={`softwaresdpmgt.str${bathSccmStatus}`} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div>
          <FormattedMessage id="softwaresdpmgt.toolTip.field8" />
        </div>
        <div
          style={{ color: styleStrs[serviceSccmStatus], textAlign: "right" }}
        >
          <FormattedMessage id={`softwaresdpmgt.str${serviceSccmStatus}`} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div>
          <FormattedMessage id="softwaresdpmgt.toolTip.field10" />
        </div>
        <div
          style={{ color: styleStrs[bathLicenseStatus], textAlign: "right" }}
        >
          <FormattedMessage id={`softwaresdpmgt.str${bathLicenseStatus}`} />
        </div>
      </div>
    </div>
  );
};
const SdpSubRow = (props) => {
  const { subItem } = props;

  const { isClientTeam, handleAddNote } = useContext(SDPContext);

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <IconButton
          disabled={!isClientTeam}
          aria-label="close"
          style={
            isClientTeam
              ? { color: "#00A0E9", fontSize: "1rem", padding: "0" }
              : { padding: "0" }
          }
          onClick={() => {
            handleAddNote(subItem);
          }}
          size="large"
        >
          <InsertDriveFileIcon />
        </IconButton>
      </TableCell>
      <TableCell>
        {subItem.sdpCaseId === "-" ? (
          subItem.sdpCaseId
        ) : (
          <a target="_blank" href={`${sdpUrl}${subItem.sdpCaseId}`}>
            {subItem.sdpCaseId}
          </a>
        )}
      </TableCell>
      <TableCell>
        <span style={{ color: SDP_STATUS_COLORS[subItem.sdpStatus + ""] }}>
          <FormattedMessage id={`softwaresdpmgt.str${subItem.sdpStatus}`} />
        </span>
      </TableCell>
      <TableCell>{subItem.subject}</TableCell>
      <TableCell>{subItem.vendor}</TableCell>
      <TableCell>{subItem.solution}</TableCell>
      <TableCell>{subItem.creatTime}</TableCell>
      <TableCell>{subItem.updateTime}</TableCell>
      <TableCell>
        <HtmlTooltip
          open={showTooltip}
          title={<SendResult {...subItem} interactive />}
          aria-label="add"
          arrow
          classes={{
            arrow: classes.arrow,
            tooltip: classes.tooltip,
          }}
        >
          <Button
            onClick={() => {
              setShowTooltip(!showTooltip);
            }}
            onBlur={() => {
              setShowTooltip(false);
            }}
            variant="contained"
            size="small"
            style={{ backgroundColor: "#67C3D0", color: "#fff" }}
          >
            Smart IT
          </Button>
        </HtmlTooltip>
      </TableCell>
    </TableRow>
  );
};

const SdpUnprocessedTab = (props) => {
  const {
    unprocessedInfo,
    initData,
    createNote,
    isClientTeam,
    exportUnporcessed,
    setDisabled,
    getAreaList,
    areaList,
  } = props;

  const { sdpTotal, sdpOpen, sdpClose } = unprocessedInfo;

  const intl = useIntl();
  const [type, setType] = useState(ALL);
  const [startDate, setStartDate] = useState(
    moment().subtract(90, "days").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [isCloseAll, setIsCloseAll] = useState(ALL_STR);
  const [area, setArea] = useState(ALL);

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteInfo, setNoteInfo] = useState({});
  const [searchStartDate, setSearchStartTime] = useState(startDate);
  const [searchEndDate, setSearchEndTime] = useState(endDate);
  const [searchType, setSearchType] = useState(type);
  const columns1 = [...AdminTableFields.SDPProcessedExportCols];
  let isEn = props.locale === "en-US";
  useEffect(() => {
    getAreaList();
    handleSearch();
  }, []);

  const handleSearch = (e) => {
    let mEnd = moment(`${endDate} 23:59:59`);
    let mStart = moment(`${startDate} 00:00:00`);
    if (!mEnd.isAfter(mStart)) {
      alert("Invalid date range"); // TODO date vaidation
      return;
    }
    let endStr = mEnd.format("YYYY-MM-DD HH:mm:ss");
    let startStr = mStart.format("YYYY-MM-DD HH:mm:ss");

    let formType = type === ALL ? ALL_STR : type;
    initData(
      0,
      rowsPerPage,
      keyword,
      endStr,
      startStr,
      formType,
      isCloseAll,
      area === ALL ? null : area
    );
    setPage(0);
  };

  useEffect(() => {
    let mEnd = moment(`${endDate} 23:59:59`).format("YYYY-MM-DD HH:mm:ss");
    let mStart = moment(`${startDate} 00:00:00`).format("YYYY-MM-DD HH:mm:ss");
    let formType = type === ALL ? ALL_STR : type;
    setSearchStartTime(mStart);
    setSearchEndTime(mEnd);
    setSearchType(formType);
  }, [startDate, endDate, type]);

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };
  const handleStartDateChange = (e) => {
    let mEnd = moment(`${endDate} 23:59:59`);
    let mStart = moment(`${e.target.value} 00:00:00`);
    if (!mEnd.isAfter(mStart)) {
      return;
    }
    setStartDate(e.target.value);
    setKeyword("");
  };
  const handleEndDateChange = (e) => {
    let mEnd = moment(`${e.target.value} 23:59:59`);
    let mStart = moment(`${startDate} 00:00:00`);
    if (!mEnd.isAfter(mStart)) {
      return;
    }
    setEndDate(e.target.value);
    setKeyword("");
  };

  const handleIsCloseAll = (e) => {
    setIsCloseAll(e.target.value);
  };
  const handleInput = (e) => {
    setKeyword(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    initData(
      newPage,
      rowsPerPage,
      keyword,
      searchEndDate,
      searchStartDate,
      searchType,
      isCloseAll,
      area === ALL ? null : area
    );
  };

  const handleChangeRowsPerPage = (event) => {
    let newPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(newPageSize);
    initData(
      0,
      newPageSize,
      keyword,
      searchEndDate,
      searchStartDate,
      searchType,
      isCloseAll,
      area === ALL ? null : area
    );
    setPage(0);
  };
  useEffect(() => {
    let mEnd = moment(`${endDate} 23:59:59`);
    let mStart = moment(`${startDate} 00:00:00`);
    if (!mEnd.isAfter(mStart)) {
      alert("Invalid date range"); // TODO date vaidation
      return;
    }
    let endStr = mEnd.format("YYYY-MM-DD HH:mm:ss");
    let startStr = mStart.format("YYYY-MM-DD HH:mm:ss");

    let formType = type === ALL ? ALL_STR : type;
    initData(
      0,
      rowsPerPage,
      keyword,
      endStr,
      startStr,
      formType,
      isCloseAll,
      area === ALL ? null : area
    );
    setPage(0);
  }, [keyword]);

  const handleAddNote = (item) => {
    setNoteInfo({
      subId: item.smartitSubId,
      note: item.adminNote,
    });
    setShowNoteModal(true);
  };

  const sdpContextValue = {
    isClientTeam,
    handleAddNote,
  };

  const exportCsvFile = () => {
    exportUnporcessed(
      null,
      0,
      keyword,
      searchEndDate,
      searchStartDate,
      searchType,
      isCloseAll
    );
  };
  useEffect(() => {
    if (unprocessedInfo.disabled === 1) {
      exportToExcel(generateTable2(columns1, unprocessedInfo.exportList));
      setDisabled();
    }
  }, [unprocessedInfo.exportList]);
  return (
    <StyledSDPContextProvider value={sdpContextValue}>
      <React.Fragment>
        <TableContainer component={Paper}>
          <TableHeadContainer>
            <FilterGroup>
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
              <FilterContainer>
                <InputLabel id="formtype-select-label">
                  <FormattedMessage id="softwaresdpmgt.completeness" />
                </InputLabel>
                <Select
                  variant="standard"
                  labelId="formtype-select-label"
                  id="formtype-select"
                  value={isCloseAll}
                  onChange={handleIsCloseAll}
                >
                  <MenuItem value={CLOSE_ALL_STR}>
                    {intl.formatMessage({ id: `softwaresdpmgt.closeAll` })}
                  </MenuItem>
                  <MenuItem value={ALL_STR}>
                    {intl.formatMessage({ id: `softwaresdpmgt.all` })}
                  </MenuItem>
                </Select>
              </FilterContainer>
              <FilterContainer>
                <InputLabel id="area-select-label">
                  <FormattedMessage id="softwaresdpmgt.area" />
                </InputLabel>
                <Select
                  variant="standard"
                  labelId="area-select-label"
                  id="area-select"
                  onChange={(e) => setArea(e.target.value)}
                  value={area}
                >
                  <MenuItem id="all" value={ALL}>
                    ALL
                  </MenuItem>
                  {areaList.map((area, index) => (
                    <MenuItem key={index} id={area.areaId} value={area.areaId}>
                      {isEn ? area.areaEname : area.areaLname}
                    </MenuItem>
                  ))}
                </Select>
              </FilterContainer>
            </FilterGroup>
            <FilterGroup>
              <div style={{ paddingRight: "6px" }}>
                <ExportButton variant="contained" onClick={exportCsvFile}>
                  {" "}
                  <CloudDownload /> <FormattedMessage id="adminCommon.export" />
                </ExportButton>
              </div>
              <SubmitButton onClick={handleSearch}>
                {" "}
                <SearchIcon />
                <FormattedMessage id="adminCommon.search" />
              </SubmitButton>
            </FilterGroup>
          </TableHeadContainer>
          <TableHeadContainer>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#FACB16",
                borderRadius: "1rem",
                padding: "6px",
              }}
            >
              <ErrorOutlineIcon />
              <div style={{ marginLeft: "2px", fontSize: "16px" }}>
                <span>
                  <FormattedMessage id="softwaresdpmgt.sprQuantity" />
                </span>
                <span style={{ color: "red" }}>{`${sdpTotal}  `}</span>
                <span>
                  <FormattedMessage id="softwaresdpmgt.sprOpen" />
                </span>
                <span style={{ color: "red" }}>{`${sdpOpen}  `}</span>
                <span>
                  <FormattedMessage id="softwaresdpmgt.sprClose" />
                </span>
                <span style={{ color: "red" }}>{`${sdpClose}  `}</span>
              </div>
            </div>
            <CInputGroup style={{ minWidth: "250px", width: "250px" }}>
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
                <TableCell>
                  <FormattedMessage id="adminCommon.operate" />
                </TableCell>
                {columns.map((column) => {
                  return (
                    <TableCell key={column.id}>
                      <FormattedMessage
                        id={`adminCols.softwaresdpmgt.unprocessed.${column.id}`}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {unprocessedInfo.viewList.map((el, index) => {
                return <SdpRow key={index} item={el}></SdpRow>;
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer component={Paper}>
          <AdminPagination
            queryResults={unprocessedInfo}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            rowsPerPage={rowsPerPage}
          ></AdminPagination>
        </TableContainer>
        <NoteModal
          intl={intl}
          noteInfo={noteInfo}
          show={showNoteModal}
          toggle={setShowNoteModal}
          saveFunc={createNote}
        ></NoteModal>
      </React.Fragment>
    </StyledSDPContextProvider>
  );
};

const mapStateToProps = (state) => ({
  unprocessedInfo: state.sdp.unprocessed,
  areaList: state.sdp.areaList,
  locale: state.view.currentLocale,
});
const mapDispatchToProps = (dispatch) => ({
  initData: (
    pageNum,
    pageSize,
    keyword,
    applicationRangeE,
    applicationRangeS,
    formType,
    isClosedAll,
    areaId
  ) =>
    dispatch({
      type: "initSDPUnprocessedData",
      payload: {
        pageNum: pageNum + 1,
        pageSize,
        keyword,
        applicationRangeE,
        applicationRangeS,
        formType,
        isClosedAll,
        areaId,
      },
    }),
  createNote: (subId, note) =>
    dispatch({
      type: "createNote",
      payload: { subId, note },
    }),
  exportUnporcessed: (
    pageNum,
    pageSize,
    keyword,
    applicationRangeE,
    applicationRangeS,
    formType,
    isClosedAll
  ) =>
    dispatch({
      type: "exportUnporcessed",
      payload: {
        pageNum,
        pageSize,
        keyword,
        applicationRangeE,
        applicationRangeS,
        formType,
        isClosedAll,
      },
    }),
  setDisabled: () =>
    dispatch({
      type: "setDisabled",
      payload: { num: 1 },
    }),
  getAreaList: () =>
    dispatch({
      type: "getArea",
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(SdpUnprocessedTab);
