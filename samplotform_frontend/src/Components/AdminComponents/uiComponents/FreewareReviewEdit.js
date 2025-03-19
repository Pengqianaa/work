import React, { useEffect, useState, useRef } from "react";
import { connect, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import {
  FormControlLabel,
  DialogContent,
  Grid,
  Switch,
  Checkbox,
  MenuItem,
} from "@mui/material";
import { SubmitButton, ItemInfo, Divider } from "./AdminCommonUis";
import { TextFieldControl, SelectorControl } from "./FormControls";
import ImageUpload from "./ImageUpload";
import ModalContainer from "./ModalContainer";
import {
  checkRequiredInputsAreEmptyOrNot,
  handleDataChange,
} from "src/Common/commonMethod";
import { SW_ASSET_INFO } from "src/Common/constants";
import { truncateText } from "./FreewareReviewTab";
import ApplyNameQuery from "./ApplyNameQuery";

const FreewareReviewEdit = ({
  show,
  toggle,
  intl,
  focusFreeware,
  brandList,
  freewareCategoryList,
  getFreewareCategoryList,
  getReasonList,
  onSave,
  queryParams,
  reasonList,
  page,
  rowsPerPage,
}) => {
  const [data, setData] = useState({
    ...focusFreeware,
    valid: focusFreeware.valid ?? false,
  });

  // 为 applyName 维护独立的状态
  const [namekeyword, setNamekeyword] = useState("");
  const [nameUserInfo, setNameUserInfo] = useState({});
  const [applyNameError, setApplyNameError] = useState(false);

  // 为 brand 维护独立的状态
  const [brandkeyword, setBrandkeyword] = useState("");
  const [brandUserInfo, setBrandUserInfo] = useState({});
  const [bandError, setBandError] = useState(false);
  const [applyTypeError, setApplyTypeError] = useState(false);
  // 提升 collectedValues 状态到父组件
  const [collectedValues, setCollectedValues] = useState({
    applyName: "",
    brand: "",
  });
  // 定义更新 collectedValues 的函数
  const updateCollectedValues = (name, value) => {
    setCollectedValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (focusFreeware.applyName) {
      updateCollectedValues("applyName", focusFreeware.applyName);
    }
    if (focusFreeware.applyBrand) {
      updateCollectedValues("brand", focusFreeware.applyBrand);
    }
  }, [focusFreeware]);
  const ERROR_MESSAGE = {
    applyName: false,
    listType: false,
    brand: false,
    applyBrand: false,
    installType: false,
    applyType: false,
    valid: false,
    reason: false,
    edition: false,
  };
  const [error, setError] = useState(ERROR_MESSAGE);
  const [filteredApplyTypes, setFilteredApplyTypes] = useState(
    SW_ASSET_INFO.INSTALL_APPLY
  );
  const locale = useSelector((state) => state.view.currentLocale);

  useEffect(() => {
    if (show && freewareCategoryList.length === 0) {
      getFreewareCategoryList();
    }
  }, [show, freewareCategoryList.length, getFreewareCategoryList]);

  useEffect(() => {
    if (data && data.installType) {
      let value = data.installType;
      // 根据 installType 过滤 applyType 选项
      const applicableApplyTypes = SW_ASSET_INFO.INSTALL_APPLY.filter((item) =>
        item.installType?.includes(parseInt(value, 10))
      ).flatMap((item) => item.applyType);

      // 转换为与 APPLY_TYPE 对应的对象数组
      const filteredOptions = SW_ASSET_INFO.APPLY_TYPE.filter((el) =>
        applicableApplyTypes?.includes(el.id)
      );
      setFilteredApplyTypes(filteredOptions);
    }
    if (data && data.listType) {
      let value = data.listType;
      getReasonList({ value, locale });
    }
  }, [data]);

  useEffect(() => {
    setData({
      ...data,
      name: namekeyword,
      applyName: namekeyword,
      brand: brandkeyword,
    });
  }, [namekeyword, brandkeyword]);

  // 監聽 listType 的變化，當 listType 改變時重置 reason 的錯誤狀態
  useEffect(() => {
    if (data?.listType !== 3 && data?.listType !== 4) {
      // 當 listType 不是 3 或 4 時，清空 reason 的值和錯誤狀態
      setData((prevData) => ({
        ...prevData,
        reason: null,
      }));
      setError((prevError) => ({
        ...prevError,
        reason: false,
      }));
    }
  }, [data?.listType]);

  const handleClickSave = () => {
    let hasError = false;
    const newError = { ...error };
    // 验证 applyName
    if (!collectedValues.applyName) {
      setApplyNameError(true);
    } else {
      setApplyNameError(false);
      newError.applyName = applyNameError;
    }
    // 验证 brand
    if (!collectedValues.brand) {
      setBandError(true);
    } else {
      setBandError(false);
      newError.brand = bandError;
      newError.applyBrand = bandError;
    }

    // 验证 listType
    if (!data.listType) {
      newError.listType = true;
      hasError = true;
    } else {
      newError.listType = false;
    }

    // 验证 installType
    if (!data.installType) {
      newError.installType = true;
      hasError = true;
    } else {
      newError.installType = false;
    }

    // 验证 applyType
    if (!data.applyType) {
      setApplyTypeError(true);
    } else {
      setApplyTypeError(false);
      newError.applyType = applyTypeError;
    }

    // 修改 valid 的驗證邏輯
    if (data?.listType === 1) {
      newError.valid = false;
    } else if (data?.valid !== true) {
      newError.valid = true;
      hasError = true;
    } else {
      newError.valid = false;
    }

    // 添加 reason 的驗證
    if (data.listType === 3 || data.listType === 4) {
      if (!data.reason) {
        newError.reason = true;
        hasError = true;
      } else {
        newError.reason = false;
      }
    }

    // 移除 edition 的驗證
    newError.edition = false;

    if (hasError) {
      setError(newError);
      return;
    }

    const params = {
      applyType: data?.applyType ?? null,
      assetId: null,
      brand:
        (typeof collectedValues?.brand === "string"
          ? brandList.find((item) => {
              return (
                item?.brandName?.toLowerCase() ===
                collectedValues?.brand?.toLowerCase()
              );
            })?.brandId
          : collectedValues?.brand) ?? 0,
      categoryList: data?.category ?? null,
      description: data?.desc ?? null,
      descriptionEN: data?.descEN ?? null,
      edition: data?.edition ?? " ",
      graph: data?.graph ?? null,
      installType: data?.installType ?? null,
      listType: data?.listType ?? null,
      reason: data?.reason ?? 0,
      remark: data?.remark ?? "",
      softwareName: collectedValues?.applyName ?? null,
      sourceURL: data?.sourceUrl ?? null,
      valid: data?.valid ?? false,
      version: data?.version ?? "",
      formId: data?.formId ?? null,
      page,
      rowsPerPage,
    };
    onSave(params, queryParams);
    toggle(false);
  };

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const newValue =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    if (fieldName === "valid") {
      setData((prevData) => ({
        ...prevData,
        valid: newValue,
      }));

      // 更新錯誤狀態
      const newError = { ...error };
      if (data?.listType === 1) {
        newError.valid = false; // listType 為 1 時，始終不顯示錯誤
      } else {
        newError.valid = !newValue; // 其他情況下，根據值來決定是否顯示錯誤
      }
      setError(newError);
    } else if (fieldName === "listType") {
      handleDataChange(e, setData);
      // 當 listType 改變時，更新錯誤狀態
      const newError = { ...error };
      if (newValue) {
        // 如果選擇了值，清除 listType 的錯誤
        newError.listType = false;
      }

      // 處理 valid 的錯誤狀態
      if (parseInt(newValue) === 1) {
        newError.valid = false;
      } else if (data?.valid !== true) {
        newError.valid = true;
      }

      // 處理 reason 的狀態
      if (newValue !== 3 && newValue !== 4) {
        setData((prevData) => ({
          ...prevData,
          reason: null,
        }));
        newError.reason = false;
      }

      setError(newError);
    } else {
      handleDataChange(e, setData);
      // 當字段改變時清除對應的錯誤狀態
      const newError = { ...error };
      if (newValue) {
        newError[fieldName] = false;
      }
      setError(newError);

      // 根据 installType 的值设置 applyType 的值
      if (fieldName === "installType") {
        const installTypeValue = parseInt(newValue, 10);
        setApplyTypeError(false);
        if (installTypeValue === 3) {
          setData((data) => ({
            ...data,
            applyType: 2,
          }));
        } else {
          setData((data) => ({
            ...data,
            applyType: 1,
          }));
        }
      }
    }
  };

  return (
    <ModalContainer
      open={show}
      setOpen={toggle}
      title={intl.formatMessage({ id: "swassetmgt.freewareTab.editTitle" })}
      buttons={
        <SubmitButton onClick={handleClickSave}>
          <FormattedMessage id="adminCommon.add" />
        </SubmitButton>
      }
    >
      <DialogContent scroll="paper">
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
        <Grid container spacing={2} style={{ marginTop: 0 }}>
          {/* ApplyNameQuery 独占一行 */}
          <Grid item xs={12}>
            <ApplyNameQuery
              name="applyName"
              intl={intl}
              brandList={brandList}
              defaultValue={focusFreeware.applyName}
              label={intl.formatMessage({ id: "swassetmgt.freewareTab.name" })}
              keyword={namekeyword}
              setKeyword={setNamekeyword}
              userInfo={nameUserInfo}
              setUserInfo={setNameUserInfo}
              isLock={false}
              setError={setApplyNameError}
              error={applyNameError}
              required
              collectedValues={collectedValues}
              updateCollectedValues={updateCollectedValues}
            />
          </Grid>
          <TextFieldControl
            name="edition"
            itemCount={2}
            id="outlined-multiline-static"
            label={intl.formatMessage({ id: "swassetmgt.freewareTab.edition" })}
            variant="standard"
            onChange={handleChange}
            value={data?.edition}
            error={error.edition}
          />
          <SelectorControl
            name="listType"
            required
            itemCount={2}
            error={error.listType}
            message={
              error.listType
                ? intl.formatMessage({
                    id: "freewarereview.errorMsg.listType",
                  })
                : ""
            }
            label={
              <span style={{ fontWeight: "800" }}>
                {intl.formatMessage({ id: "swassetmgt.freewareTab.listType" })}
              </span>
            }
            id="listType-select"
            value={data?.listType}
            onChange={handleChange}
          >
            {SW_ASSET_INFO.LIST_TYPE.map((el) => {
              return (
                <MenuItem key={el.id} value={el.id}>
                  {intl.formatMessage({
                    id: `swassetmgt.freewareTab.listType${el.id}`,
                  })}
                </MenuItem>
              );
            })}
          </SelectorControl>
          <TextFieldControl
            name="desc"
            itemCount={2}
            id="outlined-multiline-static"
            label={intl.formatMessage({ id: "swassetmgt.freewareTab.desc" })}
            multiline
            minRows={3}
            variant="outlined"
            onChange={handleChange}
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
            onChange={handleChange}
            value={data?.descEN}
            inputProps={{ maxLength: 500 }}
            helperText={`${data?.descEN ? data?.descEN?.length : 0}/${500}`}
          />
          {/* ApplyNameQuery for brand 独占一行 */}
          <Grid item xs={12}>
            <ApplyNameQuery
              name="brand"
              defaultValue={focusFreeware?.applyBrand}
              intl={intl}
              label={intl.formatMessage({ id: "swassetmgt.freewareTab.brand" })}
              keyword={brandkeyword}
              setKeyword={setBrandkeyword}
              userInfo={brandUserInfo}
              setUserInfo={setBrandUserInfo}
              isLock={false}
              brandList={brandList}
              setError={setBandError}
              error={bandError}
              required
              collectedValues={collectedValues}
              updateCollectedValues={updateCollectedValues}
            />
          </Grid>
          <Grid item xs={12}>
            {(data?.listType === 3 || data?.listType === 4) && (
              <SelectorControl
                name="reason"
                required
                error={error.reason}
                message={
                  error.reason
                    ? intl.formatMessage({
                        id: "freewarereview.errorMsg.reason",
                      })
                    : ""
                }
                label={
                  <span style={{ fontWeight: "800" }}>
                    {intl.formatMessage({
                      id: "swassetmgt.freewareTab.reason",
                    })}
                  </span>
                }
                id="reason-select"
                value={data?.reason || ""} // 確保值不為 null
                onChange={handleChange}
              >
                {reasonList.map((el, index) => {
                  return (
                    <MenuItem
                      key={index}
                      value={el.typeCause}
                      style={{
                        whiteSpace: "normal",
                        padding: "8px 16px",
                        maxWidth: 500,
                      }}
                    >
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
            message={
              error.installType
                ? intl.formatMessage({
                    id: "freewarereview.errorMsg.installType",
                  })
                : ""
            }
            label={
              <span style={{ fontWeight: "800" }}>
                {intl.formatMessage({
                  id: "swassetmgt.freewareTab.installType",
                })}
              </span>
            }
            id="installType-select"
            value={data?.installType}
            onChange={handleChange}
          >
            {SW_ASSET_INFO.INSTALL_TYPE.map((el, index) => {
              return (
                <MenuItem key={index} value={el.id}>
                  {intl.formatMessage({
                    id: `swassetmgt.freewareTab.installType${el.id}`,
                  })}
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
            error={applyTypeError}
            message={
              error.installType
                ? intl.formatMessage({
                    id: "freewarereview.errorMsg.applyType",
                  })
                : ""
            }
            id="applyType-select"
            value={data?.applyType}
            onChange={handleChange}
          >
            {filteredApplyTypes.map((el, index) => {
              return (
                <MenuItem key={index} value={el.id}>
                  {el.id === undefined
                    ? ""
                    : intl.formatMessage({
                        id: `swassetmgt.freewareTab.applyType${el.id}`,
                      })}
                </MenuItem>
              );
            })}
          </SelectorControl>
          <Grid item xs={6}>
            <div style={{ position: "relative" }}>
              <FormControlLabel
                name="valid"
                required={data?.listType !== 1} // 只在 listType 不為 1 時顯示必填標記
                checked={data?.valid === true}
                onChange={handleChange}
                control={<Switch color="primary" />}
                disabled={data?.listType === 1}
                label="is_valid"
                error={error.valid}
                labelPlacement="start"
              />
              {error.valid &&
                data?.listType !== 1 && ( // 只在 listType 不為 1 且有錯誤時顯示錯誤消息
                  <span
                    style={{
                      color: "#d32f2f",
                      fontSize: "0.75rem",
                      position: "absolute",
                      bottom: "-20px",
                      left: "0",
                    }}
                  >
                    {intl.formatMessage({
                      id: "freewarereview.errorMsg.valid",
                    })}
                  </span>
                )}
            </div>
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
            onChange={handleChange}
            value={data?.remark}
            inputProps={{ maxLength: 255 }}
            helperText={`${data?.remark?.length ?? 0}/${255}`}
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
            onChange={handleChange}
            renderValue={(selected) => `${selected.length} items selected`}
          >
            {freewareCategoryList.map((el, index) => {
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

// 截断文本的辅助函数

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
      <Grid item xs={8}>
        <ItemInfo>
          {`${intl.formatMessage({
            id: "swassetmgt.freewareTab.applyName",
          })} : ${truncateText(focusFreeware.applyName, 40)}`}
        </ItemInfo>
        <ItemInfo>
          {`${intl.formatMessage({
            id: "swassetmgt.freewareTab.version",
          })} : ${truncateText(focusFreeware.version, 40)}`}
        </ItemInfo>
        <ItemInfo>
          {`${intl.formatMessage({
            id: "swassetmgt.freewareTab.applyBrand",
          })} : ${truncateText(focusFreeware.applyBrand, 40)}`}
        </ItemInfo>
        <ItemInfo>
          {`${intl.formatMessage({
            id: "swassetmgt.freewareTab.sourceURL",
          })} : ${truncateText(focusFreeware.sourceUrl, 40)}`}
        </ItemInfo>
        <ItemInfo>
          {`${intl.formatMessage({
            id: "swassetmgt.freewareTab.applyReason",
          })} : ${truncateText(focusFreeware.applyReason, 40)}`}
        </ItemInfo>
        <ItemInfo>
          {`${intl.formatMessage({
            id: "swassetmgt.freewareTab.legalOpinion",
          })} : ${truncateText(focusFreeware.legalOpinion, 40)}`}
        </ItemInfo>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );
};
const mapStateToProps = (state) => ({
  freewareCategoryList: state.swAsset.freewareCategoryList,
  reasonList: state.swAsset.reasonList,
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
      payload,
    }),
});
export default connect(mapStateToProps, mapDispatchToProps)(FreewareReviewEdit);
