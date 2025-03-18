import { useSelector, useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import { TableRow, TableCell } from "@mui/material";
import { BUTTON_TYPES, Buttons } from "src/Components/common";
import { ACTIONS } from "src/Reducers/admin/AuthorizationMgtReducer";
import { AuthorizationMgtCols } from "src/constants/admin/AuthorizationMgt";
import { Actions } from "src/constants/common";

const COLUMNS = [...AuthorizationMgtCols];

const BodyColumns = ({ toggle }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const list = useSelector((state) => state.authorizationMgt.list);

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
          type: ACTIONS.DELETE_AUTHORIZATION_MGT,
          payload: id,
        });
      },
    });
  };

  const onUpdate = (el) => {
    const { userId, name, areas, bus, costCenters, brands } = el;

    const payload = {
      userId,
      name,
      areaIds: areas.map((area) => area.id),
      buIds: bus.map((area) => area.id),
      costCenters: costCenters.map((c) => c.costDeptCode),
      brandIds: brands.map((bu) => bu.id),
    };

    dispatch({
      type: ACTIONS.SET_MODIFIED_AUTHORIZATION_MGT,
      payload,
    });
    toggle(true);
  };

  return list?.map((el) => (
    <TableRow hover role="checkbox" tabIndex={-1} key={el.userId}>
      <TableCell>
        <Buttons
          type={BUTTON_TYPES.DELETE}
          onClick={() => onDelete(el.userId)}
        />
        <Buttons type={BUTTON_TYPES.EDIT} onClick={() => onUpdate(el)} />
      </TableCell>
      {COLUMNS.map((column) => (
        <TableCell key={`${column.id}-${el.userId}`}>
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
