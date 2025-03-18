import { useSelector } from 'react-redux';
import { TableRow, TableCell } from '@mui/material';
import { OrgMgtCols } from 'src/constants/admin/SWCollectionMgt';

const COLUMNS = [...OrgMgtCols];

const BodyColumns = () => {
	const list = useSelector((state) => state.SWOrgMgt.list);

	return list?.map((el, index) => (
		<TableRow
			hover
			role='checkbox'
			tabIndex={-1}
			key={`${el.costCenter}-${index}`}>
			{COLUMNS.map((column) => {
				return (
					<TableCell key={`${column.id}-${el.costCenter}`}>
						{column.viewCallback(el[column.id])}
					</TableCell>
				);
			})}
		</TableRow>
	));
};

export default BodyColumns;
