import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { CInputGroup } from "@coreui/react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import { Button, Tooltip } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import FreewareReviewEdit from "./FreewareReviewEdit";
import { RegionAreaSelector } from "src/Components/admin/common/unit";
import { BlueDotTooltip } from "src/Components/admin/common/unit/index";
import {
  ALL,
  REVIEWED,
  UNREVIEWED,
  SW_ASSET_EDIT_INFO,
} from "../../../Common/constants";
import AdminPagination from "../uiComponents/AdminPagination";
import {
  TableHeadContainer,
  SearchInput,
  SubmitButton,
  FilterContainer,
  FilterGroup,
} from "./AdminCommonUis";
import moment from "moment";
import ReviewNoteEditor from "./FreewareReviewNoteEditor";
import { ACTIONS } from "../../../Reducers/FreewareReviewReducer";
export const truncateText = (text, maxLength = 20) => {
  return text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
const sprUrl = process.env.REACT_APP_SAM_PORTAL_SPR_VIEW;
// 修改后的表格列定义
const columns = [
  {
    id: "reviewStatus",
    label: "Review Status",
    viewCallback: (value) => value,
  },
  {
    id: "formId",
    label: "E-Form",
    viewCallback: (value) => (
      <a target="_blank" href={`${sprUrl}#/?InstanceCode=${value}&FlowCode=0`}>
        {value}
      </a>
    ),
  },
  {
    id: "applyBrand",
    label: "Apply Brand",
    viewCallback: (value) => value,
  },
  {
    id: "applyName",
    label: "Apply Name",
    viewCallback: (value) => value,
  },
  {
    id: "type",
    label: "Type",
    viewCallback: (value) => value,
  },
  {
    id: "version",
    label: "Version",
    viewCallback: (value) => value,
  },
  {
    id: "applicant",
    label: "Applicant",
    viewCallback: (value) => value,
  },
  {
    id: "sourceUrl",
    label: "Source Url",
    viewCallback: (value) => value,
  },
  {
    id: "applyDate",
    label: "Apply Date",
    viewCallback: (value) => value,
  },
  {
    id: "area",
    label: "Area",
    viewCallback: (value) => value,
  },
  {
    id: "bgBu",
    label: "BGBU",
    viewCallback: (value) => value,
  },
  {
    id: "department",
    label: "Department",
    viewCallback: (value) => value,
  },
  {
    id: "applyReason",
    label: "Apply Reason",
    viewCallback: (value) => truncateText(value),
    isButton: true,
  },
  {
    id: "legalOpinion",
    label: "Legal Opinion",
    viewCallback: (value) => truncateText(value),
    isButton: true,
  },
  {
    id: "revieeNote",
    label: "Review Note",
    viewCallback: (value) => truncateText(value),
    isButton: true,
  },
];

// FreewareReviewTab 组件，用于展示安装路径相关信息
const FreewareReviewTab = (props) => {
  const {
    getFreewareReviewList,
    areaList,
    getAreaList,
    brandList,
    getBrandList,
    message,
    saveReviewNote,
    editFreewareReview,
  } = props;

  // 筛选条件相关状态
  const [startDate, setStartDate] = useState(
    moment().subtract(90, "days").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [type, setType] = useState(ALL);
  const [keyword, setKeyword] = useState("");
  const [area, setArea] = useState("");
  const [content, setContent] = useState("");
  const [areaInstall, setAreaInstall] = useState("");
  const [labelText, setLabelText] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");
  let user = useSelector((state) => state.user.user);
  const intl = useIntl();
  // 分页相关状态
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // ReviewNoteEditor 相关状态
  const [openReviewNoteEditor, setOpenReviewNoteEditor] = useState(false);
  const [currentReviewItem, setCurrentReviewItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modifyData, setModifyData] = useState(
    SW_ASSET_EDIT_INFO.FREEWARE_REVIEW_EDIT
  );
  const dataList = useSelector(
    (state) =>
      state?.freewareReview?.freewarereveiver?.freewarereveiver?.content ?? []
  );
  const total = useSelector(
    (state) =>
      state?.freewareReview?.freewarereveiver?.freewarereveiver?.page
        ?.totalElements ?? 0
  );
  const totalPages = useSelector(
    (state) =>
      state?.freewareReview?.freewarereveiver?.freewarereveiver?.page
        ?.totalPages ?? 1
  );
  // 初始化数据加载
  useEffect(() => {
    getBrandList();
    getAreaList();
  }, []);

  // 初始化区域和搜索
  useEffect(() => {
    if (areaList.length > 0 && user?.area) {
      const userAreaIds = areaList.filter(
        (areaItem) => areaItem.areaEname === user.area
      );
      
      if (userAreaIds.length > 0) {
        const userAreaId = userAreaIds[0].id;
        setAreaInstall(userAreaId);
        setArea(userAreaId);
        
        // 只在初始化时执行一次搜索
        const initialParams = {
          applyDateStart: startDate,
          applyDateEnd: endDate,
          reviewStatus: Object.is(type, ALL) ? null : type,
          area: userAreaId,
          key: keyword,
          pageSize: rowsPerPage,
          pageNumber: page,
        };
        
        setParams(initialParams);
        getFreewareReviewList(initialParams);
      }
    }
  }, [areaList, user]);

  // 处理关键词变化
  useEffect(() => {
    if (keyword !== undefined) {  // 避免初始化时触发
      setPage(0);
      handleSearch();
    }
  }, [keyword]);

  // 处理开始日期变化，确保开始日期小于结束日期
  const handleStartDateChange = (e) => {
    let mEnd = moment(`${endDate} 23:59:59`);
    let mStart = moment(`${e.target.value} 00:00:00`);
    if (!mEnd.isAfter(mStart)) {
      return;
    }
    setStartDate(e.target.value);
  };
  const handleModify = (freeware) => {
    if (freeware.applyName) {
      setModifyData({
        ...freeware,
      });
    } else {
      setModifyData(SW_ASSET_EDIT_INFO.EDIT_INFO);
    }
    setShowModal(true);
  };
  // 处理结束日期变化，确保结束日期大于开始日期
  const handleEndDateChange = (e) => {
    let mEnd = moment(`${e.target.value} 23:59:59`);
    let mStart = moment(`${startDate} 00:00:00`);
    if (!mEnd.isAfter(mStart)) {
      return;
    }
    setEndDate(e.target.value);
  };

  // 处理类型筛选条件变化
  const handleTypeChange = (e) => {
    setType(e.target.value);
  };
  const [params, setParams] = useState({
    applyDateStart: "",
    applyDateEnd: "",
    reviewStatus: "",
    area: "",
    key: "",
    pageSize: "",
    pageNumber: "",
    sort: null,
    "un-page": false,
  });

  // 处理搜索按钮点击事件
  const handleSearch = () => {
    let mEnd = moment(`${endDate}`);
    let mStart = moment(`${startDate}`);
    if (!mEnd.isAfter(mStart)) {
      alert("Invalid date range");
      return;
    }

    let endStr = mEnd.format("YYYY-MM-DD");
    let startStr = mStart.format("YYYY-MM-DD");
    
    const currentArea = Array.isArray(area) ? area[0] : area;
    const searchArea = currentArea || user?.area;
    
    if (!searchArea) {
      console.warn('No area selected');
      return;
    }
    
    // 重置页码为0
    setPage(0);
    
    const newParams = {
      applyDateStart: Object.is(startStr, "") ? null : startStr,
      applyDateEnd: Object.is(endStr, "") ? null : endStr,
      reviewStatus: Object.is(type, ALL) ? null : type,
      area: searchArea,
      key: keyword,
      pageSize: rowsPerPage,
      pageNumber: 0, // 搜索时重置为第一页
    };

    setParams(newParams);
    getFreewareReviewList(newParams);
  };
  // 处理页码变化
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getFreewareReviewList({
      ...params,
      pageNumber: newPage,
      pageSize: rowsPerPage,
    });
  };

  // 处理输入框输入变化
  const handleInput = (e) => {
    setKeyword(e.target.value);
    setPage(0); // 重置页码为0

    const newParams = {
      ...params,
      key: e.target.value,
      pageNumber: 0, // 搜索时重置为第一页
    };

    setParams(newParams);
    getFreewareReviewList(newParams);
  };
  
  const handleAreaChange = (value) => {
    setArea(value[0]);
  };
  // 处理 Review Note 按钮点击事件
  const handleReviewNoteClick = (item, label, title, value) => {
    setContent(value);
    setLabelText(label);
    setDialogTitle(title);
    setCurrentReviewItem(item);
    setOpenReviewNoteEditor(true);
  };

  // 处理 ReviewNoteEditor 保存操作
  const handleSaveReviewNote = ({ note, formId }) => {
    const saveParams = {
      formId,
      note,
    };
    const queryParams = { ...params };
    saveReviewNote(saveParams, queryParams);
    setOpenReviewNoteEditor(false);
  };
  // 处理每页显示行数变化
  const handleChangeRowsPerPage = (event) => {
    let newPageSize = parseInt(event.target.value, 10);
    setPage(0); // 重置页码为0
    
    const newParams = {
      ...params,
      pageSize: newPageSize,
      pageNumber: 0,
    };

    setParams(newParams);
    getFreewareReviewList(newParams);

    setRowsPerPage(newPageSize);
  };
  // 处理 ReviewNoteEditor 关闭操作
  const handleCloseReviewNoteEditor = () => {
    setOpenReviewNoteEditor(false);
  };

  return (
    <React.Fragment>
      <TableContainer id="eform-query-table" component={Paper}>
        {/* 搜索条件容器 */}
        <TableHeadContainer>
          <FilterGroup>
            {/* 开始日期筛选 */}
            <FilterContainer>
              <TextField
                variant="standard"
                id="dateStart"
                label={intl.formatMessage({ id: `freewarereview.start` })}
                type="date"
                onChange={handleStartDateChange}
                value={startDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FilterContainer>
            {/* 结束日期筛选 */}
            <FilterContainer>
              <TextField
                variant="standard"
                id="dateEnd"
                label={intl.formatMessage({ id: `freewarereview.end` })}
                type="date"
                onChange={handleEndDateChange}
                value={endDate}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FilterContainer>
            {/* 审核状态筛选 */}
            <FilterContainer>
              <InputLabel id="formtype-select-label">
                <FormattedMessage id="adminCommon.status" />
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
                <MenuItem value={UNREVIEWED}>
                  {intl.formatMessage({ id: `freewarereview.unreviewed` })}
                </MenuItem>
                <MenuItem value={REVIEWED}>
                  {intl.formatMessage({ id: `freewarereview.reviewed` })}
                </MenuItem>
              </Select>
            </FilterContainer>
            {/* 区域筛选 */}
            <FilterContainer>
              <RegionAreaSelector
                area={areaInstall}
                multiple={false}
                onChange={handleAreaChange}
                defaultSearch={handleSearch}
              />
            </FilterContainer>
          </FilterGroup>
          {/* 搜索按钮 */}
          <FilterGroup>
            <SubmitButton onClick={handleSearch}>
              <SearchIcon />
              <FormattedMessage id="adminCommon.search" />
            </SubmitButton>
          </FilterGroup>
        </TableHeadContainer>
        {/* 搜索输入框容器，添加样式使右对齐 */}
        <TableHeadContainer
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <CInputGroup style={{ width: "250px" }}>
            <SearchInput
              value={keyword}
              onChange={handleInput}
              className="searchinput"
              placeholder="Enter Keyword"
            />
          </CInputGroup>
        </TableHeadContainer>
      </TableContainer>
      {/* 表格容器 */}
      <TableContainer id="eform-query-table" component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {/* 操作列 */}
              <TableCell>
                <FormattedMessage id="adminCommon.operate" />
              </TableCell>
              {/* 渲染表格表头 */}
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* 渲染表格数据 */}
            {dataList?.map((result, index) => {
              const isUnreviewed = result.reviewStatus === UNREVIEWED;
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell style={{ minWidth: "65px" }}>
                    {/* 根据 Review Status 决定是否显示编辑按钮 */}
                    {isUnreviewed && (
                      <EditIcon
                        onClick={() => handleModify(result)}
                        style={{ color: "var(--success-color)" }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{result["reviewStatus"]}</TableCell>
                  {columns.slice(1).map((column) => {
                    let value = result[column.id];
                    if (column.isButton) {
                      if (
                        column.id === "applyReason" ||
                        column.id === "legalOpinion" ||
                        column.id === "revieeNote"
                      ) {
                        return (
                          <TableCell key={column.id}>
                            <Button
                              variant="contained"
                              size="small"
                              style={{
                                backgroundColor: "rgba(103, 195, 208, 0.9)",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onClick={() =>
                                handleReviewNoteClick(
                                  result,
                                  column.id,
                                  column.label,
                                  value
                                )
                              }
                            >
                              {column.id
                                .match(/^[a-z]+|[A-Z][a-z]*$/g)[1]
                                .toUpperCase()}
                            </Button>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={column.id}>
                          <Button
                            variant="contained"
                            size="small"
                            style={{
                              backgroundColor: "#67C3D0",
                              color: "#fff",
                            }}
                          >
                            {column.viewCallback(value)}
                          </Button>
                        </TableCell>
                      );
                    }
                    if (column.id === "formId") {
                      return (
                        <TableCell key={column.id}>
                          {column.viewCallback(value)}
                        </TableCell>
                      );
                    }
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
      {/* 分页组件容器 */}
      <TableContainer id="eform-query-table" component={Paper}>
        <AdminPagination
          queryResults={{
            totalPages: totalPages,
            total: total,
          }}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={rowsPerPage}
        />
      </TableContainer>
      {/* Review Note 编辑视窗 */}
      <ReviewNoteEditor
        show={openReviewNoteEditor}
        item={currentReviewItem}
        labelText={labelText}
        dialogTitle={dialogTitle}
        content={content}
        onClose={handleCloseReviewNoteEditor}
        onSave={handleSaveReviewNote}
      />
      <FreewareReviewEdit
        key={showModal}
        show={showModal}
        page={page}
        rowsPerPage={rowsPerPage}
        toggle={setShowModal}
        intl={intl}
        message={message}
        focusFreeware={modifyData}
        brandList={brandList}
        getBrandList={getBrandList}
        onSave={editFreewareReview}
        queryParams={params}
      />
    </React.Fragment>
  );
};

// 将 Redux 状态映射到组件的 props
const mapStateToProps = (state) => ({
  areaList: state.query.areaList,
  brandList: state.swAsset.freewareBrandList,
  message: state.freewareReview.message,
});

// 将 Redux 动作映射到组件的 props
const mapDispatchToProps = (dispatch) => ({
  getAreaList: () =>
    dispatch({
      type: "getAreaList",
    }),

  getFreewareReviewList: ({
    applyDateStart,
    applyDateEnd,
    reviewStatus,
    area,
    key,
    pageSize,
    pageNumber,
  }) =>
    dispatch({
      type: ACTIONS.GET_FREEWARE_REVIEW_LIST,
      payload: {
        applyDateStart,
        applyDateEnd,
        reviewStatus,
        area,
        key,
        pageSize,
        pageNumber: pageNumber + 1,
        sort: null,
        "un-page": false,
      },
    }),

  getBrandList: () =>
    dispatch({
      type: "getFreewareBrandList",
    }),
  editFreewareReview: (payload, queryParams) =>
    dispatch({
      type: "editFreewareReview",
      payload,
      queryParams: {
        ...queryParams,
        pageNumber: payload?.page + 1,
        pageSize: payload?.rowsPerPage,
      },
    }),

  saveReviewNote: (saveParams, queryParams) => {
    dispatch({
      type: "saveFreewareReviewNote",
      payload: {
        formId: saveParams.formId,
        reviewNote: saveParams.note,
      },
      queryParams,
    });
  },
});

// 使用 connect 函数将组件与 Redux 连接
export default connect(mapStateToProps, mapDispatchToProps)(FreewareReviewTab);
