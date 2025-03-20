import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from '../../common';
import SearchQueries from './SearchQueries';
import HeaderColumns from './HeaderColumns';
import BodyColumns from './BodyColumns';
import { ALL, SORTING_DIRECTION } from 'src/constants/common';
import { DEFAULT_SORT_COL } from 'src/constants/admin/SWCollectionMgt';
import { ACTIONS } from 'src/Reducers/admin/SWCollectionMgt/OrgMgtReducer';

const OrgMgtTab = () => {
	const dispatch = useDispatch();
	const { sort, total, pageSize, totalPages } = useSelector(
		(state) => state.SWOrgMgt
	);
	const [fetchStatus, setFetchStatus] = useState(true);
	const [isASC, setIsASC] = useState(true);
	const [sortingColumn, setSortingColumn] = useState(DEFAULT_SORT_COL.ORG_MGT);

	const [params, setParams] = useState({
		year: new Date(),
		area: ALL,
		bgName: ALL,
		buName: ALL,
		costCenter: '',
		pageNumber: 0,
		pageSize,
		sort,
	});

	useEffect(() => {
		setFetchStatus(false);
	}, []);

	useEffect(() => {
		getSwCollectionOrgMgtList();

		if (params.sort === sort) {
			setIsASC(true);
			setSortingColumn(DEFAULT_SORT_COL.ORG_MGT);
		}
	}, [params.pageNumber, params.pageSize, params.sort]);

	const getSwCollectionOrgMgtList = () => {
		dispatch({
			type: ACTIONS.GET_ORG_MGT_LIST,
			payload: {
				...params,
				year: params.year.getFullYear(),
				pageNumber: params.pageNumber + 1,
				fetchStatus,
			},
		});
	};

	const sortHandler = (property) => {
		// 判断点击的属性是否被点击过，第一次点击 sortingColumn和property不相同，asc为true，排序方式为升序，再次点击为降序
		const asc = sortingColumn === property ? !isASC : true;
		setIsASC(asc);
		setSortingColumn(property);

		setParams((prev) => ({
			...prev,
			sort: `${property},${
				asc ? SORTING_DIRECTION.ASC_LOWERCASE : SORTING_DIRECTION.DESC_LOWERCASE
			}`, // 拼接为查询要求格式
			pageNumber: 0,
		}));
	};

	const handleChangePage = (event, newPage) => {
		setParams((prev) => ({
			...prev,
			pageNumber: newPage,
		}));
	};

	const handleChangeRowsPerPage = (event) => {
		setParams((prev) => ({
			...prev,
			pageSize: parseInt(event.target.value, 10),
			pageNumber: 0,
		}));
	};

	return (
		<Table
			searchQueries={
				<SearchQueries
					params={params}
					setParams={setParams}
					onSearch={getSwCollectionOrgMgtList}
				/>
			}
			headerColumns={
				<HeaderColumns
					sortingColumn={sortingColumn}
					direction={isASC ? 'asc' : 'desc'}
					onClick={sortHandler}
				/>
			}
			bodyColumns={<BodyColumns />}
			queryResults={{ totalPages: totalPages, total: total }}
			showPagination={true}
			page={params.pageNumber}
			rowsPerPage={params.pageSize}
			handleChangePage={handleChangePage}
			handleChangeRowsPerPage={handleChangeRowsPerPage}
		/>
	);
};

export default OrgMgtTab;
