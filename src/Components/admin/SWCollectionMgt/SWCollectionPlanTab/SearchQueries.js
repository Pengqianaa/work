import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import PropTypes from "prop-types";
import moment from "moment";
import { ErrorIcon, BUTTON_TYPES, Buttons } from "src/Components/common";
import { TableHeadContainer, FilterGroup } from "src/Components/admin/common";
import { Actions, MOMENT_FORMAT } from "src/constants/common";
import { styled } from "@mui/material/styles";

const TopTableHeadContainer = styled(TableHeadContainer)({
  marginTop: "24px",
});

const StyledSpan = styled("span")(({ theme }) => ({
  color: "var(--delta-red)",
  marginBlock: 0,
  marginInline: theme.spacing(2),
}));

const StyledFilterGroup = styled(FilterGroup)({
  alignItems: "center",
});

const { DATE } = MOMENT_FORMAT;

const SearchQueries = ({ toggle }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { beginDate: _beginDate, endDate: _endDate } = useSelector(
    (state) => state.SWCollectionPlan.planDate
  );
  const notSetText = <FormattedMessage id="ADMIN.COMMON.TEXT.NOT_SET_YET" />;
  const beginDate = moment(_beginDate).format(DATE);
  const endDate = moment(_endDate).format(DATE);
  const begin = _beginDate ? beginDate : notSetText;

  const onClick = () => {
    // NOTE: 如當年份以有資料, 顯示提示訊息
    if (!_beginDate && !_endDate) {
      toggle(true);
      return;
    }

    showAlertMessage({
      title: intl.formatMessage({ id: "COMMON.MODAL.TITLE" }),
      message: intl.formatMessage({
        id: "ADMIN.SW_COLLECTION_MGT.SW_COLLECTION_PLAN.ALERT_CONTENT",
      }),
      hasCancel: false,
      callback: () => {},
    });
  };

  const showAlertMessage = (props) => {
    dispatch({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props,
      },
    });
  };

  return (
    <>
      <TopTableHeadContainer>
        <StyledFilterGroup>
          <FormattedMessage id="ADMIN.SW_COLLECTION_MGT.SW_COLLECTION_PLAN.INSTALLED_COUNT_DATE" />
          <StyledSpan>{begin}</StyledSpan>
          <ErrorIcon />
          <FormattedMessage id="ADMIN.SW_COLLECTION_MGT.SW_COLLECTION_PLAN.INFO" />
        </StyledFilterGroup>
      </TopTableHeadContainer>
      <TableHeadContainer>
        <StyledFilterGroup>
          <FormattedMessage id="ADMIN.SW_COLLECTION_MGT.SW_COLLECTION_PLAN.SW_COLLECTION_CURRENT_RANGE" />
          <StyledSpan>
            {begin}~{_endDate ? endDate : notSetText}
          </StyledSpan>
        </StyledFilterGroup>
      </TableHeadContainer>
      <TableHeadContainer>
        <StyledFilterGroup>
          <Buttons type={BUTTON_TYPES.ADD} onClick={onClick} />
        </StyledFilterGroup>
      </TableHeadContainer>
    </>
  );
};

SearchQueries.propTypes = {
  toggle: PropTypes.func.isRequired,
};

export default SearchQueries;
