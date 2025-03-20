import { useSelector, connect, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { TableRow, TableCell ,Popover } from "@mui/material";
import { QueryOrDownloadCols } from "src/constants/admin/SWCollection";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useIntl } from "react-intl";
import { Actions} from "../../../../Common/constants";
import { ACTIONS } from "src/Reducers/admin/SWCollection/SWReportReducer";
import SWReportSubTable from "src/Components/admin/SWCollection/SWCollectorReport/SWReportSubTable"
import Button from '@mui/material/Button'

const COLUMNS = [...QueryOrDownloadCols];

const BodyColumns = (props) => {
  const {
    setShowAlert,
    setEditTarget,
    setOpenEdit
  } = props;
  const dispatch = useDispatch();
  const  list  = useSelector((state) => state.SWReport.queryOrDownloadList);

  const intl = useIntl();

  const handleDelete = (item)=>{
    setShowAlert({
      title: intl.formatMessage({ id: `common.title` }),
      message: intl.formatMessage({ id: `adminCommon.deleteMsg` }),
      hasCancel: true,
      callback: () => {
        dispatch({
          type: ACTIONS.DELETE_QUERY_OR_DOWNLOAD,
          payload: { ...item },
        });
      },
    });
  }

  const InstalledQtyToolTip = props => {
    const { installedQty } = props
    const detailList = useSelector((state) => state.SWReport.reportDetailList);
    return <div style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div><SWReportSubTable item={installedQty} detailList={detailList}/></div>
      </div>
    </div>
  }

  const handleEdit = (item)=>{
    setEditTarget(item);
    setOpenEdit(true);
  }

  const RowWithTooltip = ({ item, index }) => { 
    // 为每行创建一个独立的open状态  
    const [showTooltip, setShowTooltip] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
      dispatch({
        type: ACTIONS.GET_SW_REPORT_DETAIL_LIST,
        payload: {
          bgId:item.bgId,brandId:item.brandId,buId:item.buId,costCenter:item.costCenter,
          planId:item.planId,productName:item.productName,
          swCollectionNewSWId:item.newId,assetId:item.assetId
        },
      });
      setAnchorEl(event.currentTarget);
      setShowTooltip(true) 
    };

    const handleClose = () => {  
      // 只需要设置showTooltip为false，而不需要在这里调用setShowTooltip(!showTooltip)  
      setShowTooltip(false);  
    };  


    const id = showTooltip ? 'simple-popover' : undefined;
    return (  
      <TableRow hover tabIndex={-1} key={index+"in"}>
            <TableCell style={{ minWidth: "65px" }}>
             {!item.lock && (  
                <>  
                  <DeleteIcon  
                    onClick={() => {  
                      handleDelete(item);  
                    }}  
                    style={{ color: "#FF5252" }}  
                  />  
                  <EditIcon  
                    onClick={() => {  
                      handleEdit(item);  
                    }}  
                    style={{ color: "rgb(76, 175, 80)" }}  
                  />  
                </>  
              )}  
              </TableCell>
            {COLUMNS.map((column,index2) => {
              if(column.id === 'installedQty'){
                return (
                  <TableCell key={index2+"in"}>
                    <Popover 
                      id={id}
                      open={showTooltip}
                      // title={<InstalledQtyToolTip installedQty={column.viewCallback} interactive detailList={detailList}/>}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      >
                      <InstalledQtyToolTip installedQty={column.viewCallback} interactive/>
                     </Popover>
                     <Button onClick={handleClick} variant="contained" size="small" 
                          style={{ color: '#67C3D0',background: 'none',boxShadow:'none',textDecoration:'underline'}}> {item.installedQty}</Button>

                  </TableCell>
                )
              }else{
                return (
                  <TableCell key={index2+"in2"}>
                    {column.viewCallback(item[column.id])}
                  </TableCell>
                );
              }
            })}
        </TableRow>
    );  
  };  

  return (
    <>
      {list?.map((item , index) => {
        return (
          <RowWithTooltip key={index} item={item} />
        );
      })}
    </>
  );
};

const mapStateToProps = (state) => ({
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
