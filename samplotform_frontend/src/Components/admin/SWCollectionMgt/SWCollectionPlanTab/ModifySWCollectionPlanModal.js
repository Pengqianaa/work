import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { ModalContainer, BUTTON_TYPES, Buttons } from "src/Components/common";
import { DatePicker } from "src/Components/admin/common";
import { ACTIONS } from "src/Reducers/admin/SWCollectionMgt/SWCollectionPlanReducer";
import { checkRequiredInputsAreEmptyOrNot } from "src/utils/methods/common";
import { MOMENT_FORMAT, MODIFY_ACTION_TYPE } from "src/constants/common";

const DATE_RANGE = {
  BEGIN_DATE: "beginDate",
  END_DATE: "endDate",
};

export const INIT_SHOW_ERROR_MSGS = {
  [DATE_RANGE.BEGIN_DATE]: false,
  [DATE_RANGE.END_DATE]: false,
};

const ModifySWCollectionPlanModal = ({ show = false, toggle }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { beginDate, endDate } = useSelector(
    (state) => state.SWCollectionPlan.planDate
  );
  const [dates, setDates] = useState({
    [DATE_RANGE.BEGIN_DATE]: beginDate,
    [DATE_RANGE.END_DATE]: endDate,
  });
  const [error, setError] = useState(INIT_SHOW_ERROR_MSGS);
  const minDate = moment().startOf("year").format(MOMENT_FORMAT.DATE);
  const maxDate = moment().endOf("year").format(MOMENT_FORMAT.DATE);
  const isEdit = !!beginDate && !!endDate;
  const title = `${intl.formatMessage({
    id: `COMMON.BUTTON.${isEdit ? BUTTON_TYPES.UPDATE : BUTTON_TYPES.ADD}`,
  })} ${intl.formatMessage({
    id: `ADMIN.SW_COLLECTION_MGT.SW_COLLECTION_PLAN.MODAL_TITLE`,
  })}`;
  const beginDateLabel = intl.formatMessage({
    id: "ADMIN.SW_COLLECTION_MGT.SW_COLLECTION_PLAN.TABLE.BEGIN_DATE",
  });
  const endDateLabel = intl.formatMessage({
    id: "ADMIN.SW_COLLECTION_MGT.SW_COLLECTION_PLAN.TABLE.END_DATE",
  });
  const requiredLabel = intl.formatMessage({
    id: "ADMIN.COMMON.TEXT.REQUIRED",
  });

  const handleChange = (value, type) => {
    setDates((prev) => ({
      ...prev,
      [type]: value === null ? value : new Date(value).toISOString(),
    }));
  };

  const handleSave = () => {
    if (checkRequiredInputsAreEmptyOrNot(dates, setError)) {
      return;
    }
    dispatch({
      type: ACTIONS.POST_SW_COLLECTION_PLAN,
      payload: {
        action: isEdit ? MODIFY_ACTION_TYPE.EDIT : MODIFY_ACTION_TYPE.ADD,
        currYear: new Date().getFullYear(),
        ...dates,
      },
    });

    toggle(false);
  };

  return (
    <ModalContainer
      open={show}
      setOpen={() => toggle(false)}
      title={title}
      buttons={<Buttons type={BUTTON_TYPES.SAVE} onClick={handleSave} />}
    >
      <DatePicker
        label={beginDateLabel}
        required={true}
        disabled={!!beginDate}
        error={error[DATE_RANGE.BEGIN_DATE]}
        minDate={minDate}
        maxDate={maxDate}
        value={dates[DATE_RANGE.BEGIN_DATE]}
        helperText={`${beginDateLabel} ${requiredLabel}`}
        onChange={(event) => handleChange(event, DATE_RANGE.BEGIN_DATE)}
        style={{ marginTop: 20 }}
      />
      <DatePicker
        label={endDateLabel}
        required={true}
        error={error[DATE_RANGE.END_DATE]}
        minDate={dates[DATE_RANGE.BEGIN_DATE]}
        maxDate={maxDate}
        value={dates[DATE_RANGE.END_DATE]}
        helperText={`${endDateLabel} ${requiredLabel}`}
        onChange={(event) => handleChange(event, DATE_RANGE.END_DATE)}
      />
    </ModalContainer>
  );
};

ModifySWCollectionPlanModal.propTypes = {
  show: PropTypes.bool,
  toggle: PropTypes.func.isRequired,
};

export default ModifySWCollectionPlanModal;
