/* eslint-disable */
import React, { useEffect, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import TextField from "@mui/material/TextField";
import { Autocomplete } from "@mui/material";
import FormHelperText from '@mui/material/FormHelperText';  
import { FormattedMessage } from "react-intl";
import { ACTIONS } from "src/Reducers/admin/SWCollection/SWReportReducer";
const CostCenterQuery = ({ intl ,setInfo }) => {
  const dispatch = useDispatch();
  const verified = useSelector((state) => state.query.verifiedCostDept);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    if (typeof keyword !== "undefined" && keyword.length > 7) {
      verifyCostCenter(keyword);
    }
    // if (keyword.includes("ALL")) {
    //   verifyCostCenter(keyword);
    // }
  }, [keyword]);

  const verifyCostCenter = (keyword) =>
    dispatch({
      type: "verifyCostCenter",
      payload: keyword,
    });

  const handleKeyUp = (event) => {
    if (event === null) {
      return;
    }
    setKeyword(event.target.value);
  };

  const onChange = (event, value) => {
    setInfo(value);
    dispatch({
      type: ACTIONS.SET_SW_COST_CENTER,
      payload: value,
    });
    setKeyword("");
  };
  return (
    <>
    <Autocomplete
        size="small"
        options={[...verified]}
        onChange={onChange}
        onInputChange={handleKeyUp}
        isOptionEqualToValue={(option, value) =>
            value === undefined || value === "" || option.id === value.id
        }
        renderInput={(params) => (
          <TextField {...params} value={keyword} variant="standard" label={intl.formatMessage({ id: 'ADMIN.COMMON.FORM_CONTROL_LABEL.COST_CENTER' })} />
        )}
      />
     <FormHelperText><FormattedMessage id="ADMIN.COMMON.TEXT.COST_CENTER_TIP" /></FormHelperText>
    </>
  );
};

CostCenterQuery.propTypes = {
  setInfo: PropTypes.func.isRequired,
  intl: PropTypes.node.isRequired,
};

export default memo(CostCenterQuery);
