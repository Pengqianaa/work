import { isValidElement, memo } from "react";
import PropTypes from "prop-types";
import requiredIf from "react-required-if";
import {
  Grid,
  TableContainer,
  Paper,
  Table as MuiTable,
  TableBody,
  TableHead,
  TableRow,
} from "@mui/material";
import Pagination from "./Pagination";
import { styled } from "@mui/material/styles";

const StyledGrid = styled(Grid)(({ theme }) => ({
  // padding: theme.spacing(2),
}));

const Table = ({
  showPagination = false,
  searchQueries,
  headerColumns,
  bodyColumns,
  queryResults,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  const isSearchQueriesValidElement = isValidElement(searchQueries);
  const isHeaderColumnsValidElement = isValidElement(headerColumns);
  const isBodyColumnsValidElement = isValidElement(bodyColumns);

  return (
    <StyledGrid container>
      <TableContainer component={Paper}>
        {isSearchQueriesValidElement ? searchQueries : null}
      </TableContainer>
      <TableContainer component={Paper}>
        <MuiTable aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              {isHeaderColumnsValidElement ? headerColumns : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {isBodyColumnsValidElement ? bodyColumns : null}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {showPagination && (
        <TableContainer component={Paper}>
          <Pagination
            queryResults={queryResults}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </StyledGrid>
  );
};

Table.propTypes = {
  showPagination: PropTypes.bool.isRequired,
  searchQueries: PropTypes.node,
  headerColumns: PropTypes.node.isRequired,
  bodyColumns: PropTypes.node.isRequired,
  queryResults: requiredIf(
    PropTypes.shape({
      total: PropTypes.number,
      totalPages: PropTypes.number,
    }),
    (props) => props.showPagination
  ),
  page: requiredIf(PropTypes.number, (props) => props.showPagination),
  rowsPerPage: requiredIf(PropTypes.number, (props) => props.showPagination),
  handleChangePage: requiredIf(PropTypes.func, (props) => props.showPagination),
  handleChangeRowsPerPage: requiredIf(
    PropTypes.func,
    (props) => props.showPagination
  ),
};

export default memo(Table);
