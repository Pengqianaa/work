import React, { useState, useEffect } from "react";
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
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useDispatch, useSelector, connect } from "react-redux";
import AdminPagination from "./AdminPagination";
import { ErrorIcon } from "../../common/Icons";
import AdminTableFields from "../../../Common/AdminTableFields";
import {
    FilterGroup,
    TableHeadContainer,
} from "./AdminCommonUis";
import { ACTIONS } from "../../../Reducers/AutoApprovedReducer";
import AutoApprovedMgtEdit from "./AutoApprovedMgtEdit"; // 引入封裝的組件

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

const columns = [...AdminTableFields.AutoApprovedMgtCols];

const AutoApprovedMgt = (props) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentData, setCurrentData] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const queryResults = useSelector((state) => state.autoApproved.queryResults);
    const dispatch = useDispatch();

    useEffect(() => {
        // 当 tabIndex、page 或 rowsPerPage 改变时，重新获取数据
        dispatch({
            type: ACTIONS.GET_AUTO_APPROVED_LIST,
            payload: {
                isGlobal: tabIndex === 0,
                page: page,
                size: rowsPerPage
            }
        });
    }, [tabIndex, page, rowsPerPage]); // 依赖 tabIndex、page 和 rowsPerPage

    const handleReload = () => {
        setPage(0); // 重置为第一页
        setRowsPerPage(10); // 重置为默认每页条数
        dispatch({
            type: ACTIONS.GET_RELOAD_ORG_LIST,
            payload: {
                isGlobal: tabIndex === 0,
                page: 0,
                size: 10
            }
        });
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleEdit = (item) => {
        setCurrentData(item);
        setDialogOpen(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        // 触发数据请求，传递新的分页参数
        dispatch({
            type: ACTIONS.GET_AUTO_APPROVED_LIST,
            payload: {
                isGlobal: tabIndex === 0,
                page: newPage,
                size: rowsPerPage
            }
        });
    };
    
    const handleChangeRowsPerPage = (value) => {
        const newPageSize = parseInt(value, 10);
        setRowsPerPage(newPageSize);
        setPage(0); // 重置为第一页
        // 触发数据请求，传递新的分页参数
        dispatch({
            type: ACTIONS.GET_AUTO_APPROVED_LIST,
            payload: {
                isGlobal: tabIndex === 0,
                page: 0,
                size: newPageSize
            }
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth={false} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ color: "lightgreen" }}>
                        Auto Approved Mgt
                    </Typography>
                    <Typography
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
                        After setting to auto-approved, applications that meet the requested time will be approved
                        automatically.
                    </Typography>

                    <Box display="flex" justifyContent="flex-end">
                        <Tabs value={tabIndex} onChange={(event, newValue) => setTabIndex(newValue)}>
                            <Tab label="Org" />
                        </Tabs>
                    </Box>

                    <Box>
                        <TableContainer component={Paper} className="tableContainer">
                            <TableHeadContainer>
                                <FilterGroup>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<RefreshIcon />}
                                        onClick={handleReload}
                                        sx={{
                                            textTransform: "none",
                                            display: 'flex',
                                            alignItems: 'center', // 确保图标和文本居中
                                            justifyContent: 'center',
                                        }}
                                    >
                                        Reload Org
                                    </Button>
                                </FilterGroup>
                            </TableHeadContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Operate</TableCell>
                                        {columns.map((column) => (
                                            <TableCell key={column.id}>{column.label}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {queryResults.content.map((ef, index) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            <TableCell style={{ width: 80 }} align="left" scope="row">
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

                        <Dialog open={dialogOpen} onClose={handleDialogClose}>
                            <DialogTitle>Dialog Title</DialogTitle>
                            <DialogContent>Content goes here.</DialogContent>
                            <DialogActions>
                                <Button onClick={handleDialogClose} color="secondary">
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Box>
                {/* 编辑弹框 */}
                <AutoApprovedMgtEdit
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    initialData={currentData}
                />
            </Container>
        </ThemeProvider>
    );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AutoApprovedMgt);