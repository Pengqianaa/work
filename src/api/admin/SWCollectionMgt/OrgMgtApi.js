import CallSamApiFunc from 'src/utils/methods/CallSamApiFunc';
import { ALL, METHOD_TYPE } from 'src/constants/common';
import { DEFAULT_SORT_COL } from 'src/constants/admin/SWCollectionMgt';
const url = '/swcollection';

const getOrgMgtStatus = () =>
	CallSamApiFunc(METHOD_TYPE.POST, `${url}/message`, {}, {});

const getOrgMgtList = ({
	year = new Date().getFullYear(),
	area = '',
	bgName = '',
	buName = '',
	costCenter = '',
	pageNumber = 1,
	pageSize = 10,
	sort = `${DEFAULT_SORT_COL.ORG_MGT},asc`,
}) =>
	CallSamApiFunc(
		METHOD_TYPE.GET,
		`${url}/list`,
		{},
		{
			year,
			area: area === ALL ? '' : area,
			bgName: bgName === ALL ? '' : bgName,
			buName: buName === ALL ? '' : buName,
			costCenter,
			pageNumber,
			pageSize,
			sort,
			['un-page']: false,
		}
	);

const exportOrgMgtExcel = (year) =>
	CallSamApiFunc(
		METHOD_TYPE.GET,
		`${url}/export`,
		{
			responseType: 'blob',
		},
		year
	);

const importOrgMgtExcel = ({ file }) => {
	const formData = new FormData();
	formData.append('file', file);
	return CallSamApiFunc(METHOD_TYPE.POST, `${url}/upload`, {}, formData);
};

const downloadOrgMgtExcelTemplate = () => {
	return CallSamApiFunc(METHOD_TYPE.GET, `${url}/template`, {
		responseType: 'blob',
	});
};

export default {
	getOrgMgtStatus,
	getOrgMgtList,
	exportOrgMgtExcel,
	importOrgMgtExcel,
	downloadOrgMgtExcelTemplate,
};
