import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { CButton } from "@coreui/react";
import { showWithDefault } from "../../Common/common";
import { SOURCE_SYSTEM } from "../../Common/constants";

const columns = [
  { id: "name", label: "name", minWidth: 170 },
  { id: "applyComputer", label: "computer", minWidth: 100 },
  { id: "version", label: "version", minWidth: 100 },
  { id: "referencePrice", label: "price", minWidth: 100 },
  { id: "installDate", label: "installDate", minWidth: 100 },
  { id: "sourceSystem", label: "source", minWidth: 100 },
];

const AppCheckbox = (props) => {
  let { checked, onCheck, value } = props;
  let handleOnCheck = () => {
    onCheck(value);
  };

  return (
    <Checkbox
      style={{ color: "#00A0E9" }}
      edge="start"
      checked={checked}
      onChange={handleOnCheck}
      disableRipple
    />
  );
};

const MyAppsTable = (props) => {
  const {
    uninstallEnable,
    installed,
    selected,
    onCheck,
    onDelete,
    total,
    pageNum,
    pageSize,
    getAppList,
    intl,
  } = props;

  const [page, setPage] = useState(pageNum - 1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [rows, setRows] = useState(installed);

  useEffect(() => {
    setRows(installed);
  }, [installed]);
  useEffect(() => {
    setPage(pageNum - 1);
  }, [pageNum]);
  useEffect(() => {
    setRowsPerPage(pageSize);
  }, [pageSize]);

  let handleCheck = (value) => {
    let isSelected = selected.filter((el) => el.id === value.id).length > 0;
    if (isSelected) {
      let newSelected = selected;
      let rmIdx = null;
      newSelected.forEach((item, index) => {
        if (item.id === value.id) {
          rmIdx = index;
        }
      });
      newSelected.splice(rmIdx, 1);
      onCheck([...newSelected]);
    } else {
      let newSelected = selected;
      newSelected.push(value);
      onCheck([...newSelected]);
    }
  };
  let handleCheckAll = () => {
    if (rows.length === selected.length) {
      onCheck([]);
    } else {
      onCheck([...installed]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    getAppList(newPage + 1, pageSize, SOURCE_SYSTEM.SPR);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    getAppList(1, event.target.value, SOURCE_SYSTEM.SPR);
  };

  return (
    <div>
      <TableContainer style={{ marginBottom: "50px" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {uninstallEnable && (
                <TableCell>
                  <AppCheckbox
                    checked={
                      selected.length > 0 && rows.length === selected.length
                    }
                    value={{}}
                    onCheck={handleCheckAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {intl.formatMessage({ id: `myApp.${column.label}` })}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {uninstallEnable && (
                      <TableCell key={row.code}>
                        <AppCheckbox
                          key={row.sourceInstallId}
                          checked={
                            selected.filter((el) => el.id === row.id).length > 0
                          }
                          value={row}
                          onCheck={handleCheck}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => {
                      let value = row[column.id];
                      if (column.id === "referencePrice") {
                        value = showWithDefault(value, "--");
                        if (value !== "--") {
                          value = value.toLocaleString();
                        }
                      }
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {uninstallEnable && total > 0 && (
        <CButton
          color="danger"
          disabled={selected.length > 0 ? false : true}
          onClick={onDelete}
          style={{
            marginLeft: "20px",
            cursor: selected.length > 0 ? "pointer" : "default",
          }}
        >
          <FormattedMessage id="myApp.uninstall" />
        </CButton>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={`${intl.formatMessage({ id: "myApp.rowsPerPage" })}:`}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} ${intl.formatMessage(
            { id: "myApp.pagination" },
            { count: count }
          )}`
        }
      />
    </div>
  );
};

export default MyAppsTable;
