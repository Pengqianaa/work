/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  FormControl,
  Autocomplete,
  TextField,
  FormHelperText,
} from "@mui/material";
import { Actions } from "src/Common/constants";

const UserQueryMui = ({
  required = false,
  userInfo,
  setUserInfo,
  error,
  message,
  keyword,
  setKeyword,
  isLock,
  intl,
  labelId,
  excludeNonEmp,
}) => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.permission.adminUsers);

  const [focusUser, setFocusUser] = useState({});

  useEffect(() => {
    if (!userInfo || Object.keys(userInfo).length === 0) {
      setFocusUser({});
      setKeyword("");
    } else if (
      userInfo &&
      userInfo?.fullName?.length > 0 &&
      Object.keys(focusUser).length === 0 &&
      keyword.length === 0
    ) {
      setFocusUser(userInfo);
      setKeyword(userInfo.fullName);
    } else if (
      userInfo &&
      userInfo.fullName.length > 0 &&
      focusUser.fullName !== userInfo.fullName
    ) {
      setFocusUser(userInfo);
      setKeyword(userInfo.fullName);
    }
  }, [userInfo]);

  const handleQueryUser = (keyword) => {
    if (!keyword || keyword.length < 3) {
      clearList();
      return;
    }
    queryUser(keyword, !!excludeNonEmp);
  };
  const handleKeyUp = (e) => {
    if (isLock || !e) {
      return;
    }
    handleQueryUser(e.target.value);
  };
  const onChange = (e, v) => {
    console.log(v);
    setUserInfo(v);
  };

  const queryUser = (keyword, hasEmpCode) =>
    dispatch({
      type: "queryAdminUsers",
      payload: keyword,
      hasEmpCode,
    });
  const clearList = () =>
    dispatch({
      type: Actions.SET_ADMIN_USERS_LIST,
      payload: [],
    });
  return (
    <Grid item xs={12}>
      <FormControl
        variant="standard"
        error={error}
        required={required}
        style={{ width: "100%" }}
      >
        <Autocomplete
          size="small"
          disableClearable={true}
          options={list}
          getOptionLabel={(option) => {
            if (!option) {
              return "";
            }
            if (!option.fullName) {
              return option.account;
            }
            return option.fullName;
          }}
          isOptionEqualToValue={(option, value) =>
            value === undefined || value === "" || option.id === value.id
          }
          onChange={onChange}
          onInputChange={handleKeyUp}
          value={Object.keys(userInfo).length > 0 ? userInfo : ""}
          renderInput={(params) => (
            <TextField
              {...params}
              error={error}
              value={keyword}
              readOnly={isLock}
              variant="standard"
              label={intl.formatMessage({
                id: labelId ? labelId : "adminCommon.userId",
              })}
              required={required}
            />
          )}
        />
        {error && (
          <FormHelperText>
            {message ??
              intl.formatMessage({
                id: "adminCommon.errorMsg.user",
              })}
          </FormHelperText>
        )}
      </FormControl>
    </Grid>
  );
};

export default UserQueryMui;
