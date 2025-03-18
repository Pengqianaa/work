import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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
} from "@mui/material";
import { ACTIONS } from "../../../Reducers/AutoApprovedReducer";

const AutoApprovedMgtEdit = ({ open, onClose, initialData }) => {
  const dispatch = useDispatch();

  // 初始化表單數據
  const [isAutoApproved, setIsAutoApproved] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  // 當 initialData 變化時，更新 isAutoApproved
  useEffect(() => {
    if (initialData) {
      setIsAutoApproved(initialData.isAutoApproved);
    }
  }, [initialData]);

  // 處理保存
  const handleSave = () => {
    if (initialData) {
      const id = initialData.id;
      dispatch({
        type: ACTIONS.SET_IS_AUTO_APPROVED,
        payload: { id, flag: isAutoApproved },
      });
      onClose(); // 保存後關閉對話框
    }
  };

  const autoApproveChange = async (event) => {
    const rpaOrgId = initialData.id;
    const flag = event.target.value
    if (flag) {
      // 使用 await 等待 dispatch 的结果
      try {
        // Await the result of CHECK_STATUS to handle errors properly
        const result = await new Promise((resolve, reject) => {
          dispatch({
            type: ACTIONS.CHECK_STATUS,
            payload: { rpaOrgId },
            resolve, reject
          });
        });
        // 假设 result 是一个布尔值，表示是否可以继续
        if (result.data) {
          setWarningOpen(true); // 显示警告对话框
        } else {
          setIsAutoApproved(event.target.value);
        }
      } catch (error) {
        // Handle the error thrown by CHECK_STATUS
        console.error("Error during CHECK_STATUS:", error);
        // Stop further execution
        return;
      }
    } else {
      setIsAutoApproved(flag);
    }
  }

  const warningClose = () => {
    setWarningOpen(false)
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Auto-approve Enabled</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="isAutoApproved-select-label">Auto-approve</InputLabel>
            <Select
              id="isAutoApproved-select"
              labelId="isAutoApproved-select-label"
              value={isAutoApproved}
              label="Auto-approve"
              name="isAutoApproved"
              onChange={autoApproveChange}
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={warningOpen} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Warning</DialogTitle>
        <DialogContent>
          You have pending forms (To Be Confirmed status).
          Please adjust and then modify the approval settings!
        </DialogContent>
        <DialogActions>
          <Button onClick={warningClose} color="secondary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AutoApprovedMgtEdit;