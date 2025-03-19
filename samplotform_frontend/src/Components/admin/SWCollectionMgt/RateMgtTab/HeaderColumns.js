import { FormattedMessage } from 'react-intl';
import { TableCell, TableSortLabel } from '@mui/material';
import PropTypes from 'prop-types';
import {
	DEFAULT_SORT_COL,
	RateMgtCols,
} from 'src/constants/admin/SWCollectionMgt';

const COLUMNS = [...RateMgtCols];

const Label = ({ id }) => (
	<FormattedMessage id={`ADMIN.SW_COLLECTION_MGT.SW_RATE_MGT.TABLE.${id}`} />
);

const HeaderColumns = ({ direction, sortingColumn, onClick }) => (
	<>
		<TableCell style={{ maxWidth: 100 }}>
			<FormattedMessage id='ADMIN.COMMON.FORM_CONTROL_LABEL.OPERATE' />
		</TableCell>
		{COLUMNS.map((column) => {
			// NOTE: 因資料來源因素, 排序需用 swCollectionPlan.year 而非 version
			const _sortingColumn =
				column.id === 'version' ? DEFAULT_SORT_COL.RATE_MGT : column.id;
			const active = sortingColumn === _sortingColumn;
			return (
				<TableCell key={column.id} style={{ minWidth: column.minWidth }}>
					<TableSortLabel
						onClick={() => onClick(_sortingColumn)}
						active={active}
						direction={direction}
						hideSortIcon={!active}>
						<Label id={column.label} />
					</TableSortLabel>
				</TableCell>
			);
		})}
	</>
);

HeaderColumns.propTypes = {
	direction: PropTypes.string.isRequired,
	sortingColumn: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};

export default HeaderColumns;
