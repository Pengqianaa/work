import { FormattedMessage } from 'react-intl';
import { TableCell, TableSortLabel } from '@mui/material';
import PropTypes from 'prop-types';
import { OrgMgtCols } from 'src/constants/admin/SWCollectionMgt';

const COLUMNS = [...OrgMgtCols];

const Label = ({ id }) => (
	<FormattedMessage id={`ADMIN.SW_COLLECTION_MGT.SW_ORG_MGT.TABLE.${id}`} />
);

const HeaderColumns = ({ direction, sortingColumn, onClick }) =>
	COLUMNS.map((column) => {
		// NOTE: 因資料來源因素, 排序需用 region 而非 area
		const _sortingColumn = column.id === 'area' ? 'region' : column.id;
		const active = sortingColumn === _sortingColumn;
		return (
			<TableCell key={column.id} style={{ minWidth: column.minWidth }}>
				{column.id === 'status' ? (
					<Label id={column.label} />
				) : (
					<TableSortLabel
						onClick={() => onClick(_sortingColumn)}
						active={active}
						direction={direction}
						hideSortIcon={!active}>
						<Label id={column.label} />
					</TableSortLabel>
				)}
			</TableCell>
		);
	});

HeaderColumns.propTypes = {
	direction: PropTypes.string.isRequired,
	sortingColumn: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};

export default HeaderColumns;
