import { TableCell, TableSortLabel, TableRow } from "@mui/material";
import PropTypes from "prop-types";
import { QueryOrDownloadCols } from "src/constants/admin/SWCollection";
import { FormattedMessage } from "react-intl";

const COLUMNS = [...QueryOrDownloadCols];

const HeaderColumns = ({ direction, sortingColumn, onClick }) => {

    return (
      <>
        <TableCell>
          <FormattedMessage id="adminCommon.operate" />
        </TableCell>
        {COLUMNS.map((column) => {
          return (
              <TableCell key={column.id}>
                <TableSortLabel
                  onClick={() => onClick(column.label)}
                  active={sortingColumn === column.label}
                  direction={direction}
                  hideSortIcon={sortingColumn !== column.label}
                  style={{ minWidth: column.minWidth }}
                >
                  <FormattedMessage id={`swCollection.SWYear.${column.id}`} />
                </TableSortLabel>
              </TableCell>
          );
        })}
      </>
  )
};

HeaderColumns.propTypes = {
  direction: PropTypes.string.isRequired,
  sortingColumn: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default HeaderColumns;
