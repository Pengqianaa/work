import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Grid,
  FormControl,
  FormControlLabel,
  Chip,
  Checkbox,
  MenuItem,
} from "@mui/material/";
import { ModalContainer } from "src/Components/common";
import { TextFieldControl, SelectorControl, SubmitButton } from "../common";
import Api from "src/Common/api";
import {
  checkRequiredInputsAreEmptyOrNot,
  handleDataChange,
} from "src/Common/commonMethod";
import { INIT_SHOW_ERROR_MSGS } from "src/constants/admin/SAMFunctionMgt";
import Actions from "src/Common/Actions";
import { styled } from "@mui/material/styles";

const PREFIX = "SamFunctionMgtModal";

const classes = {
  root: `${PREFIX}-root`,
};

const StyledModalContainer = styled(ModalContainer)({
  [`&.${classes.root}`]: {
    width: "100%",
  },
});

const ModifySAMFunctionMgtModal = ({ open, setOpen, formData }) => {
  const intl = useIntl();

  const dispatch = useDispatch();
  const locale = useSelector((state) => state.view.currentLocale);
  const areaList = useSelector((state) => state.query.areaList);
  const [data, setData] = useState(formData);
  const [error, setError] = useState(INIT_SHOW_ERROR_MSGS);

  useEffect(() => {
    if (areaList.length) {
      return;
    }
    dispatch({
      type: "getAreaList",
    });
  }, []);

  const handleChange = (event) => {
    handleDataChange(event, setData);
  };

  const displayErrorDialog = (msg) => {
    dispatch({
      type: Actions.SHOW_ALERT_MESSAGE,
      payload: {
        show: true,
        props: {
          title: intl.formatMessage({ id: `common.title` }),
          message: msg,
          callback: () => {},
        },
      },
    });
  };

  const displaySuccessDialog = () => {
    dispatch({
      type: Actions.SHOW_SNACKBAR_MESSAGE,
      payload: {
        show: true,
        props: {
          message: intl.formatMessage({ id: `adminCommon.success` }),
          msgType: "success",
          autoHideDuration: 6000,
        },
      },
    });
  };

  const handleClickSave = () => {
    if (!data || checkRequiredInputsAreEmptyOrNot(data, setError)) {
      return;
    }

    Api.postFunctionItem(data)
      .then(({ status, data }) => {
        if (status !== 200 || data?.code !== 0) {
          displayErrorDialog(data?.message);
          return;
        }
        displaySuccessDialog();
        dispatch({ type: "getSAMFunctionList" });
        setOpen(false);
      })
      .catch((error) => {
        displayErrorDialog(error);
      });
  };

  const renderValue = useCallback(
    (selected) => (
      <div style={{ display: "flex", gap: "5px" }}>
        {areaList
          .filter((area) => selected.find((el) => el === area.id))
          .map((el) => {
            return (
              <Chip
                key={el.id}
                label={locale.includes("en") ? el.areaEname : el.areaName}
              />
            );
          })}
      </div>
    ),
    []
  );

  return (
    <StyledModalContainer
      open={open}
      setOpen={setOpen}
      title="Permissions"
      buttons={
        <SubmitButton onClick={handleClickSave}>
          <FormattedMessage id="adminCommon.save" />
        </SubmitButton>
      }
    >
      <TextFieldControl
        label={intl.formatMessage({ id: "samfunctionmgt.form.functionId" })}
        value={data?.id}
        required
        disabled
      />
      <TextFieldControl
        name="fucntionCode"
        label={intl.formatMessage({ id: "samfunctionmgt.form.functionCode" })}
        value={data?.fucntionCode}
        error={error.fucntionCode}
        message={intl.formatMessage({
          id: "samfunctionmgt.errorMsg.functionCode",
        })}
        required
        disabled={!!data?.id}
        onChange={(event) => handleChange(event)}
      />
      <TextFieldControl
        name="functionName"
        label={intl.formatMessage({ id: "samfunctionmgt.form.functionName" })}
        value={data?.functionName}
        error={error.functionName}
        message={intl.formatMessage({
          id: "samfunctionmgt.errorMsg.functionName",
        })}
        required
        onChange={(event) => handleChange(event)}
      />
      <TextFieldControl
        name="functionDesc"
        multiline
        required
        maxRows={2}
        placeholder={intl.formatMessage({
          id: "samfunctionmgt.form.functionDesc",
        })}
        label={intl.formatMessage({ id: "samfunctionmgt.form.functionDesc" })}
        value={data?.functionDesc}
        error={error.functionDesc}
        message={
          error.functionDesc
            ? intl.formatMessage({
                id: "samfunctionmgt.errorMsg.functionDesc",
              })
            : ""
        }
        onChange={(event) => handleChange(event)}
      />
      <Grid item xs={12}>
        <FormControl component="fieldset" className={classes.root}>
          <FormControlLabel
            labelPlacement="end"
            label={intl.formatMessage({
              id: "samfunctionmgt.form.isManagement",
            })}
            control={
              <Checkbox
                name="management"
                color="primary"
                checked={data?.management}
                onChange={(event) => handleChange(event)}
              />
            }
          />
        </FormControl>
      </Grid>
      <TextFieldControl
        label={intl.formatMessage({ id: "samfunctionmgt.form.level" })}
        value={data?.level}
        required
        disabled
      />
      <TextFieldControl
        label={intl.formatMessage({ id: "samfunctionmgt.form.parentId" })}
        value={data?.parentId ?? String(data?.parentId)}
        required
        disabled
      />
      <SelectorControl
        name="areaDTOS"
        multiple={true}
        label={intl.formatMessage({ id: "samfunctionmgt.form.area" })}
        value={data?.areaDTOS ?? []}
        error={error.areaDTOS}
        message={
          error.areaDTOS
            ? intl.formatMessage({
                id: "samfunctionmgt.errorMsg.area",
              })
            : ""
        }
        renderValue={renderValue}
        onChange={(event) => handleChange(event)}
        required
      >
        {areaList?.map((area) => (
          <MenuItem key={area.id} value={area.id}>
            <Checkbox
              style={{ color: "var(--delta-blue)" }}
              checked={!!data?.areaDTOS?.find((el) => el === area.id)}
            />
            {locale.includes("en") ? area.areaEname : area.areaName}
          </MenuItem>
        ))}
      </SelectorControl>
    </StyledModalContainer>
  );
};

export default ModifySAMFunctionMgtModal;
