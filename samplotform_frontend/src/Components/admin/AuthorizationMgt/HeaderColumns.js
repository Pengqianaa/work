import { FormattedMessage } from "react-intl";
import { TableCell, TableSortLabel } from "@mui/material";
import PropTypes from "prop-types";
import {
  DEFAULT_SORT_COL,
  AuthorizationMgtCols,
} from "src/constants/admin/AuthorizationMgt";

const COLUMNS = [...AuthorizationMgtCols];

const Label = ({ id }) => (
  <FormattedMessage id={`ADMIN.AUTHORIZATION_MGT.TABLE.${id}`} />
);

const HeaderColumns = ({ direction, sortingColumn, onClick }) => (
  <>
    <TableCell style={{ minWidth: 100 }}>
      <FormattedMessage id="ADMIN.COMMON.FORM_CONTROL_LABEL.OPERATE" />
    </TableCell>
    {COLUMNS.map((column) => {
      const _sortingColumn =
        column.id === "account" ? DEFAULT_SORT_COL : column.id;
      const active = sortingColumn === _sortingColumn;
      return (
        <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
          <TableSortLabel
            onClick={() => onClick(_sortingColumn)}
            active={active}
            direction={direction}
            hideSortIcon={!active}
          >
            <Label id={column.label} />
          </TableSortLabel>
        </TableCell>
      );
    })}
  </>
);

HeaderColumns.propTypes = {
  direction: PropTypes.string.isRequired,
  sortingColumn: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default HeaderColumns;
