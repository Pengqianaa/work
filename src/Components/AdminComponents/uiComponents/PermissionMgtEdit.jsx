import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  TextField,
} from "@mui/material";
import { ACTIONS } from "../../../Reducers/PermissionReducer";
import { ACTIONS as ViewActions } from "../../../Reducers/ViewReducer";

const PermissionMgtEdit = ({ open, onClose, onSave, isEdit, initialData }) => {
  const dispatch = useDispatch();
  // 從 Redux 獲取數據
  const roleList = useSelector((state) => state.permission.roleList); // 角色列表
  const findUser = useSelector((state) => state.permission.findUser); // 查找的用戶
  const orgName = useSelector((state) => state.view.orgNTenantOrg); // 當前組織名稱

  // 初始化表單數據
  const [formData, setFormData] = useState({
    userName: initialData?.userName || "",
    roleCode: initialData?.roleCode || "", // 單選：初始化為字符串
    userKey: initialData?.userKey || "", // 單選：初始化為字符串
  });
  const [disabledSave, setDisabledSave] = useState(true);
  const [errors, setErrors] = useState({
    userName: "",
    roleCode: "",
  });

  // 用於存儲 empCode 和 userName
  const [userInfo, setUserInfo] = useState({
    empCode: "",
    userName: "",
  });
    // 清空findUser
    useEffect(() => {
      dispatch({ type: ACTIONS.SET_PERMISSION_USER, payload: {}});
      setDisabledSave(false);
    }, []);

  // 當 findUser 更新時，自動設置 empCode 和 userName
  useEffect(() => {
    if (Object.keys(findUser).length>0) {
      setUserInfo({
        empCode: findUser.empCode || "",
        userName: findUser.userName || "",
      });
      setDisabledSave(false); // 如果有 findUser，啟用 Save 按鈕
    } else {
      setDisabledSave(true); // 如果沒有 findUser，禁用 Save 按鈕
    }
  }, [findUser]);

  const handleBlur = (event) => {
    const { name, value } = event.target;
    if (name === "userName" ) {
      dispatch({ type: ACTIONS.SET_PERMISSION_USER, payload: {}});
      dispatch({ type: ACTIONS.FINE_USER, payload: value });
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // 當打開對話框時，根據 isEdit 決定是否清空表單數據
  useEffect(() => {
    if (open) {
      if (isEdit && initialData) {
        // 編輯模式：填充初始數據
        setFormData({
          userName: initialData.userName || "",
          roleCode: initialData.roleCode || "",
        });
        dispatch({ type: ACTIONS.FINE_USER, payload: initialData.userName });
      } else {
        // 非編輯模式：清空表單數據
        setFormData({
          userName: "",
          roleCode: "",
        });
      }
      dispatch({ type: ACTIONS.SET_USER_KEY, payload: "" });
    }
  }, [open, isEdit, initialData]);

  // 處理輸入框變化
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // 處理角色選擇變化（單選）
  const handleRoleChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      roleCode: value, // 單選：直接設置為字符串
    }));
    setErrors((prev) => ({
      ...prev,
      roleCode: "",
    }));
  };

  // 處理保存
  const handleSave = async () => {
    const newErrors = {};
    // 校驗數據
    if (!isEdit && !formData.userName.trim()) {
      newErrors.userName = "Name is required.";
    }
    if (!formData.roleCode.trim()) {
      newErrors.roleCode = "Role is required.";
    }

    // 如果有錯誤，則不保存
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 檢查 findUser 是否存在
    if (!findUser) {
      dispatch({
        type: ViewActions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: "User information is not available. Please try again.",
            msgType: 4, // 錯誤提示
            autoHideDuration: null,
          },
        },
      });
      return;
    }
    // 構造保存數據
    try {
      const { empCode, userName } = userInfo;
      const data = await new Promise((resolve, reject) => {
        dispatch({
          type: ACTIONS.GET_USER_KEY,
          payload: { orgName, userCode: empCode, userAccount: userName },
          resolve, reject
        });
      });
      formData.userKey = data.data
    } catch (error) {
      // Handle the error thrown by CHECK_STATUS
      console.error("Error during GET_USER_KEY:", error);
      // Stop further execution
      return;
    }
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit Permission" : "Add Permission"}</DialogTitle>
      <DialogContent>
        {!isEdit && (
          <TextField
            label="Name"
            name="userName"
            fullWidth
            margin="normal"
            value={formData.userName}
            onBlur={handleBlur}
            onChange={handleInputChange}
            error={!!errors.userName}
            helperText={errors.userName || "Please enter the employee ID / account."}
            required
          />
        )}
        <FormControl fullWidth margin="normal" error={!!errors.roleCode}>
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            id="role-select"
            labelId="role-select-label"
            value={formData.roleCode || ""} // 確保值為字符串
            label="Role"
            name="roleCode"
            onChange={handleRoleChange}
          >
            {roleList.map((role, index) => (
              <MenuItem key={index} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
          {errors.roleCode && (
            <p style={{ color: "red", fontSize: "0.8rem", margin: "8px 0 0" }}>
              {errors.roleCode}
            </p>
          )}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={disabledSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PermissionMgtEdit;