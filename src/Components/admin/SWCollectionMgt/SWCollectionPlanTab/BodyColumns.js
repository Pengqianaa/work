import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
import { BUTTON_TYPES, Buttons } from 'src/Components/common';
import { SWCollectionPlanCols } from 'src/constants/admin/SWCollectionMgt';

const COLUMNS = [...SWCollectionPlanCols];

const BodyColumns = ({ toggle }) => {
	const { list } = useSelector((state) => state.SWCollectionPlan);
	const currentYear = new Date().getFullYear().toString();

	return list?.map((el) => (
		<TableRow hover role='checkbox' tabIndex={-1} key={el.planId}>
			{el.version === currentYear ? (
				<TableCell>
					<Buttons type={BUTTON_TYPES.EDIT} onClick={() => toggle(true)} />
				</TableCell>
			) : (
				<TableCell />
			)}
			{COLUMNS.map((column) => {
				return (
					<TableCell key={`${column.id}-${el.planId}`}>
						{column.viewCallback(el[column.id])}
					</TableCell>
				);
			})}
		</TableRow>
	));
};

BodyColumns.propTypes = {
	toggle: PropTypes.func.isRequired,
};

export default BodyColumns;
