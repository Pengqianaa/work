import { TableCell, TableSortLabel } from "@mui/material";
import PropTypes from "prop-types";
import { AuthorityMgtCols } from "src/constants/admin/SWCollectionMgt";
import { FormattedMessage } from "react-intl";

const COLUMNS = [...AuthorityMgtCols];

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
                  active={false}
                  direction={direction}
                  hideSortIcon={true}
                  style={{ minWidth: column.minWidth }}
                >
                  <FormattedMessage id={`swCollectionMgt.swAuthorityMgt.${column.id}`} />
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
