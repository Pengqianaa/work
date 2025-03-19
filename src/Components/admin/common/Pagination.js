import { useIntl } from "react-intl";
import { TablePagination, Pagination as MuiPagination } from "@mui/material";

const ROWS_PER_PAGE = [5, 10, 25];

const Pagination = ({
  pageName,
  rowsPerPageName,
  queryResults,
  rowsPerPage = 10,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  const intl = useIntl();

  const hasPages = queryResults.totalPages !== 0;

  const onChange = (e, p) => {
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
        <MuiPagination
          count={queryResults.totalPages || 0}
          page={hasPages ? page + 1 : 1}
          onChange={onChange}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
};

export default Pagination;
