import CallSamApiFunc from 'src/utils/methods/CallSamApiFunc';
import moment from 'moment';
import {
	MODIFY_ACTION_TYPE,
	METHOD_TYPE,
	SORTING_DIRECTION,
	MOMENT_FORMAT,
} from 'src/constants/common';
import { DEFAULT_SORT_COL } from 'src/constants/admin/SWCollectionMgt';
const url = '/swcollection/plan/open-date';

const getSWCollectionPlanList = ({
	pageNum = 1,
	pageSize = 10,
	// sort = "version,asc",
	orderFile = DEFAULT_SORT_COL.SW_COLLECTION_PLAN,
	order = SORTING_DIRECTION.DESC_UPPERCASE,
}) =>
	CallSamApiFunc(
		METHOD_TYPE.GET,
		url,
		{},
		{ pageNum, pageSize, orderFile, order }
	);

const postSWCollectionPlan = ({
	action = MODIFY_ACTION_TYPE.ADD,
	currYear,
	beginDate,
	endDate,
}) => {
	const _url = `${url}${action === MODIFY_ACTION_TYPE.ADD ? '/add' : ''}`;

	return CallSamApiFunc(
		METHOD_TYPE.POST,
		`${_url}?currYear=${currYear}`,
		{},
		{
			currYear,
			beginDate: moment(beginDate).format(MOMENT_FORMAT.DATE_TIME_WITH_SECOND),
			endDate: moment(endDate).format(MOMENT_FORMAT.DATE_TIME_WITH_SECOND),
		}
	);
};

export default { getSWCollectionPlanList, postSWCollectionPlan };
