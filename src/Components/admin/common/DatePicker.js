import { memo } from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import {
  DatePicker as MuiDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { MOMENT_FORMAT } from "src/constants/common";

const DatePicker = ({
  fullWidth = true,
  format = MOMENT_FORMAT.DATE,
  openTo = "day",
  views = ["month", "day"],
  style,
  label,
  disabled = false,
  required = false,
  error = false,
  helperText = "",
  value = new Date(),
  minDate = new Date(),
  maxDate,
  onChange,
}) => (
  <Grid item xs={12} md={12} style={style}>
    <LocalizationProvider dateAdapter={AdapterDayjs} style={{ width: "90%" }}>
      <MuiDatePicker
        variant="inline"
        style={{ width: "100%" }}
        label={label}
        format={format}
        disabled={disabled}
        value={value != null ? dayjs(value) : null}
        onChange={onChange}
        slotProps={{
          field: { clearable: true },
          textField: {
            required,
            error,
            fullWidth,
            helperText: error ? helperText : " ",
          },
        }}
        openTo={openTo}
        views={views}
        minDate={minDate && dayjs(minDate)}
        maxDate={maxDate && dayjs(maxDate)}
      />
    </LocalizationProvider>
  </Grid>
);

DatePicker.propTypes = {
  fullWidth: PropTypes.bool,
  format: PropTypes.string,
  openTo: PropTypes.string,
  views: PropTypes.arrayOf(PropTypes.string),
  style: PropTypes.object,
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  minDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  maxDate: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

  onChange: PropTypes.func.isRequired,
};

export default memo(DatePicker);
