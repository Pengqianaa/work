import React, { useEffect, useState } from "react";
import { connect, useSelector, useDispatch } from "react-redux";
import {
  Grid,
  InputLabel,
  Checkbox,
  MenuItem,
  FormGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Chip,
} from "@mui/material";
import UserQueryMui from "src/Components/AdminComponents/uiComponents/UserQueryMui";
import CostCenterQuery from "src/Components/admin/common/unit/CostCenterQuery";
import ModalContainer from "src/Components/AdminComponents/uiComponents/ModalContainer";
import {
  SelectorControl,
} from "src/Components/AdminComponents/uiComponents/FormControls";
import { FilterGroup } from "src/Components/AdminComponents/uiComponents/AdminCommonUis";
import { Buttons, BUTTON_TYPES } from "src/Components/common/index";
import "src/CSS/common.scss";
import styled from "styled-components";

const SelectedChip = styled(Chip)`
  margin-left: 4px;
`;


const ModifySWAuthorityModal = ({
  show,
  intl,
  item,
  toggleFunc,
  updateAuthority,
  getSWBg,
  getSWBu,
}) => {
  const { bgId, bgName, buList, costCenterCode ,roles ,permission } = item;
  const isBg = bgName !== null && bgName?.length > 1;
  const dispatch = useDispatch();
  const [mode, setMode] = useState(isBg ? "BG/BU" : "CostCenter");
  const [modeList, setModeList] = useState(["BG/BU","CostCenter"]);
  const [keyword, setKeyword] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [editModel, setEditModel] = useState(true);
  const [bg, setBg] = useState(bgId ?? []);
  const [bu, setBu] = useState(buList?.map((bu) => bu?.buId) ?? []);
  const [deleteBuArr, setDeleteBuArr] = useState([]);
  const [role, setRole] = useState(roles ?? []);
  const [swPermissionsList, setSwPermissionsList] = useState(permission ?? []);
  const [selCostCenter, setSelCostCenter] = useState(
    costCenterCode === null || costCenterCode === ""
      ? []
      : costCenterCode?.split(",")
  );
  const [lock, setLock] = useState(false);
  const [afterMerge, setAfterMerge] = useState([]);
  
  const [error, setError] = useState(false);

  const swBgList = useSelector((state) => state.swCollection.swBgList);
  const swBuList = useSelector((state) => state.swCollection.swBuList);
  const userFlag = useSelector((state) => state.SWReport.userFlag);
  const swCostCenterList = useSelector(
    (state) => state.swCollection.swCostCenterList
  );
  const swRolesList = useSelector((state) => state.swCollection.swRolesList);
  // const swPermissionsList = useSelector((state) => state.swCollection.swPermissions);

  useEffect(() => {
    getSWBg();
    // getSWBu(-1);
    setMode("BG/BU");
    setModeList(["BG/BU","CostCenter"])
    setKeyword("");
    setUserInfo({});
    setBu([]);
    setBg([]);
    setSelCostCenter([]);
    setLock(false);
    if (show) {
      if (item && Object.keys(item).length === 0) {
        setEditModel(false)
      } else {
        let {
          adAcount,
          username,
          roles,
          bgId,
          bgName,
          buList,
          costCenterCode,
          userId,
        } = item;
        setUserInfo({
          userId: userId,
          fullName: adAcount.trim() + " " + username,
          roles:roles
        });
        setKeyword(adAcount.trim());
        setLock(true);
        if (buList !== null) {
          setBu(
            buList.map((bu) => {
              return bu.buId;
            })
          );
        }
        setBg(bgId);
        getSWBu(bgId);
        setSelCostCenter(
          costCenterCode === null || costCenterCode === ""
            ? []
            : costCenterCode.split(",")
        );
        if (bgName !== null && bgName.length > 1) {
          setMode("BG/BU");
        } else {
          setMode("CostCenter");
        }
        setEditModel(true)
      }
    }
  }, [show]);

  // useEffect(() => {
  //    let roles = []
  //    if(Object.keys(userInfo)?.length > 0){
  //       if(Object.keys(userInfo)?.length === 3 ){
  //           roles = userInfo.roles
  //       }
  //       else{
  //           let rolesArr = userInfo.roles
  //           debugger
  //           roles = rolesArr.map((item)=>{
  //               return item.roleName
  //           })
  //       }
  //       setRole(roles)
  //   }
  // }, [userInfo]);

  useEffect(() => {
    let newArr = []
    newArr = swPermissionsList.map((el,index) => {
      // return `${el.bgEname}/${el.buEname}`
      return {  
        "buId": el.buId,  
        "buEname": el.buEname,
        "bgId": el.bgId,  
        "bgEname": el.bgEname,  
        "text": `${el.bgEname}/${el.buEname}` 
      }
    })
    let array = []
    if(costCenterCode){
      if (costCenterCode.length>0) {
        array = costCenterCode.split(",");
      }
    }
    const transformedArray = array.map((value, index) => {  
      return { buId:value, text:value };  
    });  
      
    // 输出: [  
    //   { buId: 1, costCenterCode: 'A' },  
    //   { buId: 2, costCenterCode: 'b' }  
    // ]
    newArr = newArr.concat(transformedArray) 
    setAfterMerge(newArr)
 }, [swPermissionsList]);

 const handleRoleChange = (event) => {
  let roleItem = event.target.value;
  setRole(roleItem)
};

  const handleBgChange = (event) => {
    let bgId = event.target.value.toString();
    setBg(bgId);
    setBu(afterMerge?.map((bu) => bu?.buId) ?? []);
    getSWBu(bgId);
  };

  function findBuById(buId, businessUnitsArray) {  
    // 遍历对象数组  
    for (let i = 0; i < businessUnitsArray.length; i++) {  
      // 检查当前对象的buId是否匹配传入的buId  
      if (businessUnitsArray[i].buId === Number(buId)) {  
        let newBu = businessUnitsArray[i]
        let addItem =  {  
          "buId": newBu.buId,  
          "buEname": newBu.buEname,
          "bgId": newBu.bgId,  
          "bgEname": newBu.bgShortName,  
          "text": `${newBu.bgShortName}/${newBu.buEname}` 
        }
        // 如果匹配，返回该对象  
        return addItem;  
      }  
    }  
    // 如果没有找到匹配的对象，返回null或undefined  
    return null;  
  }  

  const checkHandleChange = (value) => {
    let arr = JSON.parse(JSON.stringify(bu));
    if (value.target.checked) {
      arr.push(Number(value.target.id));
      let newArr = new Set(arr);
      arr = [...newArr];
      addBu(Number(value.target.id))
    } else {
      let newSet = new Set(arr);
      newSet.delete(Number(value.target.id));
      arr = [...newSet];
      deleteBu(Number(value.target.id))
    }
    setBu(arr);
  };

  const deleteTab = (array) =>{
      let deleteArr = []
      let afterArr = JSON.parse(JSON.stringify(afterMerge))
          // 找到要删除元素的索引  
      const index = afterArr.findIndex(item => item.buId === array.buId);  
    
      // 如果找到了索引，则使用splice方法删除它  
      if (index !== -1) {  
        afterArr.splice(index, 1);  
      }  
      deleteArr.push(array.buId)
      setAfterMerge(afterArr)
      // 刪除下面的選項
      // 先刪除BU
      let buCopy = JSON.parse(JSON.stringify(bu))
      const buIndex = buCopy.findIndex(item => item === array.buId);  
      if (buIndex !== -1) {  
          buCopy.splice(buIndex, 1);  
      }
      setBu(buCopy)  
      // 再刪除BUcostCenter
      let costCenterCopy = JSON.parse(JSON.stringify(selCostCenter))
      // const splitArray = costCenterCopy.split(','); // 使用split将字符串分割成数组  
        
      // 使用map方法将分割后的数组转换为对象数组  
      const outputArray = costCenterCopy.map(item => ({ costCenter: item.trim(),buId:item.trim() })); // 使用trim()去除可能的空白字符 
      const ccIndex = outputArray.findIndex(item2 => item2.buId === array.buId);  
      if (ccIndex !== -1) {  
        outputArray.splice(ccIndex, 1);  
      }
      // let str = outputArray.map(obj => obj.costCenter).join(',');
      const strings = outputArray.map(obj => String(obj.costCenter));
      setSelCostCenter(strings)
  }

  const deleteCostCenter = (el)=>{
    setSelCostCenter([
      ...selCostCenter.filter((e) => e !== el),
    ]);
    // 同時改變Permission
    let afterArr = JSON.parse(JSON.stringify(afterMerge))
    // 找到要删除元素的索引  
    const index = afterArr.findIndex(afterArrItem => afterArrItem.buId === el);  
  
    // 如果找到了索引，则使用splice方法删除它  
    if (index !== -1) {  
      afterArr.splice(index, 1);  
    }  
    setAfterMerge(afterArr)
  }
  const addBu = (el)=>{
    // 切換BG後帶出的BU
    let afterArr = JSON.parse(JSON.stringify(afterMerge))
    // 第一步：删除buId对应的对象  
    // 使用filter方法，返回buId不等于targetBuId的对象  
    afterArr = afterArr.filter(item => item.buId !== el);  
    let newBu = findBuById(el,swBuList)
    if(newBu){
      afterArr.unshift(newBu);
    }else{
      // 第二步：假设我们有一个新对象或者想要重新添加之前被删除的对象  
      let filteredArr = afterMerge.filter(bgbu => bgbu.buId === el);  
      // 第三步：将对象添加回数组  
      // 使用push方法将对象添加到数组的末尾  
      if(filteredArr.length > 0){
        afterArr.unshift(filteredArr); 
      } 
    }
    if(deleteBuArr.length > 0){
      afterArr.unshift(deleteBuArr); 
    } 
    setAfterMerge(afterArr)
  }
  const deleteBu = (el)=>{
    // 同時改變Permission
    let afterArr = JSON.parse(JSON.stringify(afterMerge))
    // 找到要删除元素的索引  
    const index = afterArr.findIndex(afterArrItem => afterArrItem.buId === el); 
    // 第一步：找到并保存要删除的对象
    let objToRemove = afterArr.find(obj => obj.buId === el);  
    setDeleteBuArr(objToRemove)
    // 第二步：从数组中删除该对象  
    // 使用filter方法  
    afterArr = afterArr.filter(obj => obj.buId !== el)
     setAfterMerge(afterArr)
  }

  const permissionCostCenterChange = (value) => {
    let afterArr = JSON.parse(JSON.stringify(afterMerge))
    afterArr.push({buId:value,text:value})
    setAfterMerge(afterArr)
  };

  const handleCostCenterChange = (value) => {
    let arr = JSON.parse(JSON.stringify(selCostCenter));
    if (value) {
      arr.push(value);
      let newArr = new Set(arr);
      arr = [...newArr];
    } else {
      let newSet = new Set(arr);
      newSet.delete(value);
      arr = [...newSet];
    }
    if(value){
      permissionCostCenterChange(value)
    }
    setSelCostCenter(arr);
  };

  const handleModelChange = (value) => {
    if(value==='BG/BU'&&!bg){
      setBg(0)
    }
    setMode(value.target.value);
  }
  
  // useEffect(()=>{
  //   if(keyword.split(" ").length>0){
  //     getRolesList(keyword.split(" ")[0])
  //   }
  // },[keyword])
  const deleteBuLengthThan6 = (buIds)=>{
    // 将字符串按逗号分割成数组  
    if(Array.isArray(buIds.buIdList)){
      let filtered = buIds.buIdList.filter(item => {return typeof item === 'string' ? item.length <= 6 : true});
      // 重新组合成字符串  
      let newBuIdList = filtered.join(',');  
      return newBuIdList
    }else{
      let buIdListArray = buIds.buIdList.split(',');  
        
      // 过滤出长度不大于6的元素  
      let filteredArray = buIdListArray.filter(item => item.length <= 6);  
        
      // 重新组合成字符串  
      let newBuIdList = filteredArray.join(',');  
      return newBuIdList
    }
  }

  const findRoleNameById = (role,swRolesList) =>{
    let roleId ;
    for(let i =0;i<swRolesList.length;i++){
      if(swRolesList[i].roleName === role || swRolesList[i].roleId === role){
        roleId = swRolesList[i].roleId 
      }
    }
    return roleId
  }

  const getParamArr = () =>{
    const isUserEmpty = !Object.keys(userInfo)?.length;
    if (isUserEmpty) {
      setError(true);
      return;
    }

    let params = !isUserEmpty
    ? {
        id: item.id,
        adAcount: keyword.split(" ")[0],
        bgId: bg ? bg.toString():'',
        buIdList: bu ? bu.toString():'',
        costCenterCode: selCostCenter ? selCostCenter.toString():'',
        username: userInfo.fullName,
        enable: true,
        userId: userInfo.userId,
        roleId:findRoleNameById(role[0]??role,swRolesList)
      }
    : {
        adAcount: userInfo.account,
        bgId: mode === "BG/BU" ? bg.toString() : "",
        buIdList: mode === "BG/BU" ? bu.toString() : "",
        costCenterCode: mode === "Costcenter" ? selCostCenter.toString() : "",
        username: userInfo.fullName,
        enable: true,
        userId: userInfo.userId,
        roleId:findRoleNameById(role[0]??role,swRolesList)
      };
      let arr = [];  
      // let buIds = deleteBuLengthThan6(params)
      // 使用reduce方法根据bgId分组 ，使用 afterMerge中的bg bu資料組成一個數組傳給後端
      const groupedByBgId = afterMerge.reduce((groups, item) => {  
       // 确保item有bgId，因為可能會存在costCenter資料  
      if (item.bgId !== undefined) {  
        // 如果bgId对应的组还不存在，则在groups中添加一个新的组  
        if (!groups[item.bgId]) {  
          groups[item.bgId] = [];  
        }  
        // 将当前元素添加到对应的组中  
        groups[item.bgId].push(item);  
        }  
        // 返回更新后的组  
        return groups;  
      }, {}); // 初始值是一个空对象  
      Object.keys(groupedByBgId).forEach(key => {
        let buIdString = groupedByBgId[key].map(item => item.buId).join(',')
        params.bgId = key
        params.buIdList = buIdString
        let newParams = JSON.parse(JSON.stringify(params))
        arr.push(newParams)
      });
      return arr
  }

  const handleSubmit = () => {
    updateAuthority(getParamArr());
    toggleFunc(false, true);
  };
  return (
    <ModalContainer
      open={show}
      setOpen={() => toggleFunc(false, false)}
      title="UpDate Authority"
      buttons={<Buttons type={BUTTON_TYPES.SAVE} onClick={handleSubmit} />}
    >
      
     <div style={{
                borderColor: '#ebebe1',
                borderStyle: 'solid',
                width: 590,
                backgroundColor: 'rgb(255, 255, 245)',
                padding:15
            }}>
      <UserQueryMui
        intl={intl}
        keyword={keyword}
        setKeyword={setKeyword}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        isLock={lock}
        error={error}
        required
      />
        {editModel ? (  
          <>  
            <div style={{ marginTop: 10 }}>  
              <InputLabel>Role:</InputLabel>  
            </div>  
            <FilterGroup style={{ maxWidth: "95%", flexWrap: "wrap" }}>  
              {role.map((el, index) => (  
                <SelectedChip  
                  key={index}  
                  size="small"  
                  label={el}  
                />  
              ))}  
            </FilterGroup>  
          </>  
        ) : (  
          <FilterGroup style={{ flexWrap: "wrap" }}>  
            <SelectorControl  
              label="Role"  
              value={role} 
              onChange={handleRoleChange}  
            >  
              {swRolesList.map((el, index) => (  
                <MenuItem key={index} value={el.roleId}>  
                  {el.roleName}  
                </MenuItem>  
              ))}  
            </SelectorControl>  
          </FilterGroup>  
            )}
          <div style={{marginTop:10}}><InputLabel>Permissions:</InputLabel></div>
          <FilterGroup style={{ maxWidth: "95%", flexWrap: "wrap" }}>
              {afterMerge.map((el,index) => {
                    return (
                      <SelectedChip
                        size="small"
                        key={index}
                        label={`${el.text}`}
                        onDelete={() => { deleteTab({buId:el.buId,costCenterCode:el.buId}) }}
                      />
                    );
                  })}
            </FilterGroup>
      </div>

      <SelectorControl
            label="Model"
            value={mode}
            onChange={handleModelChange}
          >
            {modeList.map((el,index) => {
              return (
                <MenuItem key={index} value={el.toString()}>
                  {el.toString()}
                </MenuItem>
              );
            })}
        </SelectorControl>
      {mode === "BG/BU" ? (
        <>
          <SelectorControl
            label="BG"
            value={bg?bg.toString():""}
            onChange={handleBgChange}
            disabled={editModel}
          >
            {swBgList.map((el) => {
              return (
                <MenuItem key={el.bgId} value={el.bgId.toString()}>
                  {el.bgShortName}
                </MenuItem>
              );
            })}
          </SelectorControl>
          <Grid item xs={12} md={12}>
            <FormControl variant="standard" style={{ width: "100%" }}>
              <FormLabel component="legend">BU(多選)</FormLabel>
              <FormGroup aria-label="position" row>
                {swBuList?.length > 0 &&
                  swBuList.map((el) => {
                    return (
                      <FormControlLabel
                        key={el.buId}
                        value={el.buId}
                        control={
                          <Checkbox
                            id={el.buId.toString()}
                            onChange={checkHandleChange}
                            checked={
                              bu.filter((e) => Number(e) === el.buId)
                                .length > 0
                            }
                          />
                        }
                        label={el.buShortName}
                      />
                    );
                  })}
              </FormGroup>
            </FormControl>
          </Grid>
        </>
      ) : (
        <Grid item xs={12} md={12}>
          <FormControl variant="standard" style={{ width: "100%" }}>
            <CostCenterQuery
              setInfo={handleCostCenterChange}
              intl={intl}
              userFlag={userFlag}
            />
            <FilterGroup
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                paddingBlock: "16px",
              }}
            >
              {selCostCenter?.includes("ALL") && (
                <SelectedChip
                  size="small"
                  style={{ margin: "4px" }}
                  label={intl.formatMessage({ id: `adminCommon.all` })}
                  onDelete={() => {
                    setSelCostCenter([]);
                  }}
                />
              )}
              {!selCostCenter?.includes("ALL") &&
                selCostCenter?.map((el) => {
                  if (!selCostCenter.includes(el)) {
                    return null;
                  }
                  return (
                    <SelectedChip
                      size="small"
                      key={el}
                      label={`${el}`}
                      style={{ margin: "4px" }}
                      onDelete={() =>deleteCostCenter(el)}
                    />
                  );
                })}
            </FilterGroup>
          </FormControl>
        </Grid>
      )}
    </ModalContainer>
  );
};

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
  updateAuthority: (paramArr) =>
    dispatch({
      type: "updateAuthority",
      payload:paramArr,
    }),
  getSWBg: () =>
    dispatch({
      type: "getSWBg",
      payload: { userFlag: "" },
    }),
  getSWBu: (bgId) =>
    dispatch({
      type: "getSWBu",
      payload: { bgId, userFlag: "" },
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModifySWAuthorityModal);
