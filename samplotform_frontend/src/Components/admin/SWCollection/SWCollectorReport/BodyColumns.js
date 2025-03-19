import { useSelector, useDispatch  } from "react-redux";
import React, { useEffect, useState,forwardRef, useImperativeHandle,useRef } from "react";
import { TableRow, TableCell, Popover } from "@mui/material";
import { QueryOrDownloadCols } from "src/constants/admin/SWCollection";
import SWReportSubTable from "src/Components/admin/SWCollection/SWCollectorReport/SWReportSubTable"
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import { ACTIONS } from "src/Reducers/admin/SWCollection/SWReportReducer";

const COLUMNS = [...QueryOrDownloadCols];
const BodyColumns = forwardRef((props, ref) => {
  const { checkAll ,setCheckAll } = props;
  const list = useSelector((state) => state.SWReport.reportList);
  const dispatch = useDispatch();
  const [hadCheck, setHadCheck] = useState(false); // 用於判斷有沒有勾選，防止出現不勾選點lock會清空已勾選的
  const [checkedItems, setCheckedItems] = useState([]); // 存储被选中的项
  const [lockList, setLockList] = useState([]); // 存储被选中的项 
  const [unLockList, setUnLockList] = useState([]); // 存储被选中的项 

    // 处理全选或全取消  
    useImperativeHandle(ref, () => ({   
      handleSelectAll: (checkAll) => {  
        let arr = []; // 使用扩展运算符进行浅拷贝  
        let unArr = [];  
        let newCheckedItems = [];  
        if (checkAll) {  
          // 全选，将所有项添加到checkedItems中  
          newCheckedItems = list  
        }  
        // 更新checkedItems和isAllChecked状态  
        setCheckedItems(newCheckedItems); 
        list.forEach(item => {
          if(checkAll){
            arr.push(item.swCollectionId)
            unArr = unArr.filter(arrItem => arrItem !== item.swCollectionId)
          }else{
            unArr.push(item.swCollectionId)
            arr = arr.filter(arrItem => arrItem !== item.swCollectionId)
          }
          setLockList(arr)
          setUnLockList(unArr)
        });
        setCheckAll(checkAll); 
        dispatch({ type: "SET_LOCK_PARAMS", payload: {lockList:arr, unLockList:unArr}}); 
      },  
    }));  

    useEffect(() => {  
      // 假设我们只想选中lock为true的项作为初始状态  
      const initialChecked = list.filter(item => item.lock); 
      setCheckedItems(initialChecked)

      let arr = []; // 使用扩展运算符进行浅拷贝  
      let unArr = [];  
      list.forEach(item => {
        if(item.lock){
          arr.push(item.swCollectionId)
          unArr = unArr.filter(arrItem => arrItem !== item.swCollectionId)
        }else{
          unArr.push(item.swCollectionId)
          arr = arr.filter(arrItem => arrItem !== item.swCollectionId)
        }
        setLockList(arr)
        setUnLockList(unArr)
      });
    }, [list]);

    useEffect(() => { 
      if(hadCheck){
        dispatch({
          type: ACTIONS.SET_LOCK_PARAMS,
          payload: {lockList,unLockList},
        });
      }
    }, [lockList,unLockList]); 

    const lockChange =  (item,isCheck) => {
      setHadCheck(true)
      let arr = [...lockList]; // 使用扩展运算符进行浅拷贝  
      let unArr = [...unLockList]; 
      if(isCheck){
        arr.push(item.swCollectionId)
        unArr = unArr.filter(arrItem => arrItem !== item.swCollectionId)
      }else{
        unArr.push(item.swCollectionId)
        arr = arr.filter(arrItem => arrItem !== item.swCollectionId)
      }
      setLockList(arr)
      setUnLockList(unArr)
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

  // 处理单个CheckBox的变化  
  const handleItemCheckChange = (item, checked) => {  
    let newCheckedItems = [...checkedItems]; // 创建一个当前checkedItems的副本  
    if (checked) {  
      // 如果单个被选中，则添加该ID到checkedItems  
      newCheckedItems.push(item);  
      setCheckAll(newCheckedItems.length === list.length); // 如果所有项都被选中，则全选  
    } else {  
      // 如果单个被取消选中，则从checkedItems中移除该ID  
      newCheckedItems = newCheckedItems.filter(newItem => newItem.swCollectionId !== item.swCollectionId);  
      // setCheckAll(newCheckedItems.length > 0); // 如果还有被选中的项，则不全选；否则全选为false  
    }  
    // 更新checkedItems状态  
    setCheckedItems(newCheckedItems); 
    lockChange(item,checked)
  }; 

    // 创建一个函数来返回一个新的组件，该组件封装了一个TableRow和它的Tooltip状态  
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
            <TableCell style={{ minWidth: 65,paddingLeft:30 }}>
            <Checkbox color="primary" 
              checked={checkedItems.some(checkedItem => checkedItem.swCollectionId === item.swCollectionId)} 
              onChange={(event) => handleItemCheckChange(item, event.target.checked)} 
              inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />
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
})

export default BodyColumns;
