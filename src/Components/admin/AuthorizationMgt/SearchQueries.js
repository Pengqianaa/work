import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import { BUTTON_TYPES, Buttons } from "src/Components/common";
import { SearchInput, TableHeadContainer } from "src/Components/admin/common";
import { Actions } from "src/constants/common";

const SEARCH_PARAMS = {
  KEYWORD: "keyword",
};

const SearchQueries = ({ params, setParams, toggle }) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const onChange = (event) => {
    setParams((prev) => ({
      ...prev,
      [SEARCH_PARAMS.KEYWORD]: event?.target?.value?.trim() ?? "",
    }));
  };

  const onClick = () => {
    toggle(true);

    // showAlertMessage({
    //   title: intl.formatMessage({ id: "COMMON.MODAL.TITLE" }),
    //   message: "",
    //   message: intl.formatMessage({
    //     id: "ADMIN.SW_COLLECTION_MGT.SW_RATE_MGT.ALERT_CONTENT",
    //   }),
    //   hasCancel: false,
    //   callback: () => {},
    // });
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
    <TableHeadContainer>
      <Buttons type={BUTTON_TYPES.ADD} onClick={onClick} />
      <SearchInput
        className="searchinput"
        value={params[SEARCH_PARAMS.KEYWORD] ?? ""}
        onChange={onChange}
        placeholder={intl.formatMessage({ id: "ADMIN.COMMON.TEXT.KEYWORD" })}
      />
    </TableHeadContainer>
  );
};

export default SearchQueries;
