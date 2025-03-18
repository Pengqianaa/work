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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector, connect } from "react-redux";
import AdminTableFields from '../../../Common/AdminTableFields';
import AdminPagination from './AdminPagination';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { FilterContainer, FilterGroup, TableHeadContainer, SubmitButton } from './AdminCommonUis';
import { ErrorIcon } from "../../common/Icons";
import { DateRangePicker, ReviewsSelector } from "./FormControl/index";
import LicenseApply from './LicenseApply';
import { ACTIONS } from "../../../Reducers/TaskReducer";
import { ACTIONS as LicenseActions } from "../../../Reducers/LicenseApplyReducer";

const columns = [...AdminTableFields.TaskInfoCols];
const theme = createTheme({
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#e0e0e0',
                    color: '#000000',
                    fontWeight: 'bold',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(odd)': {
                        backgroundColor: '#ffffff',
                    },
                    '&:nth-of-type(even)': {
                        backgroundColor: '#f5f5f5',
                    },
                },
            },
        },
    },
});

const TaskInfo = (props) => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortField, setSortField] = useState('applyDate'); // 預設排序欄位
    const [sortOrder, setSortOrder] = useState('DESC'); // 預設排序方向
    const [ASC, setIsASC] = useState('ASC');
    const [tabIndex, setTabIndex] = useState(0);
    const [applicationStatus, setApplicationStatus] = useState("ALL"); // 默認值為 "ALL"
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [licenseApplyOpen, setLicenseApplyOpen] = useState(false);
    const [selectedApplyId, setSelectedApplyId] = useState(null);
    const queryResults = useSelector((state) => state.taskInfo.queryResults);
    const checkApprovedFlag = useSelector((state) => state.taskInfo.checkApprovedFlag);
    useEffect(() => {
        // 当 applicationStatus、page 或 rowsPerPage 改变时，重新获取数据
        fetchTableData(startDate, endDate, applicationStatus, page, rowsPerPage, sortField, sortOrder);
    }, [applicationStatus, page, rowsPerPage]); // 依赖 applicationStatus、page 和 rowsPerPage

    const fetchTableData = (startDate, endDate, applicationStatus, page, rowsPerPage, sort, asc) => {
        dispatch({
            type: ACTIONS.GET_TASK_INFO_LIST,
            payload: {
                startDate,
                endDate,
                applicationStatus: applicationStatus === "ALL" ? null : applicationStatus, // 如果选择 "ALL"，则设置为 null
                page,
                size: rowsPerPage,
                sort: `${sort},${asc}`
            }
        });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        fetchTableData(startDate, endDate, applicationStatus, newPage, rowsPerPage, sortField, sortOrder);
    };
    
    const handleChangeRowsPerPage = (value) => {
        const newPageSize = parseInt(value, 10);
        setRowsPerPage(newPageSize);
        setPage(0); // 重置为第一页
        fetchTableData(startDate, endDate, applicationStatus, 0, newPageSize, sortField, sortOrder);
    };

    const sortHandler = (property) => {
        const newSortOrder = sortOrder === 'ASC' ? 'DESC' : 'ASC'; // 切换排序方向
        setSortField(property); // 设置当前排序字段
        setSortOrder(newSortOrder); // 设置当前排序方向
        setPage(0); // 重置为第一页
        setRowsPerPage(10); // 重置为默认每页条数
        fetchTableData(startDate, endDate, applicationStatus, 0, 10, property, newSortOrder); // 重置分页参数
    };

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    const handleReviewStatusChange = (value) => {
        setApplicationStatus(value); // 设置新的 applicationStatus
        setPage(0); // 重置为第一页
        setRowsPerPage(10); // 重置为默认每页条数
        fetchTableData(startDate, endDate, value, 0, 10, sortField, sortOrder); // 重置分页参数
    };

    const handleSearch = (event) => {
        event.preventDefault();
        setPage(0); // 重置为第一页
        setRowsPerPage(10); // 重置为默认每页条数
        fetchTableData(startDate, endDate, applicationStatus, 0, 10, sortField, sortOrder); // 重置分页参数
    };

    const releaseLicense = (item) => {
        setDeleteTarget(item);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        dispatch({
            type: ACTIONS.RELEASE_TASK,
            payload: {
                id: deleteTarget.id,
            }
        });
        setConfirmOpen(false);
    };

    const handleApplyIdClick = (applyId) => {
        setSelectedApplyId(applyId);
        setLicenseApplyOpen(true);
    };

    const licenseApplyClose = () => {
        setLicenseApplyOpen(false)
        dispatch({
            type: LicenseActions.SET_LICENSE_APPLY_DETAIL,
            payload: {}
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth={false}>
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'lightgreen' }}>
                        Task Info
                    </Typography>
                    {checkApprovedFlag ? <Typography
                        variant="body1"
                        gutterBottom
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#ff9900",
                            fontWeight: 500,
                        }}
                    >
                        <ErrorIcon style={{ marginRight: "8px" }} />
                        You have approved applications. Please complete the&nbsp;
                        <Typography
                            component="span"
                            sx={{
                                color: '#8db7cc',
                                textDecoration: 'underline'
                            }}
                        >
                            software installation process
                        </Typography>
                        &nbsp;before using the software.
                    </Typography> : <></>}
                    <Box>
                        <TableContainer component={Paper}>
                            <TableHeadContainer>
                                <FilterGroup style={{ display: 'flow' }}>
                                    <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
                                    <FilterContainer>
                                        <ReviewsSelector
                                            multiple={false}
                                            value={applicationStatus || "ALL"}
                                            onChange={handleReviewStatusChange}
                                        />
                                    </FilterContainer>
                                </FilterGroup>
                                <FilterGroup>
                                    <SubmitButton onClick={handleSearch}>
                                        <SearchIcon />
                                        <FormattedMessage id="adminCommon.search" />
                                    </SubmitButton>
                                </FilterGroup>
                            </TableHeadContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <FormattedMessage id="adminCommon.operate" />
                                        </TableCell>
                                        {columns.map((column) => (
                                            <TableCell key={column.id}>
                                                {['startDate', 'endDate', 'applyDate'].includes(column.id) ? (
                                                    <TableSortLabel
                                                        active={sortField === column.id} // 當前欄位是否為排序欄位
                                                        direction={sortOrder.toLowerCase()} // 排序方向（ASC 或 DESC）
                                                        onClick={() => sortHandler(column.id)} // 點擊時觸發排序
                                                    >
                                                        <FormattedMessage id={`taskInfo.${column.id}`} />
                                                    </TableSortLabel>
                                                ) : (
                                                    <FormattedMessage id={`taskInfo.${column.id}`} />
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {queryResults.content.map((ef, index) => {
                                        const canShowDeleteIcon = ['To Be Confirmed', 'Approved', 'In Process'].includes(ef.applicationStatus);
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                <TableCell style={{ width: 80 }} align="left" scope="row">
                                                    {canShowDeleteIcon && (
                                                        <DeleteIcon
                                                            onClick={() => releaseLicense(ef)}
                                                            style={{ color: "#FF5252", cursor: "pointer" }}
                                                        />
                                                    )}
                                                </TableCell>
                                                {columns.map((column) => (
                                                    <TableCell key={column.id} style={{ whiteSpace: column.whiteSpace }}>
                                                        {column.id === 'id' ? (
                                                            <span
                                                                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                                                onClick={() => handleApplyIdClick(ef[column.id])}
                                                            >
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
                {/* 刪除確認框 */}
                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        Are you sure to release the license?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* LicenseApply 組件 */}
                <Dialog
                    open={licenseApplyOpen}
                    onClose={licenseApplyClose}
                    PaperProps={{
                        style: {
                            backgroundColor: '#f5f5f5',
                            minWidth: '800px',
                            maxWidth: '1200px',
                        },
                    }}
                >
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

const mapStateToProps = (state) => {
    console.log(state)
    
};
const mapDispatchToProps = (dispatch) => {
    console.log(dispatch)
    
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskInfo);