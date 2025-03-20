import { CContainer, CInputGroup, CRow } from "@coreui/react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import AdminTableFields from "../../../Common/AdminTableFields";
import { Actions } from "../../../Common/constants";
import {
  AddButton,
  SearchInput,
  TableHeadContainer,
} from "../uiComponents/AdminCommonUis";
import AdminPagination from "../uiComponents/AdminPagination";
import ModifyPermissionModal from "../uiComponents/ModifyPermissionModal";

const BY_ACCOUNT = "ACCOUNT";
const BY_NAME = "NAME";
const BY_ROLE = "Role";
const BY_ASC = "ASC";
const BY_DESC = "DESC";

const PermissionMgt = (props) => {
  const {
    currentPage,
    total,
    pageSize,
    totalPages,
    adminUserList,
    getPermissionList,
    setShowAlert,
    updateRole,
  } = props;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [sortingColumn, setSortingColumn] = useState(null);
  const [isASC, setIsASC] = useState(true);

  const [openEdit, setOpenEdit] = useState(false);
  const [editTarget, setEditTarget] = useState({});

  const intl = useIntl();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getPermissionList(
      keyword,
      newPage + 1,
      pageSize,
      sortingColumn,
      isASC ? BY_ASC : BY_DESC
    );
  };

  const handleChangeRowsPerPage = (event) => {
    let newPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(newPageSize);
    getPermissionList(
      keyword,
      1,
      newPageSize,
      sortingColumn,
      isASC ? BY_ASC : BY_DESC
    );
    setPage(0);
  };

  useEffect(() => {
    getPermissionList(null, 1, rowsPerPage, null, BY_ASC);
    setPage(0);
  }, []);

  useEffect(() => {
    setPage(currentPage - 1);
  }, [adminUserList]);

  const handleAdd = () => {
    setEditTarget({});
    setOpenEdit(true);
  };
  const handleEdit = (user) => {
    setEditTarget(user);
    setOpenEdit(true);
  };
  const handleDelete = (user) => {
    let targetUser = { ...user };
    setShowAlert({
      title: intl.formatMessage({ id: `common.title` }),
      message: intl.formatMessage({ id: `adminCommon.deleteMsg` }),
      hasCancel: true,
      callback: () => {
        updateRole(targetUser, []);
      },
    });
  };
  const handleInput = (e) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    getPermissionList(
      keyword,
      1,
      rowsPerPage,
      sortingColumn,
      isASC ? BY_ASC : BY_DESC
    );
    setPage(0);
  }, [keyword]);

  const createSortHandler = (property) => {
    const asc = sortingColumn === property ? !isASC : true;
    setIsASC(asc);
    setSortingColumn(property);
    getPermissionList(
      keyword,
      1,
      rowsPerPage,
      property,
      asc ? BY_ASC : BY_DESC
    );
  };

  let direction = isASC ? "asc" : "desc";
  return (
    <CContainer>
      <CRow style={{ marginBottom: "20px" }}>
        <h1>
          <FormattedMessage id="permissionmgt.title" />
        </h1>
      </CRow>
      <CRow>
        <TableContainer component={Paper}>
          <TableHeadContainer>
            <AddButton variant="contained" onClick={handleAdd}>
              <FormattedMessage id="adminCommon.add" />
            </AddButton>
            <CInputGroup style={{ width: "250px" }}>
              <SearchInput
                value={keyword}
                onChange={handleInput}
                className="searchinput"
                placeholder={intl.formatMessage({ id: "adminCommon.keyword" })}
              ></SearchInput>
            </CInputGroup>
          </TableHeadContainer>
          <Table aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="adminCommon.operate" />
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    onClick={() => createSortHandler(BY_ACCOUNT)}
                    active={sortingColumn === BY_ACCOUNT}
                    direction={direction}
                    hideSortIcon={sortingColumn !== BY_ACCOUNT}
                  >
                    <FormattedMessage id="adminCols.permissionmgt.account" />
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    onClick={() => createSortHandler(BY_NAME)}
                    active={sortingColumn === BY_NAME}
                    direction={direction}
                    hideSortIcon={sortingColumn !== BY_NAME}
                  >
                    <FormattedMessage id="adminCols.permissionmgt.userName" />
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    onClick={() => createSortHandler(BY_ROLE)}
                    active={sortingColumn === BY_ROLE}
                    direction={direction}
                    hideSortIcon={sortingColumn !== BY_ROLE}
                  >
                    <FormattedMessage id="adminCols.permissionmgt.roleName" />
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <FormattedMessage id="adminCols.permissionmgt.remark" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adminUserList.map((el) => {
                let nameArr = el.fullName.replace(/\s+/g, " ").split(" ");
                let userName = nameArr[1] ? nameArr[1] : "-";
                return (
                  <TableRow key={el.account}>
                    <TableCell style={{ width: 80 }} align="left" scope="row">
                      <DeleteIcon
                        onClick={() => {
                          handleDelete(el);
                        }}
                        style={{ color: "#FF5252" }}
                      />
                      <EditIcon
                        onClick={() => {
                          handleEdit(el);
                        }}
                        style={{ color: "rgb(76, 175, 80)" }}
                      />
                    </TableCell>
                    <TableCell style={{ width: 160 }} scope="row">
                      {el.account}
                    </TableCell>
                    <TableCell style={{ width: 160 }} scope="row">
                      {userName}
                    </TableCell>
                    <TableCell>
                      {el.roles.map((e) => {
                        return (
                          <Chip
                            key={el.account + e.roleId}
                            size="small"
                            style={{ margin: "2px" }}
                            label={e.roleName}
                          />
                        );
                      })}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="right">
                      {el.remark}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer component={Paper}>
          <AdminPagination
            queryResults={{
              totalPages: totalPages,
              total: total,
            }}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            rowsPerPage={rowsPerPage}
          ></AdminPagination>
        </TableContainer>
      </CRow>
      <ModifyPermissionModal
        key={editTarget?.userId ?? openEdit}
        show={openEdit}
        toggle={setOpenEdit}
        intl={intl}
        focusUser={editTarget}
      />
    </CContainer>
  );
};

const mapStateToProps = (state) => ({
  currentPage: state.permission.currentPage,
  total: state.permission.total,
  pageSize: state.permission.pageSize,
  totalPages: state.permission.totalPages,
  adminUserList: state.permission.adminUserList,
  adminUsers: state.permission.adminUsers,
});
const mapDispatchToProps = (dispatch) => ({
  getRole: () =>
    dispatch({
      type: "getRole",
    }),
  getPermissionList: (keyWord, pageNum, pageSize, sidx, order) =>
    dispatch({
      type: "getPermissionList",
      payload: { keyWord, pageNum, pageSize, sidx, order },
    }),
  queryAdminUsers: (keyword) =>
    dispatch({
      type: "queryAdminUsers",
      payload: keyword,
    }),
  updateRole: (user, role) =>
    dispatch({
      type: "updateRole",
      payload: { user, role },
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

export default connect(mapStateToProps, mapDispatchToProps)(PermissionMgt);
