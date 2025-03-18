import React, { useState, useEffect } from "react";
import { useDispatch, useSelector, connect } from "react-redux";
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
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { FormattedMessage } from "react-intl";
import {
    FilterContainer,
    FilterGroup,
    TableHeadContainer,
    SubmitButton,
    AddButton,
} from "./AdminCommonUis";
import AdminPagination from "./AdminPagination";
import AdminTableFields from "../../../Common/AdminTableFields";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PermissionMgtEdit from "./PermissionMgtEdit"; // 引入封裝的組件
import { ErrorIcon } from "../../common/Icons";
import { ACTIONS } from "../../../Reducers/PermissionReducer";
import { ACTIONS as ViewActions } from "../../../Reducers/ViewReducer";

const theme = createTheme({
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: "#e0e0e0",
                    color: "#000000",
                    fontWeight: "bold",
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    "&:nth-of-type(odd)": {
                        backgroundColor: "#ffffff",
                    },
                    "&:nth-of-type(even)": {
                        backgroundColor: "#f5f5f5",
                    },
                },
            },
        },
    },
});

const columns = [...AdminTableFields.PermissionMgtCols];

const PermissionMgt = (props) => {
    const [tabIndex, setTabIndex] = useState(1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [ASC, setIsASC] = useState("ASC");
    const [searchTerm, setSearchTerm] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false); // 控制刪除確認框
    const [isEdit, setIsEdit] = useState(false);
    const [currentData, setCurrentData] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null); // 目前要刪除的數據
    const userKey = useSelector((state) => state.permission.userKey);
    const orgName = useSelector((state) => state.view.orgNTenantOrg);
    const roles = useSelector((state) => state.user.user.roleCodes);
    const findUser = useSelector((state) => state.permission.findUser); // 查找的用戶
    const queryResults = useSelector((state) => state.permission.queryResults);
    const dispatch = useDispatch();

    useEffect(() => {
        // 当 tabIndex、page 或 rowsPerPage 改变时，重新获取数据
        dispatch({ type: ACTIONS.GET_ROLE_LIST, payload: { isGlobal: tabIndex === 0 } });
        fetchTableData(orgName, tabIndex, searchTerm, page, rowsPerPage);
    }, [tabIndex, page, rowsPerPage]); // 依赖 tabIndex、page 和 rowsPerPage

    const fetchTableData = (orgName, tabIndex, searchTerm, page, rowsPerPage) => {
        dispatch({
            type: ACTIONS.GET_PERMISSION_LIST,
            payload: {
                orgName: orgName,
                isGlobal: tabIndex === 0,
                keyword: searchTerm,
                page: page,
                size: rowsPerPage
            }
        });
    };

    const handleSearchChange = (event) => {
        let value = event.target.value
        setSearchTerm(value);
        // fetchTableData(orgName,tabIndex,value,page,rowsPerPage);
    };

    const handleTabChange = (event, newIndex) => {
        setSearchTerm(''); // 清空搜索条件
        setPage(0); // 重置为第一页
        setRowsPerPage(10); // 重置为默认每页条数
        setTabIndex(newIndex);
    };

    const handleSearch = () => {
        setPage(0); // 重置为第一页
        setRowsPerPage(10); // 重置为默认每页条数
        fetchTableData(orgName, tabIndex, searchTerm, 0, 10);
    };

    const handleDeleteClick = (item) => {
        setDeleteTarget(item);
        setConfirmOpen(true); // 打开确认框
    };

    const handleConfirmDelete = () => {
        // 修改 deleteTarget 结构
        const modifiedDeleteTarget = {
            ...deleteTarget, // 保留原有字段
            roleCode: [deleteTarget.roleCode], // 将 roleCode 改为数组
            userKey: "" // 新增 userKey 字段
        };
        setConfirmOpen(false); // 关闭确认框
        setDeleteTarget(null); // 清空当前目标
        // 在這裡可以添加刪除邏輯，比如調用 API
        dispatch({
            type: ACTIONS.DELETE_PERMISSION, payload: {
                userInfo: modifiedDeleteTarget,
                orgName,
            }
        });
    };

    const handleAdd = () => {
        setIsEdit(false);
        setCurrentData(null);
        setDialogOpen(true);
    };

    const handleEdit = async (item) => {
        // 構造保存數據
        const { empCode, userName } = item;
        try {
            await new Promise((resolve, reject) => {
                dispatch({
                    type: ACTIONS.GET_USER_KEY,
                    payload: { orgName, userCode: empCode, userAccount: userName },
                    resolve, reject
                });
            });
        } catch (error) {
            // Handle the error thrown by CHECK_STATUS
            console.error("Error during GET_USER_KEY:", error);
            // Stop further execution
            return;
        }
        setIsEdit(true);
        setCurrentData(item);
        setDialogOpen(true);
    };

    const handleSave = (data) => {
        if (data.roleCode === 'IT_ADMIN' || data.userKey) {
            let userInfo = JSON.parse(JSON.stringify(findUser));
            userInfo.userKey = data.userKey;
            userInfo.roleCode = [data.roleCode];
            // 將業務邏輯的提示信息通過 payload 傳遞給 Saga
            let message = data.roleCode === 'IT_ADMIN'
                ? "This account does not have UiPath platform access. Please apply first and then add permissions in the backend! But update success!"
                : "Update success!";
            if(data.userKey){
                message = "success!"
            }    
            dispatch({
                type: ACTIONS.ADD_UPDATE_PERMISSION,
                payload: {
                    orgName,
                    userInfo,
                    message, // 傳遞提示信息
                    msgType: 1, // 傳遞提示類型
                },
            });
            // 關閉對話框
            setDialogOpen(false);
        } else {
            // 如果沒有 UiPath 平台訪問權限，顯示錯誤提示
            dispatch({
                type: ViewActions.SHOW_SNACKBAR_MESSAGE,
                payload: {
                    show: true,
                    props: {
                        message: "This account does not have UiPath platform access. Please apply first and then add permissions in the backend!",
                        msgType: 4, // 錯誤提示
                        autoHideDuration: null,
                    },
                },
            });
            return; // 停止後續邏輯
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        fetchTableData(orgName, tabIndex, searchTerm, newPage, rowsPerPage);
    };
    
    const handleChangeRowsPerPage = (value) => {
        const newPageSize = parseInt(value, 10);
        setRowsPerPage(newPageSize);
        setPage(0); // 重置为第一页
        fetchTableData(orgName, tabIndex, searchTerm, 0, newPageSize);
    };

    const sortHandler = (property) => {
        setIsASC(ASC === "ASC" ? "DESC" : "ASC");
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth={false}>
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ color: "lightgreen" }}>
                        Permission Mgt
                    </Typography>
                    <Typography variant="body1"
                        gutterBottom
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "#ff9900",
                            fontWeight: 500,
                        }}>
                        <ErrorIcon />
                        <FormattedMessage id="permissionMgt.TIPS" />
                    </Typography>
                    <Box display="flex" justifyContent="flex-end">
                        <Tabs value={tabIndex} onChange={handleTabChange}>
                            <Tab label="IT-Account" />
                            <Tab label="Account" />
                        </Tabs>
                    </Box>

                    <Box>
                        <TableContainer component={Paper} className="tableContainer">
                            <TableHeadContainer>
                                <FilterGroup></FilterGroup>
                                <FilterGroup>
                                    <SubmitButton onClick={handleSearch}>Search</SubmitButton>
                                </FilterGroup>
                            </TableHeadContainer>
                            <TableHeadContainer>
                                <FilterGroup>
                                    <AddButton onClick={handleAdd}>ADD+</AddButton>
                                </FilterGroup>
                                <FilterGroup>
                                    <FilterContainer>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            placeholder="Please enter keywords"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
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
                                        {columns.map((column) => (
                                            <TableCell key={column.id}>
                                                {!column.disableSort ? (
                                                    <TableSortLabel onClick={() => sortHandler(column.id)}>
                                                        {column.label}
                                                    </TableSortLabel>
                                                ) : (
                                                    column.label
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {queryResults.content.map((ef, index) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            <TableCell style={{ width: 80 }} align="left" scope="row">
                                                <DeleteIcon
                                                    onClick={() => handleDeleteClick(ef)}
                                                    style={{ color: "#FF5252", cursor: "pointer" }}
                                                />
                                                <EditIcon
                                                    onClick={() => {
                                                        handleEdit(ef);
                                                    }}
                                                    style={{ color: "rgb(76, 175, 80)", cursor: "pointer" }}
                                                />
                                            </TableCell>
                                            {columns.map((column) => (
                                                <TableCell key={column.id} style={{ whiteSpace: column.whiteSpace }}>
                                                    {column.viewCallback(ef[column.id])}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box className="paginationContainer">
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

                {/* 删除确认框 */}
                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete the <b>{deleteTarget?.name}</b> account ?
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

                {/* 编辑/新增弹框 */}
                <PermissionMgtEdit
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onSave={handleSave}
                    isEdit={isEdit}
                    initialData={currentData}
                />
            </Container>
        </ThemeProvider>
    );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(PermissionMgt);
