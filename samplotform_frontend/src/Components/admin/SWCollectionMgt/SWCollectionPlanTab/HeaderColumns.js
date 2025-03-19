import { FormattedMessage } from "react-intl";
import { TableCell, TableSortLabel } from "@mui/material";
import PropTypes from "prop-types";
import { SWCollectionPlanCols } from "src/constants/admin/SWCollectionMgt";

const COLUMNS = [...SWCollectionPlanCols];

const Label = ({ id }) => (
  <FormattedMessage
    id={`ADMIN.SW_COLLECTION_MGT.SW_COLLECTION_PLAN.TABLE.${id}`}
  />
);

const HeaderColumns = ({ direction, sortingColumn, onClick }) => (
  <>
    <TableCell style={{ maxWidth: 80 }}>
      <FormattedMessage id="ADMIN.COMMON.FORM_CONTROL_LABEL.OPERATE" />
    </TableCell>
    {COLUMNS.map((column, index) => (
      <TableCell
        key={`${column.id}-${index}`}
        style={{ minWidth: column.minWidth }}
      >
        {column.id === "status" ? (
          <Label id={column.label} />
        ) : (
          <TableSortLabel
            onClick={() => onClick(column.id)}
            active={sortingColumn === column.id}
            direction={direction}
            hideSortIcon={sortingColumn !== column.id}
          >
            <Label id={column.label} />
          </TableSortLabel>
        )}
      </TableCell>
    ))}
  </>
);

HeaderColumns.propTypes = {
  direction: PropTypes.string.isRequired,
  sortingColumn: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default HeaderColumns;
