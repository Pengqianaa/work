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
import UserQueryMui from "./UserQueryMui";
import CostCenterQuery from "src/Components/admin/common/unit/CostCenterQuery";
import ModalContainer from "../uiComponents/ModalContainer";
import {
  SelectorControl,
} from "../uiComponents/FormControls";
import { FilterGroup } from "./AdminCommonUis";
import { Buttons, BUTTON_TYPES } from "../../common/index";
import "../../../CSS/common.scss";
import styled from "styled-components";
import { LATEST } from "src/constants/common";

const SelectedChip = styled(Chip)`
  margin-left: 4px;
`;


const EditSWAuthorityMgt = ({
  bgBuList,
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
  const [bg, setBg] = useState(bgName ?? []);
  const [bu, setBu] = useState(buList?.map((bu) => bu?.buEname) ?? []);
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
  const swCostCenterList = useSelector(
    (state) => state.swCollection.swCostCenterList
  );
  const swRolesList = useSelector((state) => state.swCollection.swRolesList);
  const bgNewList = useSelector((state) => state.costCenter.bgMap[LATEST] ?? []);
  const buNewList = useSelector((state) => state.costCenter.buMap[LATEST] ?? []);
  const userFlag = useSelector((state) => state.SWReport.userFlag);
  useEffect(() => {
    // getSWBg();
    // getSWBu(-1);
    setMode("BG/BU");
    setModeList(["BG/BU","CostCenter"])
    setKeyword("");
    setUserInfo({});
    setBu([]);
    setBg("");
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
              return bu.buEname;
            })
          );
        }
        setBg(bgName);
        // getSWBu(bgId);
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

  useEffect(() => {
    let newArr = []
    newArr = swPermissionsList.map((el,index) => {
      return {  
        "buName": el.buEname,  
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
      return { buName:value, text:value };  
    });  
    newArr = newArr.concat(transformedArray) 
    setAfterMerge(newArr)
 }, [swPermissionsList]);

 const handleRoleChange = (event) => {
  let roleItem = event.target.value;
  setRole(roleItem)
};

  const handleBgChange = (event) => {
    let bgName = event.target.value.toString();
    setBg(bgName);
    setBu(afterMerge?.map((bu) => bu?.buName) ?? []);
    // getSWBu(bgName);
  };

  function findBuByName(bgName,buName, businessUnitsArray) {  
    // 遍历对象数组  
    for (let i = 0; i < businessUnitsArray.length; i++) {  
      // 检查当前对象的buId是否匹配传入的buId  
      if (businessUnitsArray[i].buName === buName) {  
        let newBu = businessUnitsArray[i]
        let addItem =  {  
          "buName": newBu.buName,  
          "buEname": newBu.buName,
          "bgId": bgName,  
          "bgEname": bgName,  
          "text": `${bgName}/${newBu.buName}` 
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
      arr.push(value.target.id);
      let newArr = new Set(arr);
      arr = [...newArr];
      addBu(value.target.id)
    } else {
      let newSet = new Set(arr);
      newSet.delete(value.target.id);
      arr = [...newSet];
      deleteBu(value.target.id)
    }
    setBu(arr);
  };

  const deleteTab = (array) =>{
      let deleteArr = []
      let afterArr = JSON.parse(JSON.stringify(afterMerge))
          // 找到要删除元素的索引  
      const index = afterArr.findIndex(item => item.buName === array.buName);  
    
      // 如果找到了索引，则使用splice方法删除它  
      if (index !== -1) {  
        afterArr.splice(index, 1);  
      }  
      deleteArr.push(array.buName)
      setAfterMerge(afterArr)
      // 刪除下面的選項
      // 先刪除BU
      let buCopy = JSON.parse(JSON.stringify(bu))
      const buIndex = buCopy.findIndex(item => item === array.buName);  
      if (buIndex !== -1) {  
          buCopy.splice(buIndex, 1);  
      }
      setBu(buCopy)  
      // 再刪除BUcostCenter
      let costCenterCopy = JSON.parse(JSON.stringify(selCostCenter))
      // const splitArray = costCenterCopy.split(','); // 使用split将字符串分割成数组  
        
      // 使用map方法将分割后的数组转换为对象数组  
      const outputArray = costCenterCopy.map(item => ({ costCenter: item.trim(),buName:item.trim() })); // 使用trim()去除可能的空白字符 
      const ccIndex = outputArray.findIndex(item2 => item2.buName === array.buName);  
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
    const index = afterArr.findIndex(afterArrItem => afterArrItem.buName === el);  
  
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
    afterArr = afterArr.filter(item => item.buName !== el);  
    let newBu = findBuByName(bg,el,buNewList[bg])
    if(newBu){
      afterArr.unshift(newBu);
    }else{
      // 第二步：假设我们有一个新对象或者想要重新添加之前被删除的对象  
      let filteredArr = afterMerge.filter(bgbu => bgbu.buName === el);  
      // 第三步：将对象添加回数组  
      // 使用push方法将对象添加到数组的末尾  
      if(filteredArr.length > 0){
        afterArr.unshift(filteredArr); 
      } 
    }
    if(deleteBuArr && deleteBuArr.length > 0){
      afterArr.unshift(deleteBuArr); 
    }
    setAfterMerge(afterArr)
  }
  const deleteBu = (el)=>{
    // 同時改變Permission
    let afterArr = JSON.parse(JSON.stringify(afterMerge))
    // 找到要删除元素的索引  
    const index = afterArr.findIndex(afterArrItem => afterArrItem.buName === el); 
    // 第一步：找到并保存要删除的对象
    let objToRemove = afterArr.find(obj => obj.buName === el);  
    setDeleteBuArr(objToRemove)
    // 第二步：从数组中删除该对象  
    // 使用filter方法  
    afterArr = afterArr.filter(obj => obj.buName !== el)
     setAfterMerge(afterArr)
  }

  // 刪除 當年度不存在bu
    const deleteNotExistBu = (arr)=>{
      if(arr[0].buNameList){
        let buNameList = arr[0].buNameList.split(',').map(name => name.trim()).filter(name => name);  

        // 创建一个Set来存储所有有效的buName  
        let validNamesSet = new Set();  
      
        // 遍历buNewList[bg]，将所有buName添加到Set中  
        buNewList[bg].forEach(bu => {  
                validNamesSet.add(bu.buName);  
            });
      
        // 过滤buNameList，只保留也存在于validNamesSet中的元素  
        arr[0].buNameList = buNameList.filter(name => validNamesSet.has(name)).toString();  
      }
      return arr; 

  }

  const permissionCostCenterChange = (value) => {
    let afterArr = JSON.parse(JSON.stringify(afterMerge))
    afterArr.push({buName:value,text:value})
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
      setBg("")
    }
    setMode(value.target.value);
  }

  function checkLengths(str) {  
    // 使用split方法按逗号分隔字符串  
    var elements = str.split(',');  
  
    // 遍历数组中的每个元素  
    for (var i = 0; i < elements.length; i++) {  
        // 去除可能存在的空白字符（如果有的话）  
        var trimmedElement = elements[i].trim();  
  
        // 检查元素的长度  
        if (trimmedElement.length > 7) {  
            // 如果长度大于7，返回false  
            return false;  
        }  
    }  
  
    // 如果所有元素的长度都小于或等于7，返回true  
    return true;  
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

  const splitCostCenter = (originalArray) =>{
      let transformedArray = []
      if(originalArray.length > 0){
          // 提取原始的costCenterCode并创建一个新对象  
          let obj = originalArray[originalArray.length - 1]
          // 當只選costCenterCode時，要排除創建新對象
          // if(obj.bgNames.length > 0 && obj.buNameList.length > 0 && checkLengths(obj.buNameList)){
          if(obj.bgNames.length > 0 && obj.buNameList.length > 0){
            // 创建一个新数组来存储修改后的对象和新的对象  
                transformedArray = originalArray.map(item => ({  
                ...item, // 复制当前对象  
                costCenterCode: "" // 将costCenterCode置空  
            }));
          }  
          if(obj.costCenterCode){
            const newObject = {  
              "id": obj.id,
              "adAcount": obj.adAcount,  
              "bgNames": "",  
              "buNameList": "",  
              "costCenterCode": obj.costCenterCode,  
              "username": obj.username, 
              "enable": true,  
              "userId": obj.userId, 
              "roleId": obj.roleId,  
            };  
            // 将新对象添加到transformedArray中  
            transformedArray.push(newObject);  
      
      }  
    }
    return transformedArray;
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
        bgNames: bg ? bg.toString():'',
        buNameList: bu ? bu.toString():'',
        costCenterCode: selCostCenter ? selCostCenter.toString():'',
        username: userInfo.fullName,
        enable: true,
        userId: userInfo.userId,
        roleId:findRoleNameById(role[0]??role,swRolesList)
      }
    : {
        adAcount: userInfo.account,
        bgNames: mode === "BG/BU" ? bg.toString() : "",
        buNameList: mode === "BG/BU" ? bu.toString() : "",
        costCenterCode: mode === "Costcenter" ? selCostCenter.toString() : "",
        username: userInfo.fullName,
        enable: true,
        userId: userInfo.userId,
        roleId:findRoleNameById(role[0]??role,swRolesList)
      };
      let arr = [];  
      // let buIds = deleteBuLengthThan6(params)
      // 使用reduce方法根据bgId分组 ，使用 afterMerge中的bg bu資料組成一個數組傳給後端
      const groupedByBgName = afterMerge.reduce((groups, item) => {  
       // 确保item有bgId，因為可能會存在costCenter資料  
      if (item.bgEname !== undefined ) {  
        // 如果bgId对应的组还不存在，则在groups中添加一个新的组  
          if (!groups[item.bgEname]) {  
            groups[item.bgEname] = [];  
          }  
          if(item.bgEname === null ){
            groups["null"] = [];  
          }
          // 将当前元素添加到对应的组中  
          groups[item.bgEname].push(item);  
        }  
        // 返回更新后的组  
        return groups;  
      }, {}); // 初始值是一个空对象
      if(Object.keys(groupedByBgName).length === 0){
        // 沒有BgBu的情況下
        let newParams = JSON.parse(JSON.stringify(params))
        arr.push(newParams)
      }else{
        Object.keys(groupedByBgName).forEach(key => {
          let buNameString = groupedByBgName[key].map(item => item.buName).join(',')
          params.bgNames = key
          params.buNameList = buNameString
          let newParams = JSON.parse(JSON.stringify(params))
          arr.push(newParams)
        });
      }
      arr = splitCostCenter(arr)
      arr = deleteNotExistBu(arr)
      console.info(arr)
      return arr
  }

  const handleSubmit = () => {
    // getParamArr()
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
                        onDelete={() => { deleteTab({buName:el.buName,costCenterCode:el.buName}) }}
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
            // disabled={bg && editModel}
            disabled={ editModel }
          >
            {bgNewList.map((el) => {
              return (
                <MenuItem key={el.bgName} value={el.bgName}>
                  {el.bgName}
                </MenuItem>
              );
            })}
          </SelectorControl>
          <Grid item xs={12} md={12}>
            <FormControl variant="standard" style={{ width: "100%" }}>
              <FormLabel component="legend">BU(多選)</FormLabel>
              <FormGroup aria-label="position" row>
                {buNewList[bg]?.length > 0 &&
                  buNewList[bg].map((el) => {
                    return (
                      <FormControlLabel
                        key={el.buName}
                        value={el.buName}
                        control={
                          <Checkbox
                            id={el.buName}
                            onChange={checkHandleChange}
                            checked={
                              bu.filter((e) => e === el.buName)
                                .length > 0
                            }
                          />
                        }
                        label={el.buName}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditSWAuthorityMgt);
