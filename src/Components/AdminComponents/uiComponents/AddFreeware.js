import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";

import {
  FormControlLabel,
  DialogContent,
  InputLabel,
  Grid,
  FormHelperText,
  FormControl,
  Switch,
  Checkbox,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import {
  AddButton,
  FilterContainer,
  SubmitButton,
  AddBrandButton,
  ItemInfo,
  Divider,
} from "./AdminCommonUis";
import { TextFieldControl, SelectorControl } from "./FormControls";
import ImageUpload from "./ImageUpload";
import ModalContainer from "./ModalContainer";

import {
  checkRequiredInputsAreEmptyOrNot,
  handleDataChange,
} from "src/Common/commonMethod";
import {
  Actions,
  SW_ASSET_INFO,
  SW_ASSET_EDIT_INFO,
} from "src/Common/constants";

const AddFreeware = ({
  show,
  toggle,
  intl,
  focusFreeware,
  brandList,
  getBrandList,
  addFreewareBrand,
  reasonList,
  freewareCategoryList,
  getFreewareCategoryList,
  getReasonList,
  msg,
  setShowAlert,
  setMsg,
  handleSearch,
  addFreeware,
}) => {
  const [isAddBrand, setIsAddBrand] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [applyType, setApplyType] = useState("");
  const [data, setData] = useState(focusFreeware);

  const [error, setError] = useState(SW_ASSET_EDIT_INFO.ERROR_MESSAGE);
  const [newBrandError, setNewBrandError] = useState(false);
  const [filteredApplyTypes, setFilteredApplyTypes] = useState(SW_ASSET_INFO.INSTALL_APPLY);
  const isCreateNewFreeware = !focusFreeware.name;
  const locale = useSelector((state) => state.view.currentLocale);
  if (show && freewareCategoryList.length === 0) {
    getFreewareCategoryList();
  }

  useEffect(() => {
    if (data && data.installType) {
      let value = data.installType
      // 根据 installType 过滤 applyType 选项  
      const applicableApplyTypes = SW_ASSET_INFO.INSTALL_APPLY
        .filter(item => item.installType.includes(parseInt(value, 10)))
        .flatMap(item => item.applyType);
  
      // 转换为与 APPLY_TYPE 对应的对象数组  
      const filteredOptions = SW_ASSET_INFO.APPLY_TYPE.filter(el =>
        applicableApplyTypes.includes(el.id)
      );
      setFilteredApplyTypes(filteredOptions);
    }
    if(data && data.listType) {
      let value = data.listType
      getReasonList({value, locale})
    }
  }, [data]);
  
  const handleClickSave = () => {
    if (!data || checkRequiredInputsAreEmptyOrNot(data, setError)) {
      return;
    }
    addFreeware(data);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "newBrand") {
      setNewBrandError(false);
      setNewBrand(value);
    }
    else if (name === "installType") {
        if(value === 3 ){
          handleDataChange({ target: { value: 2, name: "applyType" }},setData)
        }else{
          handleDataChange({ target: { value: 1, name: "applyType" }},setData)
        }
        handleDataChange(e, setData);
    }
    else {
      if (name === "listType" && (value === 3 || value === 4)) {
        handleDataChange({ target: { value: false, name: "listType" } }, setData);
        getReasonList({value, locale})
        handleDataChange({ target: { value: '', name: "reason" } }, setData);
      }
      // if (name === "listType" && value === 4) {
      //   handleDataChange({ target: { value: false, name: "listType" } }, setData);
      //   getReasonList({value, locale})
      // }
      handleDataChange(e, setData);
    }
  };
  const handleAddBrand = (e) => {
    if (!newBrand) {
      setNewBrandError(true);
    } else {
      addFreewareBrand(newBrand);
    }
  };
  useEffect(() => {
    if (!msg) {
      return;
    }

    // TODO: 反饋 alert
    if (msg.flag === 1 && msg.data.code === 0) {
      toggle(false);
      handleSearch();
    }
    if (msg.flag === 2 && msg.data.code === 0) {
      getBrandList();
      handleChange({
        target: { value: msg.data.data.brandId, name: "brandId" },
      });
    }
    setMsg(null);
  }, [msg]);
  return (
    <ModalContainer
      open={show}
      setOpen={toggle}
      title={
        isCreateNewFreeware
          ? intl.formatMessage({ id: "swassetmgt.freewareTab.addTitle" })
          : intl.formatMessage({ id: "swassetmgt.freewareTab.editTitle" })
      }
      buttons={
        <SubmitButton onClick={handleClickSave}>
          <FormattedMessage id="adminCommon.save" />
        </SubmitButton>
      }
    >
      <DialogContent scroll="paper">
        {!isCreateNewFreeware ? (
          <UpdateItem
            fileName={data?.graph}
            focusFreeware={focusFreeware}
            intl={intl}
            show={show}
            setGraph={(graphName) =>
              handleChange({ target: { value: graphName, name: "graph" } })
            }
            refresh={show}
          />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div
                style={{
                  width: "140px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ImageUpload
                  fileName={data?.graph}
                  setFileName={(graphName) =>
                    handleChange({
                      target: { value: graphName, name: "graph" },
                    })
                  }
                  refresh={show}
                />
              </div>
            </Grid>
            <TextFieldControl
              name="name"
              itemCount={2}
              required
              onChange={(event) => handleChange(event)}
              value={data?.name}
              error={error.name}
              message={intl.formatMessage({
                id: "swassetmgt.freewareTab.requiredMsg",
              })}
              label={
                <span style={{ fontWeight: "bold" }}>
                  {intl.formatMessage({ id: "swassetmgt.freewareTab.name" })}
                </span>
              }
            />
            <TextFieldControl
              name="edition"
              itemCount={2}
              onChange={(event) => handleChange(event)}
              value={data?.edition}
              label={intl.formatMessage({
                id: "swassetmgt.freewareTab.edition",
              })}
            />
            <TextFieldControl
              name="version"
              itemCount={1}
              style={{ width: "50%" }}
              onChange={(event) => handleChange(event)}
              value={data?.version}
              label={intl.formatMessage({
                id: "swassetmgt.freewareTab.version",
              })}
            />
            <Grid item xs={6}>
              <FilterContainer
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FormControl
                  variant="standard"
                  error={error.brandId}
                  required
                  style={{ width: "100%" }}
                >
                  <InputLabel>
                    <span style={{ fontWeight: "800" }}>
                      {intl.formatMessage({
                        id: "swassetmgt.freewareTab.brand",
                      })}
                    </span>
                  </InputLabel>
                  <Select
                    variant="standard"
                    name="brandId"
                    disabled={brandList.length === 0}
                    id="brandId-select"
                    value={data?.brandId}
                    onChange={(event) => handleChange(event)}
                  >
                    {brandList.map((el,index) => {
                      return (
                        <MenuItem key={index} value={el.brandId}>
                          {el.sourceNumber}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>
                    {error.brandId ? "can't be empty" : ""}
                  </FormHelperText>
                </FormControl>
                <AddBrandButton onClick={() => setIsAddBrand(!isAddBrand)}>
                  <AddIcon style={{ color: "#69b969" }} />
                </AddBrandButton>
              </FilterContainer>
            </Grid>
            <Grid item xs={6}>
              {isAddBrand && (
                <div style={{ display: "flex", alignItems: " baseline" }}>
                  <TextField
                    variant="standard"
                    name="newBrand"
                    error={newBrandError}
                    onChange={(event) => handleChange(event)}
                    label={intl.formatMessage({
                      id: "swassetmgt.freewareTab.brand",
                    })}
                    helperText={newBrandError && "can't be empty"}
                  />
                  <AddButton
                    style={{ marginLeft: "5px" }}
                    onClick={handleAddBrand}
                  >
                    <FormattedMessage id="adminCommon.add" />
                  </AddButton>
                </div>
              )}
            </Grid>
          </Grid>
        )}
        <Grid container spacing={2} style={{ marginTop: 0 }}>
          <TextFieldControl
            name="desc"
            itemCount={2}
            id="outlined-multiline-static"
            label={intl.formatMessage({ id: "swassetmgt.freewareTab.desc" })}
            multiline
            minRows={3}
            variant="outlined"
            onChange={(event) => handleChange(event)}
            value={data?.desc}
            inputProps={{ maxLength: 500 }}
            helperText={`${data?.desc ? data?.desc?.length : 0}/${500}`}
          />
          <TextFieldControl
            name="descEN"
            itemCount={2}
            id="outlined-multiline-static"
            label={intl.formatMessage({
              id: "swassetmgt.freewareTab.descEn",
            })}
            multiline
            minRows={3}
            variant="outlined"
            onChange={(event) => handleChange(event)}
            value={data?.descEN}
            inputProps={{ maxLength: 500 }}
            helperText={`${data?.descEN ? data?.descEN?.length : 0}/${500}`}
          />
          <TextFieldControl
            name="sourceURL"
            itemCount={1}
            style={{ width: "50%" }}
            onChange={(event) => handleChange(event)}
            value={data?.sourceURL}
            label={intl.formatMessage({
              id: "swassetmgt.freewareTab.sourceURL",
            })}
          />
          <SelectorControl
            name="listType"
            required
            itemCount={2}
            error={error.listType}
            label={
              <span style={{ fontWeight: "800" }}>
                {intl.formatMessage({ id: "swassetmgt.freewareTab.listType" })}
              </span>
            }
            id="listType-select"
            value={data?.listType}
            onChange={(event) => handleChange(event)}
          >
            {SW_ASSET_INFO.LIST_TYPE.map((el) => {
              return (
                <MenuItem key={el.id} value={el.id}>
                  {intl.formatMessage({ id: `swassetmgt.freewareTab.listType${el.id}` })}
                </MenuItem>
              );
            })}
          </SelectorControl>
          <Grid item xs={12}>
            {data?.listType === 3 && (
              <SelectorControl
                name="reason"
                label={intl.formatMessage({
                  id: "swassetmgt.freewareTab.reason",
                })}
                id="reason-select"
                value={data?.reason}
                onChange={(event) => handleChange(event)}
              >
                {reasonList.map((el, index) => {
                  return (
                    <MenuItem key={index+el} value={el.typeCause} style={{ whiteSpace: 'normal', padding: '8px 16px', maxWidth: 500 }}>
                       { el.reason }
                    </MenuItem>
                  );
                })}
              </SelectorControl>
            )}
            {data?.listType === 4 && (
              <SelectorControl
                name="reason"
                label={intl.formatMessage({
                  id: "swassetmgt.freewareTab.reason",
                })}
                id="reason-select"
                value={data?.reason}
                onChange={(event) => handleChange(event)}
              >
                {reasonList.map((el, index) => {
                  return (
                    <MenuItem key={index} value={el.typeCause} style={{ whiteSpace: 'normal', padding: '8px 16px', maxWidth: 500 }}>
                      {el.reason}
                    </MenuItem>
                  );
                })}
              </SelectorControl>
            )}
          </Grid>
          <SelectorControl
            name="installType"
            required
            itemCount={2}
            error={error.installType}
            label={
              <span style={{ fontWeight: "800" }}>
                {intl.formatMessage({
                  id: "swassetmgt.freewareTab.installType",
                })}
              </span>
            }
            id="installType-select"
            value={data?.installType}
            onChange={(event) => handleChange(event)}
          >
            {SW_ASSET_INFO.INSTALL_TYPE.map((el,index) => {
              return (
                <MenuItem key={index} value={el.id}>
                  {intl.formatMessage({ id: `swassetmgt.freewareTab.installType${el.id}` })}
                </MenuItem>
              );
            })}
          </SelectorControl>
          <SelectorControl
            name="applyType"
            required
            itemCount={2}
            label={
              <span style={{ fontWeight: "800" }}>
                {intl.formatMessage({ id: "swassetmgt.freewareTab.applyType" })}
              </span>
            }
            error={error.applyType}
            id="applyType-select"
            value={data?.applyType}
            onChange={(event) => handleChange(event)}
          >
            {/* {SW_ASSET_INFO.APPLY_TYPE.map((el) => {
              return (
                <MenuItem key={el.id} value={el.id}>
                  {el.value}
                </MenuItem>
              );
            })} */}
            {filteredApplyTypes.map((el,index) => {
              return (
                <MenuItem key={index} value={el.id}>
                   {el.id===undefined?"":intl.formatMessage({ id: `swassetmgt.freewareTab.applyType${el.id}` })}
                </MenuItem>
              );
            })}
          </SelectorControl>
          <Grid item xs={6}>
            <FormControlLabel
              name="valid"
              required
              checked={data?.valid}
              onChange={(event) => handleChange(event)}
              control={<Switch color="primary" />}
              disabled={data?.listType === 1}
              label="is_valid"
              labelPlacement="start"
            />
          </Grid>
          <TextFieldControl
            name="remark"
            itemCount={2}
            id="outlined-multiline-static"
            label={intl.formatMessage({
              id: "swassetmgt.freewareTab.remark",
            })}
            multiline
            minRows={3}
            variant="outlined"
            onChange={(event) => handleChange(event)}
            value={data?.remark}
            inputProps={{ maxLength: 255 }}
            helperText={`${data?.remark?.length}/${255}`}
          />
          <SelectorControl
            name="category"
            label={intl.formatMessage({
              id: "swassetmgt.freewareTab.categoryList",
            })}
            multiple
            disabled={freewareCategoryList === 0}
            style={{ width: "50%" }}
            id="category-select"
            value={data?.category ?? []}
            onChange={(event) => handleChange(event)}
            renderValue={(selected) => `${selected.length} items selected`}
          >
            {freewareCategoryList.map((el,index) => {
              return (
                <MenuItem key={index} value={el.id}>
                  <Checkbox
                    style={{ color: "#0087DC" }}
                    checked={
                      data?.category?.filter((e) => e === el.id).length > 0
                    }
                  />
                  {el.categoryNameTC}
                </MenuItem>
              );
            })}
          </SelectorControl>
        </Grid>
      </DialogContent>
    </ModalContainer>
  );
};

const UpdateItem = (props) => {
  const { fileName, focusFreeware, intl, show, setGraph } = props;
  return (
    <Grid container spacing={4} style={{ alignItems: "center" }}>
      <Grid item xs={4}>
        <ImageUpload
          fileName={fileName}
          setFileName={setGraph}
          refresh={show}
        ></ImageUpload>
      </Grid>
      <Grid item xs={5}>
        <ItemInfo>
          {`${intl.formatMessage({
            id: "swassetmgt.freewareTab.freewareCode",
          })} : ${focusFreeware.freewareCode}`}
        </ItemInfo>
        <ItemInfo>
          {`${intl.formatMessage({ id: "swassetmgt.freewareTab.name" })} : ${focusFreeware.name
            }`}
        </ItemInfo>
        <ItemInfo>
          {`${intl.formatMessage({ id: "swassetmgt.freewareTab.edition" })} : ${focusFreeware.edition
            }`}
        </ItemInfo>
        <ItemInfo>
          {`${intl.formatMessage({ id: "swassetmgt.freewareTab.version" })} : ${focusFreeware.version
            }`}
        </ItemInfo>
      </Grid>
      <Grid item xs={3}>
        <ItemInfo>
          {`${intl.formatMessage({ id: "swassetmgt.freewareTab.brand" })} : ${focusFreeware.brand
            }`}
        </ItemInfo>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );
};
const mapStateToProps = (state) => ({
  msg: state.swAsset.msg,
  freewareCategoryList: state.swAsset.freewareCategoryList,
  reasonList:state.swAsset.reasonList,
});

const mapDispatchToProps = (dispatch) => ({
  addFreewareBrand: (brandName) =>
    dispatch({
      type: "addFreewareBrand",
      payload: { brandName },
    }),
  getFreewareCategoryList: () =>
    dispatch({
      type: "getFreewareCategoryList",
    }),
  getReasonList: (payload) =>
    dispatch({
      type: "getReasonList",
      payload
    }),
  setShowAlert: (props) =>
    dispatch({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props,
      },
    }),
  setMsg: (msg) =>
    dispatch({
      type: "setMsg",
      payload: { msg },
    }),
  addFreeware: (payload) => dispatch({ type: "addFreeware", payload }),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddFreeware);
