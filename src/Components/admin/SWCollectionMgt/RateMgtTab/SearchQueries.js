import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import { ErrorIcon, BUTTON_TYPES, Buttons } from "src/Components/common";
import {
  SearchInput,
  TableHeadContainer,
  FilterGroup,
} from "src/Components/admin/common";
import { Actions, CURRENCY_TYPE } from "src/constants/common";
import { styled } from "@mui/material/styles";

const StyledFilterGroup = styled(FilterGroup)({
  alignItems: "center",
});

const SEARCH_PARAMS = {
  KEYWORD: "keyword",
};

const SearchQueries = ({ params, setParams, toggle }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { currYearDataCount } = useSelector((state) => state.SWRateMgt);

  const calculateCombinations = useMemo(() => {
    const { length } = Object.values(CURRENCY_TYPE);
    return length * (length - 1);
  }, [Object.values(CURRENCY_TYPE).length]);

  const onChange = (event) => {
    setParams((prev) => ({
      ...prev,
      [SEARCH_PARAMS.KEYWORD]: event?.target?.value?.trim() ?? "",
    }));
  };

  const onClick = () => {
    // NOTE: 如當年份的幣值組合已滿額, 則顯示提示訊息
    if (currYearDataCount < calculateCombinations) {
      toggle(true);
      return;
    }

    showAlertMessage({
      title: intl.formatMessage({ id: "COMMON.MODAL.TITLE" }),
      message: "",
      message: intl.formatMessage({
        id: "ADMIN.SW_COLLECTION_MGT.SW_RATE_MGT.ALERT_CONTENT",
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
      <TableHeadContainer>
        <StyledFilterGroup>
          <ErrorIcon />
          <FormattedMessage id="ADMIN.SW_COLLECTION_MGT.SW_RATE_MGT.INFO" />
        </StyledFilterGroup>
      </TableHeadContainer>
      <TableHeadContainer>
        <Buttons type={BUTTON_TYPES.ADD} onClick={onClick} />
        <SearchInput
          className="searchinput"
          value={params[SEARCH_PARAMS.KEYWORD] ?? ""}
          onChange={onChange}
          placeholder={intl.formatMessage({ id: "ADMIN.COMMON.TEXT.KEYWORD" })}
        />
      </TableHeadContainer>
    </>
  );
};

export default SearchQueries;
