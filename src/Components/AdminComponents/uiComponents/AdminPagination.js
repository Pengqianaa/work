import { useIntl } from "react-intl";
import TablePagination from "@mui/material/TablePagination";
import { Pagination } from "@mui/material";
import { ROWS_PER_PAGE } from "src/Common/constants";

// TODO: 待刪除並將有使用到的以 Pagination 取代
const AdminPagination = (props) => {
  const intl = useIntl();
  const {
    pageName,
    rowsPerPageName,
    queryResults,
    rowsPerPage = 10,
    page,
    handleChangePage,
    handleChangeRowsPerPage,
  } = props;
  const hasPages = queryResults.totalPages !== 0;
  let _handleChangePage = (e, p) => {
    if (pageName) {
      e.target.name = pageName;
    }
    handleChangePage(e, p - 1);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <TablePagination
        rowsPerPageOptions={ROWS_PER_PAGE}
        count={queryResults.total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: {
            "aria-label": intl.formatMessage({ id: "adminCommon.rowsPerPage" }),
          },
          native: true,
          ...(rowsPerPageName && { name: rowsPerPageName }),
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        component={(props) => <div {...props}>{props.children}</div>}
      />
      <div style={{ margin: "auto 8px auto" }}>
        <Pagination
          count={queryResults.totalPages || 0}
          page={hasPages ? page + 1 : 1}
          onChange={_handleChangePage}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
};

export default AdminPagination;
