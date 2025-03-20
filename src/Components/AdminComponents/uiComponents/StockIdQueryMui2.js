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
  value,
  inputValue,
  setValue,
  setInputValue,
  error,
  message,
  suggestStockId,
  list,
  intl,
  clearStocIdList,
}) => {
  // Trigger suggestion when the inputValue changes
  useEffect(() => {
    if (inputValue) suggestStockId(inputValue);
  }, [inputValue]);

  // Clear the suggestions list on blur
  const handleBlur = () => {
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
          value={value}
          inputValue={inputValue}
          onChange={(e, newValue) => setValue(newValue)} // Update selected value
          onInputChange={(e, newInputValue) => setInputValue(newInputValue)} // Update input text
          options={list}
          getOptionLabel={(option) => option.stockId || ""}
          isOptionEqualToValue={(option, selectedValue) =>
            option.id === selectedValue?.id
          }
          onBlur={handleBlur}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label={intl.formatMessage({ id: "adminCommon.stockId" })}
              required={required}
              error={error}
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
    dispatch({ type: "suggestStockId", payload: keyword }),
  clearStocIdList: () =>
    dispatch({ type: Actions.SET_STOCK_ID_LIST, payload: [] }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StockIdQueryMui);
