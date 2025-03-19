/* eslint-disable */
import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  Grid,
  FormControl,
  Autocomplete,
  TextField,
  FormHelperText,
} from "@mui/material";
import { Actions } from "../../../Common/constants";

const StockIdQueryMui = ({
  required = false,
  setInfo,
  error,
  message,
  keyword,
  setKeyword,
  suggestStockId,
  list,
  intl,
  clearStocIdList,
}) => {
  useEffect(() => {
    suggestStockId(keyword);
  }, [keyword]);

  const handleKeyUp = (e) => {
    setKeyword(e.target.value);
  };
  const onChange = (e, v) => {
    setInfo(v);
  };
  const onBlur = () => {
    clearStocIdList();
  };

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
            if (!option.stockId) {
              return option.stockId;
            }
            return option.stockId;
          }}
          onChange={onChange}
          onPaste={handleKeyUp}
          onInputChange={handleKeyUp}
          defaultValue={""}
          onBlur={onBlur}
          isOptionEqualToValue={(option, value) =>
            value === undefined || value === "" || option.id === value.id
          }
          renderInput={(params) => (
            <TextField
              {...params}
              error={error}
              value={keyword}
              variant="standard"
              label={intl.formatMessage({ id: "adminCommon.stockId" })}
              required={required}
            />
          )}
        />
        {error && message && <FormHelperText>{message}</FormHelperText>}
      </FormControl>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  list: state.softwareInfo.stockIdList,
});
const mapDispatchToProps = (dispatch) => ({
  suggestStockId: (keyword) =>
    dispatch({
      type: "suggestStockId",
      payload: keyword,
    }),
  clearStocIdList: () =>
    dispatch({
      type: Actions.SET_STOCK_ID_LIST,
      payload: [],
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StockIdQueryMui);
