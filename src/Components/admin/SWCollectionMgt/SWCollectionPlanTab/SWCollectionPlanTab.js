import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from '../../common';
import SearchQueries from './SearchQueries';
import HeaderColumns from './HeaderColumns';
import BodyColumns from './BodyColumns';
import ModifySWCollectionPlanModal from './ModifySWCollectionPlanModal';
import { ACTIONS } from 'src/Reducers/admin/SWCollectionMgt/SWCollectionPlanReducer';
import { SORTING_DIRECTION } from 'src/constants/common';
import { DEFAULT_SORT_COL } from 'src/constants/admin/SWCollectionMgt';

const sort = (asc) =>
	asc ? SORTING_DIRECTION.ASC_UPPERCASE : SORTING_DIRECTION.DESC_UPPERCASE;

const SWCollectionPlanTab = () => {
	const dispatch = useDispatch();
	const { total, pageSize, totalPages } = useSelector(
		(state) => state.SWCollectionPlan
	);
	const [show, setShow] = useState(false);
	const [isASC, setIsASC] = useState(true);
	const [sortingColumn, setSortingColumn] = useState(
		DEFAULT_SORT_COL.SW_COLLECTION_PLAN
	);
	const [params, setParams] = useState({
		pageNum: 0,
		pageSize,
		// sort: `${DEFAULT_SORTING_COLUMN},asc`,
		orderFile: DEFAULT_SORT_COL.SW_COLLECTION_PLAN,
		order: SORTING_DIRECTION.DESC_UPPERCASE,
	});

	useEffect(() => {
		dispatch({
			type: ACTIONS.GET_SW_COLLECTION_PLAN_LIST,
			payload: {
				...params,
				pageNum: params.pageNum + 1,
			},
		});
	}, [params]);

	const sortHandler = (property) => {
		const asc = sortingColumn === property ? !isASC : true;
		setIsASC(asc);
		setSortingColumn(property);

		setParams((prev) => ({
			...prev,
			// sort: `${property},${asc ? "asc" : "desc"}`,
			orderFile: property,
			order: sort(asc),
			pageNum: 0,
		}));
	};

	const handleChangePage = (event, newPage) => {
		setParams((prev) => ({
			...prev,
			pageNum: newPage,
		}));
	};

	const handleChangeRowsPerPage = (event) => {
		setParams((prev) => ({
			...prev,
			pageSize: parseInt(event.target.value, 10),
			pageNum: 0,
		}));
	};

	return (
		<>
			<Table
				searchQueries={<SearchQueries toggle={setShow} />}
				headerColumns={
					<HeaderColumns
						sortingColumn={sortingColumn}
						direction={sort(isASC).toLowerCase()}
						onClick={sortHandler}
					/>
				}
				bodyColumns={<BodyColumns toggle={setShow} />}
				queryResults={{ totalPages: totalPages, total: total }}
				showPagination={true}
				page={params.pageNum}
				rowsPerPage={params.pageSize}
				handleChangePage={handleChangePage}
				handleChangeRowsPerPage={handleChangeRowsPerPage}
			/>
			{show && <ModifySWCollectionPlanModal show={show} toggle={setShow} />}
		</>
	);
};

export default SWCollectionPlanTab;
