import { useSelector, connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { TableRow, TableCell ,TableBody } from "@mui/material";
import { AuthorityMgtCols } from "src/constants/admin/SWCollectionMgt";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditSWAuthorityMgt from "../../../AdminComponents/uiComponents/EditSWAuthorityMgt2";
import { useIntl } from "react-intl";
import { Actions} from "../../../../Common/constants";

const COLUMNS = [...AuthorityMgtCols];

const BodyColumns = (props) => {
  const {
    deleteAuthorityById,
    setShowAlert,
    swAuthriyUpdateMsg
  } = props;

  const [openEdit, setOpenEdit] = useState(false);
  const [editTarget, setEditTarget] = useState({});

  const swAuthorityMgtList = useSelector(
    (state) => state.swCollection.swAuthorityMgtList
  );
  const intl = useIntl();

  const handleDelete = (item)=>{
    setShowAlert({
      title: intl.formatMessage({ id: `common.title` }),
      message: intl.formatMessage({ id: `adminCommon.deleteMsg` }),
      hasCancel: true,
      callback: () => {
         deleteAuthorityById(item.id);
      },
    });
  }

  const handleEdit = (item)=>{
    setEditTarget(item);
    setOpenEdit(true);
  }
  
  return (
    <>
      {swAuthorityMgtList?.map((el, index) => {
        return (
        <TableRow hover tabIndex={-1} key={index+"in"}>
            <TableCell style={{ minWidth: "65px" }}>
              <DeleteIcon
                  onClick={() => {
                    handleDelete(el);
                  }}
                  style={{ color: "#FF5252" }}
              />
              <EditIcon
                  onClick={() => {
                    handleEdit(el);
                  }}
                  style={{ color: "rgb(76, 175, 80)" }}
                  />
              </TableCell>
              {COLUMNS.map((column) => {
                return (
                  <TableCell key={column.id}>
                    {column.viewCallback(el[column.id])}
                  </TableCell>
                );
              })}
          </TableRow>
        );
      })}
      <EditSWAuthorityMgt
        key={openEdit}
        show={openEdit}
        intl={intl}
        item={editTarget}
        toggleFunc={setOpenEdit}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  swAuthriyUpdateMsg: state.swCollection.swAuthriyUpdateMsg,
});
const mapDispatchToProps = (dispatch) => ({
  deleteAuthorityById: (id) =>
    dispatch({
      type: "deleteAuthorityById",
      payload: { id },
    }),
  setShowAlert: (props) =>
    dispatch({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props,
      },
    }),
});

export default connect(mapStateToProps,mapDispatchToProps)(BodyColumns);
