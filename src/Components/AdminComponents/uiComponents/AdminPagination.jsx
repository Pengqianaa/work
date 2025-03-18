import { useIntl } from "react-intl";
import TablePagination from "@mui/material/TablePagination";
import { Pagination } from "@mui/material";
import { ROWS_PER_PAGE } from "../../../Common/constants";
import PropTypes from "prop-types"; // 引入 prop-types 进行类型检查

const AdminPagination = (props) => {
  const intl = useIntl();
  const {
    rowsPerPageName,
    queryResults = { totalElements: 0, totalPages: 0 }, // 使用預設參數
    rowsPerPage = 10, // 使用預設參數
    page = 0, // 使用預設參數
    handleChangePage,
    handleChangeRowsPerPage,
  } = props;

  // 確保 page 是數值類型
  const numericPage = Number(page);
  const hasPages = queryResults.totalPages !== 0;

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    handleChangeRowsPerPage(newRowsPerPage);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <TablePagination
        rowsPerPageOptions={ROWS_PER_PAGE}
        count={queryResults.totalElements || 0}
        rowsPerPage={rowsPerPage}
        page={page} // 確保頁碼在範圍內
        SelectProps={{
          inputProps: {
            "aria-label": intl.formatMessage({ id: "adminCommon.rowsPerPage" }),
          },
          native: true,
          ...(rowsPerPageName && { name: rowsPerPageName }),
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleRowsPerPageChange}
        component={(props) => <div {...props}>{props.children}</div>}
      />
      <div style={{ margin: "auto 8px auto" }}>
        <Pagination
          count={queryResults.totalPages || 0}
          page={
            hasPages
              ? Math.min(Number(numericPage) + 1, Number(queryResults.totalPages || 1))
              : 1
          }
          onChange={(e, p) => handleChangePage(e, p - 1)}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
};

// 添加 prop-types 检查
AdminPagination.propTypes = {
  rowsPerPageName: PropTypes.string,
  queryResults: PropTypes.shape({
    totalElements: PropTypes.number,
    totalPages: PropTypes.number,
  }),
  rowsPerPage: PropTypes.number,
  page: PropTypes.number,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
};

export default AdminPagination;