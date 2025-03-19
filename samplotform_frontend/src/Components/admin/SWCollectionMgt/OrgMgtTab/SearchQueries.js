import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { ErrorIcon, BUTTON_TYPES, Buttons } from 'src/Components/common';
import {
	CostCenterAreaSelector,
	CostCenterBgSelector,
	CostCenterBuSelector,
	YearVersionSelector,
	TableHeadContainer,
	FilterGroup,
	FilterContainer,
	TextFieldControl,
} from 'src/Components/admin/common';
import { ACTIONS } from 'src/Reducers/admin/SWCollectionMgt/OrgMgtReducer';
import { ALL } from 'src/constants/common';
import { styled } from '@mui/material/styles';

const StyledSpan = styled('span')(({ theme }) => ({
	marginBlock: 0,
	marginInline: theme.spacing(2),
}));

const StyledFilterGroup = styled(FilterGroup)({
	alignItems: 'center',
});

const SEARCH_PARAMS = {
	YEAR: 'year',
	AREA: 'area',
	BG: 'bgName',
	BU: 'buName',
	COST_CENTER: 'costCenter',
};

const SearchQueries = ({ params, setParams, onSearch }) => {
	const intl = useIntl();
	const dispatch = useDispatch();
	const { sort, pageSize, currentUpdatedDate, lastUpdatedDate } = useSelector(
		(state) => state.SWOrgMgt
	);
	const year = params[SEARCH_PARAMS.YEAR].getFullYear();

	const onChange = (event, type) => {
		if (!event) {
			return;
		}
		const isYearChange = SEARCH_PARAMS.YEAR === type;

		setParams((prev) => ({
			...prev,
			pageNumber: 0,
			[type]: isYearChange ? new Date(event) : event.target.value,
			...(isYearChange && {
				[SEARCH_PARAMS.AREA]: ALL,
				[SEARCH_PARAMS.BG]: ALL,
				[SEARCH_PARAMS.BU]: ALL,
			}),
		}));
	};

	const onClickDownloadExample = () => {
		dispatch({
			type: ACTIONS.DOWNLOAD_ORG_MGT_EXCEL,
		});
	};

	const onClickImport = (file) => {
		dispatch({
			type: ACTIONS.IMPORT_ORG_MGT_EXCEL,
			payload: { file },
		});
		setParams({
			year: new Date(),
			areaId: ALL,
			bgId: ALL,
			buId: ALL,
			costCenter: '',
			pageNumber: 0,
			pageSize,
			sort,
		});
	};

	const onClickExport = () => {
		dispatch({
			type: ACTIONS.EXPORT_ORG_MGT_EXCEL,
			payload: { year: params.year.getFullYear() },
		});
	};

	return (
		<>
			<TableHeadContainer>
				<StyledFilterGroup>
					<ErrorIcon />
					<FormattedMessage id='ADMIN.SW_COLLECTION_MGT.SW_ORG_MGT.FIRST_VERSION_OF_YEAR' />
					<StyledSpan>{currentUpdatedDate}</StyledSpan>
				</StyledFilterGroup>
				<StyledFilterGroup>
					<FormattedMessage id='ADMIN.COMMON.TEXT.LAST_UPDATED' />:
					<StyledSpan>{lastUpdatedDate}</StyledSpan>
				</StyledFilterGroup>
				<StyledFilterGroup>
					<Buttons
						type={BUTTON_TYPES.DOWNLOAD_EXAMPLE}
						onClick={onClickDownloadExample}
					/>
					<StyledSpan>
						<FormattedMessage id='ADMIN.COMMON.TEXT.EXCEL_BATCH_IMPORT' />
					</StyledSpan>
					<Buttons
						type={BUTTON_TYPES.IMPORT}
						onUpload={onClickImport}
						disabled={false}
					/>
				</StyledFilterGroup>
			</TableHeadContainer>
			<TableHeadContainer>
				<FilterGroup>
					<YearVersionSelector
						value={params[SEARCH_PARAMS.YEAR]}
						onChange={(event) => onChange(event, SEARCH_PARAMS.YEAR)}
					/>
					<CostCenterAreaSelector
						year={year}
						showCheckbox={false}
						value={params[SEARCH_PARAMS.AREA] ?? ALL}
						onChange={(event) => onChange(event, SEARCH_PARAMS.AREA)}
					/>
					<CostCenterBgSelector
						year={year}
						showCheckbox={false}
						value={params[SEARCH_PARAMS.BG] ?? ALL}
						onChange={(event) => onChange(event, SEARCH_PARAMS.BG)}
					/>
					<CostCenterBuSelector
						year={year}
						showCheckbox={false}
						selectedBgName={params[SEARCH_PARAMS.BG] ?? ALL}
						value={params[SEARCH_PARAMS.BU] ?? ALL}
						onChange={(event) => onChange(event, SEARCH_PARAMS.BU)}
					/>
					<FilterContainer>
						<TextFieldControl
							label={intl.formatMessage({
								id: 'ADMIN.COMMON.FORM_CONTROL_LABEL.COST_CENTER',
							})}
							value={params[SEARCH_PARAMS.COST_CENTER] ?? ''}
							onChange={(event) => onChange(event, SEARCH_PARAMS.COST_CENTER)}
							style={{ width: 120 }}
						/>
					</FilterContainer>
				</FilterGroup>
				<StyledFilterGroup>
					<Buttons type={BUTTON_TYPES.SEARCH} onClick={onSearch} />
					<Buttons
						type={BUTTON_TYPES.EXPORT}
						onClick={onClickExport}
						style={{ marginLeft: 14 }}
					/>
				</StyledFilterGroup>
			</TableHeadContainer>
		</>
	);
};

export default SearchQueries;
