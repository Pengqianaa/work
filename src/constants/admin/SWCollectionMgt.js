import { FormattedMessage } from 'react-intl';
import { Chip } from '@mui/material/';
import { Tag } from 'src/Components/admin/common';
import { viewCallback, viewFormatDateCallback } from 'src/utils/methods/common';
import { STATUS_TYPE, MOMENT_FORMAT } from 'src/constants/common';

const DEFAULT_SORT_COL = {
	RATE_MGT: 'swCollectionPlan.year',
	ORG_MGT: 'costCenter',
	SW_COLLECTION_PLAN: 'version',
};

// RateMgt
const RateMgtCols = [
	{
		id: 'version',
		label: 'VERSION',
		minWidth: 100,
		viewCallback,
	},
	{
		id: 'fromCurrency',
		label: 'FROM_CURRENCY',
		minWidth: 100,
		viewCallback,
	},
	{
		id: 'toCurrency',
		label: 'TO_CURRENCY',
		minWidth: 100,
		viewCallback,
	},
	{
		id: 'rate',
		label: 'RATE',
		minWidth: 100, // 小數點3位數
		viewCallback,
	},
	{
		id: 'lastUpdated',
		label: 'MODIFIED',
		minWidth: 100,
		viewCallback: (el) =>
			viewFormatDateCallback(el, MOMENT_FORMAT.DATE_TIME_WITH_SECOND),
	},
];

// OrgMgt
const OrgMgtCols = [
	{
		id: 'costCenter',
		label: 'COST_CENTER',
		minWidth: 80,
		viewCallback,
	},
	{
		id: 'status',
		label: 'STATUS',
		minWidth: 100,
		viewCallback: (el) => {
			switch (el) {
				case 'ADD':
					return <Tag label={<FormattedMessage id='COMMON.TEXT.NEW' />} />;
				case 'DELETE':
					return (
						<Tag
							type={STATUS_TYPE.ERROR}
							label={<FormattedMessage id='COMMON.TEXT.DELETE' />}
						/>
					);
				default:
					return <span>{el ? el : '-'}</span>;
			}
		},
	},
	{
		id: 'area',
		label: 'REGION',
		minWidth: 100,
		viewCallback,
	},
	{
		id: 'bg',
		label: 'BG',
		minWidth: 100,
		viewCallback,
	},
	{
		id: 'bu',
		label: 'BU',
		minWidth: 100,
		viewCallback,
	},
];

// AuthorityMgt
const AuthorityMgtCols = [
	{
		id: 'adAcount',
		label: 'Account',
		minWidth: 100,
		viewCallback,
	},
	{
		id: 'username',
		label: 'Name',
		minWidth: 100,
		viewCallback,
	},
	{
		id: 'roles',
		label: 'Role',
		minWidth: 100,
		viewCallback: (el) => {
			if (!el) {
				return '-';
			}
			if (el.length < 1) {
				return '-';
			}
			return el.toString();
		},
	},
	{
		id: 'bgBuList',
		label: 'BG/BU',
		minWidth: 100,
		viewCallback: (el) => {
			if (!el) {
				return '-';
			}
			if (el.length < 1) {
				return '-';
			}
			return (
				<>
					{el.map((e) => {
						return (
							<Chip key={e} size='small' style={{ margin: '2px' }} label={e} />
						);
					})}
				</>
			);
		},
	},
	{
		id: 'costCenterCode',
		label: 'Cost Center',
		minWidth: 100,
		viewCallback: (el) => {
			if (!el) {
				return '-';
			}
			if (el.length < 1) {
				return '-';
			}
			let array = el.split(',');
			return (
				<>
					{array.map((e) => {
						return (
							<Chip key={e} size='small' style={{ margin: '2px' }} label={e} />
						);
					})}
				</>
			);
		},
	},
];

// SWCollectionPlan
const SWCollectionPlanCols = [
	{
		id: 'version',
		label: 'VERSION',
		minWidth: 100,
		viewCallback,
	},
	{
		id: 'status',
		label: 'STATUS',
		minWidth: 100,
		viewCallback: (el) => {
			// Note: Finish is green
			let type = STATUS_TYPE.SUCCESS;

			switch (el) {
				case 'In progress':
					type = STATUS_TYPE.WARNING;
					break;
				case 'Unprocessed':
					type = STATUS_TYPE.DEFAULT;
					break;
				default:
					break;
			}

			return el ? <Tag type={type} label={el} /> : '-';
		},
	},
	{
		id: 'beginDate',
		label: 'BEGIN_DATE',
		minWidth: 100,
		viewCallback: (el) => viewFormatDateCallback(el, MOMENT_FORMAT.DATE),
	},
	{
		id: 'endDate',
		label: 'END_DATE',
		minWidth: 100,
		viewCallback: (el) => viewFormatDateCallback(el, MOMENT_FORMAT.DATE),
	},
	{
		id: 'modified',
		label: 'MODIFIED',
		minWidth: 100,
		viewCallback: (el) => viewFormatDateCallback(el, MOMENT_FORMAT.DATE),
	},
];

export {
	DEFAULT_SORT_COL,
	RateMgtCols,
	OrgMgtCols,
	AuthorityMgtCols,
	SWCollectionPlanCols,
};
