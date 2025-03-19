import { CContainer, CInputGroup, CRow } from "@coreui/react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import AdminTableFields from "../../../Common/AdminTableFields";
import { Actions } from "../../../Common/constants";
import ModifyVipModal from "./ModifyVipModal";
import { AddButton, SearchInput, TableHeadContainer } from "./AdminCommonUis";
import AdminPagination from "./AdminPagination";

const BY_ASC = "ASC";
const BY_DESC = "DESC";

const columns = [...AdminTableFields.VipListMgtCols];

const VipListMgtTab = (props) => {
  const {
    currentPage,
    total,
    pageSize,
    totalPages,
    vipList,
    getVipList,
    updateVip,
    setShowAlert,
  } = props;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [sortingColumn, setSortingColumn] = useState("account");
  const [isASC, setIsASC] = useState(false);
  let order = isASC ? BY_ASC : BY_DESC;
  let direction = isASC ? "asc" : "desc";

  const [openEdit, setOpenEdit] = useState(false);

  const intl = useIntl();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getVipList(keyword, newPage + 1, rowsPerPage, sortingColumn, order);
  };

  const handleChangeRowsPerPage = (event) => {
    let newPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(newPageSize);
    getVipList(keyword, 1, newPageSize, sortingColumn, order);
    setPage(0);
  };

  useEffect(() => {
    setPage(0);
    getVipList(keyword, 1, rowsPerPage, sortingColumn, order);
  }, []);

  const handleAdd = () => {
    setOpenEdit(true);
  };

  const handleDelete = (user) => {
    let { agentEmpCode, agentUserId, userEmpCode, userId } = user;

    setShowAlert({
      title: intl.formatMessage({ id: `common.title` }),
      message: intl.formatMessage({ id: `adminCommon.deleteMsg` }),
      hasCancel: true,
      callback: () => {
        updateVip(agentEmpCode, agentUserId, false, userEmpCode, userId);
      },
    });
  };
  const handleInput = (e) => {
    setKeyword(e.target.value);
  };

  useEffect(() => {
    getVipList(keyword, 1, rowsPerPage, sortingColumn, order);
    setPage(0);
  }, [keyword]);

  const sortHandler = (property) => {
    const asc = sortingColumn === property ? !isASC : true;
    setIsASC(asc);
    setSortingColumn(property);
    getVipList(keyword, 1, rowsPerPage, sortingColumn, asc ? BY_ASC : BY_DESC);
  };

  const handleSave = (el) => {
    let { agentEmpCode, agentUserId, userEmpCode, userId } = el;
    updateVip(agentEmpCode, agentUserId, true, userEmpCode, userId);
  };

  return (
    <CContainer>
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
                          id={`adminCols.vipmgt.${column.id}`}
                        />
                      </TableSortLabel>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {vipList.map((vip, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell style={{ width: 80 }} align="left" scope="row">
                      <DeleteIcon
                        onClick={() => {
                          handleDelete(vip);
                        }}
                        style={{ color: "#FF5252" }}
                      />
                    </TableCell>
                    {columns.map((column) => {
                      return (
                        <TableCell key={column.id}>
                          {column.viewCallback(vip[column.id])}
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
      <ModifyVipModal
        key={openEdit}
        show={openEdit}
        intl={intl}
        toggle={setOpenEdit}
        onSave={handleSave}
      />
    </CContainer>
  );
};

const mapStateToProps = (state) => ({
  currentPage: state.vip.currentPage,
  total: state.vip.total,
  pageSize: state.vip.pageSize,
  totalPages: state.vip.totalPages,
  vipList: state.vip.vipList,
});
const mapDispatchToProps = (dispatch) => ({
  getVipList: (keyWord, pageNum, pageSize, sidx, order) =>
    dispatch({
      type: "queryVipList",
      payload: { keyWord, pageNum, pageSize, sidx, order },
    }),
  updateVip: (agentEmpCode, agentId, enabled, userEmpCode, userId) =>
    dispatch({
      type: "updateVip",
      payload: { agentEmpCode, agentId, enabled, userEmpCode, userId },
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

export default connect(mapStateToProps, mapDispatchToProps)(VipListMgtTab);
