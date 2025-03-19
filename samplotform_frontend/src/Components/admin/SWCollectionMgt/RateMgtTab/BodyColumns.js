import { useSelector, useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import { TableRow, TableCell } from "@mui/material";
import { BUTTON_TYPES, Buttons } from "src/Components/common";
import { RateMgtCols } from "src/constants/admin/SWCollectionMgt";
import { ACTIONS } from "src/Reducers/admin/SWCollectionMgt/RateMgtReducer";
import { Actions } from "src/constants/common";

const COLUMNS = [...RateMgtCols];

const BodyColumns = ({ toggle }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const list = useSelector((state) => state.SWRateMgt.list);

  const setShowAlert = (props) =>
    dispatch({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props,
      },
    });

  const onDelete = (id) => {
    setShowAlert({
      title: intl.formatMessage({ id: `common.title` }),
      message: intl.formatMessage({ id: `adminCommon.deleteMsg` }),
      hasCancel: true,
      callback: () => {
        dispatch({
          type: ACTIONS.DELETE_RATE_MGT,
          payload: id,
        });
      },
    });
  };

  const onUpdate = (el) => {
    dispatch({
      type: ACTIONS.SET_MODIFIED_RATE_MGT,
      payload: el,
    });
    toggle(true);
  };

  return list?.map((el) => (
    <TableRow hover role="checkbox" tabIndex={-1} key={el.rateId}>
      {el.currentYear ? (
        <TableCell>
          <Buttons
            type={BUTTON_TYPES.DELETE}
            onClick={() => onDelete(el.rateId)}
          />
          <Buttons type={BUTTON_TYPES.EDIT} onClick={() => onUpdate(el)} />
        </TableCell>
      ) : (
        <TableCell />
      )}
      {COLUMNS.map((column) => (
        <TableCell key={`${column.id}-${el.rateId}`}>
          {column.viewCallback(el[column.id])}
        </TableCell>
      ))}
    </TableRow>
  ));
};

BodyColumns.propTypes = {
  toggle: PropTypes.func.isRequired,
};

export default BodyColumns;
