import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import { MenuItem } from "@mui/material";
import { BUTTON_TYPES, Buttons, ModalContainer } from "src/Components/common";
import { SelectorControl, TextFieldControl } from "src/Components/admin/common";
import {
  ACTIONS,
  INIT_MODIFIED_DATA,
} from "src/Reducers/admin/SWCollectionMgt/RateMgtReducer";
import { checkRequiredInputsAreEmptyOrNot } from "src/utils/methods/common";
import { CURRENCY_TYPE } from "src/constants/common";

const PARAMS = {
  FROM_CURRENCY: "fromCurrency",
  TO_CURRENCY: "toCurrency",
  RATE: "rate",
};

const INIT_SHOW_ERROR_MSGS = {
  [PARAMS.FROM_CURRENCY]: false,
  [PARAMS.TO_CURRENCY]: false,
  [PARAMS.RATE]: false,
};

const SW_COLLECTION_MESSAGE = {
  RATE_CATEGORY: [
    { id: 1, value: CURRENCY_TYPE.TWD },
    { id: 2, value: CURRENCY_TYPE.USD },
  ],
};

const ModifyRateMgtModal = ({ show, toggle }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { modifyData } = useSelector((state) => state.SWRateMgt);
  const [params, setParams] = useState({ ...modifyData });
  const [error, setError] = useState(INIT_SHOW_ERROR_MSGS);
  const [isEdit, setIsEdit] = useState(false);
  const title = `${intl.formatMessage({
    id: `COMMON.BUTTON.${isEdit ? BUTTON_TYPES.UPDATE : BUTTON_TYPES.ADD}`,
  })} ${intl.formatMessage({
    id: `ADMIN.SW_COLLECTION_MGT.SW_RATE_MGT.MODAL_TITLE`,
  })}`;

  useEffect(() => {
    setIsEdit(!!modifyData?.rateId);

    return () => {
      dispatch({
        type: ACTIONS.SET_MODIFIED_RATE_MGT,
        payload: { ...INIT_MODIFIED_DATA },
      });
    };
  }, []);

  const onChange = (value, type) => {
    let _value = {};
    // NOTE: RATE 的類型是 DECIMAL(6, 4), 支持的最大數值（包括小數部分）是 99.9999
    if (
      (type === PARAMS.RATE && value.split(".")[1]?.length > 3) ||
      Number(value) >= 100
    ) {
      return;
    }

    if (type !== PARAMS.RATE) {
      const key =
        type === PARAMS.FROM_CURRENCY
          ? PARAMS.TO_CURRENCY
          : PARAMS.FROM_CURRENCY;

      _value = {
        [key]:
          value === CURRENCY_TYPE.TWD ? CURRENCY_TYPE.USD : CURRENCY_TYPE.TWD,
      };
    }

    setParams((prev) => ({
      ...prev,
      ..._value,
      [type]: type === PARAMS.RATE ? Number(value) : value,
    }));
  };

  const onSave = () => {
    if (checkRequiredInputsAreEmptyOrNot(params, setError)) {
      return;
    }

    dispatch({
      type: ACTIONS.POST_RATE_MGT,
      payload: params,
    });

    toggle(false);
  };

  return (
    <ModalContainer
      open={show}
      setOpen={toggle}
      title={title}
      buttons={<Buttons type={BUTTON_TYPES.SAVE} onClick={onSave} />}
    >
      <SelectorControl
        label={intl.formatMessage({
          id: "ADMIN.SW_COLLECTION_MGT.SW_RATE_MGT.TABLE.FROM_CURRENCY",
        })}
        value={params[PARAMS.FROM_CURRENCY]}
        onChange={(e) => onChange(e.target.value, PARAMS.FROM_CURRENCY)}
        error={error[PARAMS.FROM_CURRENCY]}
        message={`${intl.formatMessage({
          id: "ADMIN.SW_COLLECTION_MGT.SW_RATE_MGT.TABLE.FROM_CURRENCY",
        })}${intl.formatMessage({
          id: "ADMIN.COMMON.MODAL.REQUIRED",
        })}`}
        disabled={isEdit}
        required
      >
        {SW_COLLECTION_MESSAGE.RATE_CATEGORY.map((menu, index) => (
          <MenuItem key={`${menu.id}${index}`} value={menu.value}>
            {menu.value}
          </MenuItem>
        ))}
      </SelectorControl>
      <SelectorControl
        label={intl.formatMessage({
          id: "ADMIN.SW_COLLECTION_MGT.SW_RATE_MGT.TABLE.TO_CURRENCY",
        })}
        value={params[PARAMS.TO_CURRENCY]}
        onChange={(e) => onChange(e.target.value, PARAMS.TO_CURRENCY)}
        error={error[PARAMS.TO_CURRENCY]}
        message={`${intl.formatMessage({
          id: "ADMIN.SW_COLLECTION_MGT.SW_RATE_MGT.TABLE.TO_CURRENCY",
        })}${intl.formatMessage({
          id: "ADMIN.COMMON.MODAL.REQUIRED",
        })}`}
        disabled={isEdit}
        required
      >
        {SW_COLLECTION_MESSAGE.RATE_CATEGORY.map((menu, index) => (
          <MenuItem key={`${menu.id}${index}`} value={menu.value}>
            {menu.value}
          </MenuItem>
        ))}
      </SelectorControl>
      <TextFieldControl
        type="Number"
        inputProps={{
          min: 0,
          max: 100,
          inputMode: "numeric",
        }}
        label={intl.formatMessage({
          id: "ADMIN.SW_COLLECTION_MGT.SW_RATE_MGT.TABLE.RATE",
        })}
        value={params[PARAMS.RATE]}
        onChange={(e) => onChange(e.target.value, PARAMS.RATE)}
        error={error[PARAMS.RATE]}
        message={`${intl.formatMessage({
          id: "ADMIN.SW_COLLECTION_MGT.SW_RATE_MGT.TABLE.RATE",
        })}${intl.formatMessage({
          id: "ADMIN.COMMON.MODAL.REQUIRED",
        })}`}
        placeholder="0"
        required
      />
    </ModalContainer>
  );
};

export default ModifyRateMgtModal;
