import { CContainer, CRow } from "@coreui/react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import AdminTableFields from "../../../Common/AdminTableFields";
import { Actions } from "../../../Common/constants";
import ModifySiteModal from "./ModifySiteModal";
import { AddButton, TableHeadContainer } from "./AdminCommonUis";
import AdminPagination from "./AdminPagination";
import Api from "../../../Common/api";

const BY_ASC = "ASC";
const BY_DESC = "DESC";

const columns = [...AdminTableFields.TechnicianMgtCols];

const TechnicianMgtTab = (props) => {
  const {
    total,
    totalPages,
    siteList,
    getSiteList,
    updateSite,
    deleteSite,
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
  const [editSite, setEditSite] = useState({});
  const [isEditSite, setIsEditSite] = useState(false);
  const intl = useIntl();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getSiteList(keyword, newPage + 1, rowsPerPage, sortingColumn, order);
  };

  const handleChangeRowsPerPage = (event) => {
    let newPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(newPageSize);
    getSiteList(keyword, 1, newPageSize, sortingColumn, order);
    setPage(0);
  };

  useEffect(() => {
    setPage(0);
    getSiteList(keyword, 1, rowsPerPage, sortingColumn, order);
  }, []);

  const handleAdd = () => {
    setIsEditSite(false);
    setEditSite({});
    setOpenEdit(true);
  };

  const handleEdit = (site) => {
    setIsEditSite(true);
    setEditSite(site);
    setOpenEdit(true);
  };

  const handleDelete = (site) => {
    let { factoryCode } = site;

    setShowAlert({
      title: intl.formatMessage({ id: `common.title` }),
      message: intl.formatMessage({ id: `adminCommon.deleteMsg` }),
      hasCancel: true,
      callback: () => {
        deleteSite(factoryCode);
      },
    });
  };

  useEffect(() => {
    getSiteList(keyword, 1, rowsPerPage, sortingColumn, order);
    setPage(0);
  }, [keyword]);

  const sortHandler = (property) => {
    const asc = sortingColumn === property ? !isASC : true
    setIsASC(asc)
    setSortingColumn(property)
    getSiteList(keyword, 1, rowsPerPage, sortingColumn, asc ? BY_ASC : BY_DESC)
  }

  const handleSave = async (el) => {
    let { groupName, factoryCode, sdpSite, technician, sdpArea } = el;
    let isExist = false;
    if (!isEditSite) {
      let result = await Api.getSiteByCode({ factoryCode });
      if (result.data.code !== -1) {
        isExist = true;
      }
    }
    if (!isExist) {
      updateSite(groupName, factoryCode, sdpSite, technician, sdpArea );
    } else {
      setShowAlert({
        title: intl.formatMessage({ id: `common.title` }),
        message: intl.formatMessage({ id: `peoplecontrolsetting.siteExist` }),
        hasCancel: true,
        callback: () => {},
      });
    }
    setIsEditSite(false);
  };

  return (
    <CContainer>
      <CRow>
        <TableContainer component={Paper}>
          <TableHeadContainer>
            <AddButton variant="contained" onClick={handleAdd}>
              <FormattedMessage id="adminCommon.add" />
            </AddButton>
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
                          id={`adminCols.sitemgt.${column.id}`}
                        />
                      </TableSortLabel>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {siteList.map((site, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell style={{ width: 80 }} align="left" scope="row">
                      <DeleteIcon
                        onClick={() => {
                          handleDelete(site);
                        }}
                        style={{ color: "#FF5252" }}
                      />
                      <EditIcon
                        onClick={() => {
                          handleEdit(site);
                        }}
                        style={{ color: "rgb(76, 175, 80)" }}
                      />
                    </TableCell>
                    {columns.map((column) => {
                      return (
                        <TableCell key={column.id}>
                          {column.viewCallback(site[column.id])}
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
      <ModifySiteModal
        key={openEdit}
        show={openEdit}
        toggle={setOpenEdit}
        intl={intl}
        onSave={handleSave}
        editSite={editSite}
      />
    </CContainer>
  );
};
const mapStateToProps = (state) => ({
  currentPage: state.site.currentPage,
  total: state.site.total,
  pageSize: state.site.pageSize,
  totalPages: state.site.totalPages,
  siteList: state.site.siteList,
});
const mapDispatchToProps = (dispatch) => ({
  getSiteList: (keyWord, pageNum, pageSize, sidx, order) =>
    dispatch({
      type: "querySiteList",
      payload: { keyWord, pageNum, pageSize, sidx, order },
    }),
  getSiteByCode: (factoryCode) =>
    dispatch({
      type: "getSiteByCode",
      payload: { factoryCode },
    }),
  updateSite: (groupName, factoryCode, sdpSite, technician, sdpArea) =>
    dispatch({
      type: "updateSite",
      payload: { groupName, factoryCode, sdpSite, technician, sdpArea },
    }),
  deleteSite: (factoryCode) =>
    dispatch({
      type: "deleteSite",
      payload: { factoryCode },
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

export default connect(mapStateToProps, mapDispatchToProps)(TechnicianMgtTab);
