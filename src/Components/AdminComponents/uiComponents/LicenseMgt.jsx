import {
    Box,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Typography,
    Tabs,
    Tab,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from '@mui/icons-material/Close'; // 引入关闭图标
import IconButton from '@mui/material/IconButton'; // 引入 IconButton 组件
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector, connect } from "react-redux";
import moment from 'moment';
import AdminTableFields from '../../../Common/AdminTableFields';
import AdminPagination from './AdminPagination';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FilterContainer, FilterGroup, TableHeadContainer, SubmitButton, AddButton } from './AdminCommonUis';
import { MOMENT_FORMAT } from "../../../Common/constants";
import { DateRangePicker, ReviewsSelector } from "./FormControl/index";
import RefreshIcon from "@mui/icons-material/Refresh";
import LicenseApply from './LicenseApply';
import { ACTIONS } from "../../../Reducers/LicenseMgtReducer";
import { ACTIONS as LicenseActions } from "../../../Reducers/LicenseApplyReducer";
const columns = AdminTableFields.LicenseMgtCols

const theme = createTheme({
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#e0e0e0', // 灰色背景
                    color: '#000000', // 黑色文字
                    fontWeight: 'bold', // 粗体
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(odd)': {
                        backgroundColor: '#ffffff', // 单数行白色背景
                    },
                    '&:nth-of-type(even)': {
                        backgroundColor: '#f5f5f5', // 双数行浅灰色背景
                    },
                },
            },
        },
    },
});

const LicenseMgt = props => {
    const dispatch = useDispatch();
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false); // 審核確認框
    const [releaseOpen, setReleaseOpen] = useState(false); // 釋放確認框
    const [reviewTarget, setReviewTarget] = useState({}); // 審核
    const [reviewResult, setReviewResult] = useState(false);
    const [releaseTarget, setReleaseTarget] = useState({}) // 釋放
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortField, setSortField] = useState('applyDate'); // 預設排序欄位
    const [sortOrder, setSortOrder] = useState('DESC'); // 預設排序方向
    const [ASC, setIsASC] = useState('DESC');
    const [tabIndex, setTabIndex] = useState(0); // 管理当前选中的 Tab
    const [releaseReason, setReleaseReason] = useState('');
    const [reviewReason, setReviewReason] = useState('');
    const [totalLicense, setTotalLicense] = useState(0);
    const [currentUsage, setCurrentUsage] = useState(0);
    const [approved, setApproved] = useState(0);
    const [toBeConfirmed, setToBeConfirmed] = useState(0);
    const [keyword, setKeyword] = useState('');
    const intl = useIntl();
    const [licenseApplyOpen, setLicenseApplyOpen] = useState(false); // 控制 LicenseApply 组件的显示
    const [selectedApplyId, setSelectedApplyId] = useState(null); // 记录选中的 apply ID
    const orgName = useSelector((state) => state.view.orgNTenantOrg);
    const queryResults = useSelector((state) => state.licenseMgt.queryResults);
    const usageData = useSelector((state) => state.licenseMgt.usageData);
    useEffect(() => {
        dispatch({
            type: ACTIONS.GET_USAGE_DATA,
            payload: {
                orgName
            }
        });
        let reviewStatus = null;
        if (tabIndex === 0) {
            reviewStatus = 'To Be Confirmed';
            setApplicationStatus('To Be Confirmed');
        } else {
            setApplicationStatus(null); // 切换到 "All" Tab 时，清空 applicationStatus
        }
        fetchTableData(startDate, endDate, keyword, reviewStatus, 0, 10, 'applyDate', 'DESC'); // 初始化时使用默认分页参数
    }, []);

    useEffect(() => {
        if (Object.keys(usageData).length > 0) {
            setTotalLicense(usageData.totalLicense);
            setCurrentUsage(usageData.allocatedLicense);
            setApproved(usageData.approvedApplications);
            setToBeConfirmed(usageData.toBeConfirmApplications);
        }
    }, [usageData]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        fetchTableData(startDate, endDate, keyword, applicationStatus, newPage, rowsPerPage, 'applyDate', ASC); // 传递当前分页参数
    };

    const handleChangeRowsPerPage = (value) => {
        const newPageSize = parseInt(value, 10);
        setRowsPerPage(newPageSize);
        setPage(0); // 重置为第一页
        fetchTableData(startDate, endDate, keyword, applicationStatus, 0, newPageSize, 'applyDate', ASC); // 传递新的分页参数
    };

    const fetchTableData = (startDate, endDate, keyword, applicationStatus, page, rowsPerPage, sort, asc) => {
        dispatch({
            type: ACTIONS.GET_LICENSE_MGT_LIST,
            payload: {
                startDate,
                endDate,
                keyword,
                orgName,
                applicationStatus: applicationStatus === "ALL" ? null : applicationStatus, // 如果选择 "ALL"，则设置为 null
                page,
                size: rowsPerPage,
                sort: `${sort},${asc}`
            }
        });
    };

    const sortHandler = (property) => {
        let newSortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC'; // 切換排序方向
        setSortField(property); // 設置當前排序欄位
        setSortOrder(newSortOrder); // 設置當前排序方向
        fetchTableData(startDate, endDate, keyword, applicationStatus, page, rowsPerPage, property, newSortOrder); // 傳遞排序參數
    };

    const handleKeywordChange = (event) => {
        setKeyword(event.target.value);
    };

    const handleTabChange = (event, newIndex) => {
        setPage(0); // 重置为第一页
        setRowsPerPage(10); // 重置为默认每页条数
        if (newIndex === 1) {
            // 切換到 "All" Tab，清空 applicationStatus
            setApplicationStatus(null);
            fetchTableData(startDate, endDate, keyword, null, 0, 10, 'applyDate', ASC); // 重置分页参数
        } else {
            // 切換到 "To Be Confirm" Tab，設置 applicationStatus 為 'To Be Confirmed'
            setApplicationStatus('To Be Confirmed');
            fetchTableData(startDate, endDate, keyword, 'To Be Confirmed', 0, 10, 'applyDate', ASC); // 重置分页参数
        }
        setTabIndex(newIndex);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        setPage(0); // 重置为第一页
        setRowsPerPage(10); // 重置为默认每页条数
        fetchTableData(startDate, endDate, keyword, applicationStatus, 0, 10, 'applyDate', ASC); // 重置分页参数
    };

    const handleReleaseClick = (item) => {
        setReleaseTarget(item);
        setReleaseOpen(true); // 打开确认框
    };

    const handleConfirmRelease = () => {
        dispatch({
            type: ACTIONS.RELEASE_LICENSE,
            payload: {
                licenseApplicationId: releaseTarget.id,
                reason: releaseReason
            }
        });
        handleReleaseClose()
    };

    const handleReviewClick = (item) => {
        setReviewTarget(item);
        setConfirmOpen(true); // 打开确认框
    };

    const handleConfirmReview = (flag) => {
        dispatch({
            type: ACTIONS.REVIEW_LICENSE,
            payload: {
                licenseApplicationId: reviewTarget.id,
                reviewResult: flag,
                reviewReason: reviewReason
            }
        });
        handleConfirmClose();
    };

    const handleApplyIdClick = (applyId) => {
        // 这里可以添加点击Apply ID后的逻辑，比如打开详情页等
        setSelectedApplyId(applyId);
        setLicenseApplyOpen(true);
    };

    const handleRefreshClick = (target) => {
        dispatch({
            type: ACTIONS.RETRY_LICENSE,
            payload: {
                licenseApplicationId: target.id,
            }
        });
    };

    const reloadUsageData = () => {
        dispatch({
            type: ACTIONS.RELOAD_USAGE_DATA,
            payload: {
                orgName
            }
        });
    };

    const handleReviewStatusChange = (value, newIndex) => {
        setPage(0); // 重置为第一页
        setRowsPerPage(10); // 重置为默认每页条数
        setApplicationStatus(value === "ALL" ? null : value);
        fetchTableData(startDate, endDate, keyword, value === "ALL" ? null : value, 0, 10, 'applyDate', ASC); // 重置分页参数
    };

    const handleConfirmClose = () => {
        setConfirmOpen(false);
        setReviewReason(''); // 清空审核原因
    };

    const handleReleaseClose = () => {
        setReleaseOpen(false);
        setReleaseReason(''); // 清空释放原因
    };

    const licenseApplyClose = () => {
        setLicenseApplyOpen(false);
        dispatch({
            type: LicenseActions.SET_LICENSE_APPLY_DETAIL,
            payload: {}
        });
        setSelectedApplyId(null); // 清空选中的 Apply ID
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth={false} sx={{ overflowX: 'auto' }}>
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'lightgreen' }}>
                        License Mgt
                    </Typography>
                    <Box display="flex" justifyContent="flex-end">
                        <Tabs value={tabIndex} onChange={handleTabChange}>
                            <Tab label="To Be Confirm" />
                            <Tab label="All" />
                        </Tabs>
                    </Box>
                    <Box>
                        <TableContainer component={Paper}>
                            <TableHeadContainer style={{ paddingBottom: 1 }}>
                                <FilterGroup style={{ display: 'flow' }}>
                                    <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
                                    {tabIndex === 1 ? <FilterContainer>
                                        <ReviewsSelector
                                            multiple={false}
                                            value={applicationStatus || "ALL"}
                                            onChange={handleReviewStatusChange}
                                            useFor={'LicenseMgt'}
                                        />
                                    </FilterContainer> : <></>}
                                    <Box display="flex"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        my={2}
                                        sx={{
                                            width: '530px', // 固定宽度
                                            maxWidth: '1200px', // 最大宽度
                                            margin: '0px 0px',
                                            backgroundColor: 'rgba(173, 216, 230, 0.5)',
                                            borderRadius: '8px',
                                        }}>
                                        <RefreshIcon onClick={reloadUsageData} sx={{ mr: 1 }} style={{ cursor: 'pointer' }} />
                                        <Typography variant="subtitle1" component="p" mr={1}>
                                            Total License: {totalLicense}
                                        </Typography>
                                        <Typography variant="subtitle1" component="p" mr={1}>
                                            Current usage: {currentUsage}
                                        </Typography>
                                        <Typography variant="subtitle1" component="p" mr={1}>
                                            Approved: {approved}
                                        </Typography>
                                        <Typography variant="subtitle1" component="p">
                                            To Be Confirmed: {toBeConfirmed}
                                        </Typography>
                                    </Box>
                                </FilterGroup>
                                <FilterGroup style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <SubmitButton onClick={handleSearch} style={{ marginBottom: 10, marginRight: 20 }}>
                                        Search
                                    </SubmitButton>
                                    <FilterContainer >
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            placeholder="Please enter keywords"
                                            value={keyword}
                                            onChange={handleKeywordChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </FilterContainer>
                                </FilterGroup>
                            </TableHeadContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <FormattedMessage id="adminCommon.operate" />
                                        </TableCell>
                                        {columns.map(column => (
                                            <TableCell key={column.id}>
                                                {['startDate', 'endDate', 'applyDate'].includes(column.id) ? (
                                                    <TableSortLabel
                                                        active={sortField === column.id} // 當前欄位是否為排序欄位
                                                        direction={sortOrder.toLowerCase()} // 排序方向（ASC 或 DESC）
                                                        onClick={() => sortHandler(column.id)} // 點擊時觸發排序
                                                    >
                                                        <FormattedMessage id={`licenseMgt.${column.id}`} />
                                                    </TableSortLabel>
                                                ) : (
                                                    <FormattedMessage id={`licenseMgt.${column.id}`} />
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {queryResults.content.map((ef, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                <TableCell style={{ width: 80 }} align="left" scope="row">
                                                    {ef.applicationStatus === 'To Be Confirmed' || ef.applicationStatus === 'Approved' ? (
                                                        <EditIcon
                                                            onClick={() => handleReviewClick(ef)}
                                                            style={{ color: "green", cursor: "pointer" }}
                                                        />
                                                    ) : ef.applicationStatus === 'In Process' ? (
                                                        <DeleteIcon
                                                            onClick={() => handleReleaseClick(ef)}
                                                            style={{ color: "#FF5252", cursor: "pointer" }}
                                                        />
                                                    ) : ef.applicationStatus === 'Failed' ? (
                                                        <RefreshIcon
                                                            onClick={() => handleRefreshClick(ef)}
                                                            style={{ color: "blue", cursor: "pointer" }}
                                                        />
                                                    ) : null}
                                                </TableCell>
                                                {columns.map(column => (
                                                    <TableCell key={column.id} style={{ whiteSpace: column.whiteSpace, minWidth: column.minWidth }}>
                                                        {column.id === 'id' ? (
                                                            <span style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => handleApplyIdClick(ef[column.id])}>
                                                                {column.viewCallback(ef[column.id])}
                                                            </span>
                                                        ) : (
                                                            column.viewCallback(ef[column.id])
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box my={2}>
                            <AdminPagination
                                queryResults={queryResults}
                                page={page}
                                handleChangePage={handleChangePage}
                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                                rowsPerPage={rowsPerPage}
                            />
                        </Box>
                    </Box>
                </Box>
                {/* 可編輯審核授權結果的說明 */}
                <Dialog open={confirmOpen} onClose={handleConfirmClose}
                    PaperProps={{
                        style: {
                            width: '600px', // 调整宽度，可根据需要修改
                            height: '286px' // 调整高度，可根据需要修改
                        }
                    }}>
                    <DialogTitle style={{
                        position: 'relative'
                    }}>
                        Review License:
                        <IconButton
                            aria-label="close"
                            onClick={handleConfirmClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <span style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: 1,
                            backgroundColor: '#ccc'
                        }}></span>
                    </DialogTitle>
                    <DialogContent>
                        <Typography> Reason for review result: </Typography>
                        <TextField
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            value={reviewReason}
                            onChange={(e) => { setReviewReason(e.target.value) }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => handleConfirmReview(false)}
                            color="secondary"
                            sx={{
                                backgroundColor: '#797c81', // 自定义背景颜色
                                color: 'white', // 自定义文本颜色
                            }}
                        >
                            Declined
                        </Button>
                        <Button
                            onClick={() => handleConfirmReview(true)}
                            color="primary"
                            sx={{
                                backgroundColor: '#0285dc',
                                color: 'white',
                            }}
                        >
                            Approved
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* 釋放确认框 */}
                <Dialog open={releaseOpen} onClose={handleReleaseClose}
                    PaperProps={{
                        style: {
                            width: '600px', // 调整宽度，可根据需要修改
                            height: '286px' // 调整高度，可根据需要修改
                        }
                    }}>
                    <DialogTitle style={{
                        position: 'relative'
                    }}>
                        Release License
                        <span style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: 1,
                            backgroundColor: '#ccc'
                        }}></span>
                    </DialogTitle>
                    <DialogContent>
                        <Typography> Reason for release: </Typography>
                        <TextField
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            value={releaseReason}
                            onChange={(e) => { setReleaseReason(e.target.value) }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleReleaseClose}
                            color="secondary"
                            sx={{
                                backgroundColor: '#797c81', // 自定义背景颜色
                                color: 'white', // 自定义文本颜色
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmRelease}
                            color="primary"
                            sx={{
                                backgroundColor: '#0285dc',
                                color: 'white',
                            }}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* LicenseApply 组件 */}
                <Dialog open={licenseApplyOpen} onClose={licenseApplyClose}
                    PaperProps={{
                        style: {
                            backgroundColor: '#f5f5f5',
                            minWidth: '800px', // 设置最小宽度
                            maxWidth: '1200px', // 设置最大宽度
                        },
                    }}>
                    <DialogTitle style={{
                        position: 'relative'
                    }}>License Apply
                        <span style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: 1,
                            backgroundColor: '#ccc'
                        }}></span></DialogTitle>
                    <DialogContent>
                        <LicenseApply applyId={selectedApplyId} isAdmin={false} isEdit={true} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={licenseApplyClose} color="secondary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ThemeProvider>
    );
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LicenseMgt);