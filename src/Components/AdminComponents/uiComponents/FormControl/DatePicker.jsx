import { memo, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Grid, IconButton } from "@mui/material";
import {
    DatePicker as MuiDatePicker,
    LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ClearIcon from "@mui/icons-material/Clear";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarIcon from "@mui/icons-material/CalendarToday"; // 引入日历图标
import { MOMENT_FORMAT } from "../../../../constants/common";

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
    value = null,
    minDate = null,
    maxDate = null,
    onChange,
}) => {
    const [internalValue, setInternalValue] = useState(value ? dayjs(value) : null);
    const [isOpen, setIsOpen] = useState(false); // 控制日期選擇器的打開狀態

    const handleDateChange = (newValue) => {
        if (onChange) {
            onChange(newValue ? newValue.toDate() : null);
        } else {
            setInternalValue(newValue);
        }
    };

    const handleReset = () => {
        if (onChange) {
            onChange(null);
        } else {
            setInternalValue(null);
        }
    };

    const handleOpenPicker = () => {
        setIsOpen(true); // 打開日期選擇器
    };

    const handleClosePicker = () => {
        setIsOpen(false); // 關閉日期選擇器
    };

    return (
        <Grid item xs={12} md={12} style={style}>
            <LocalizationProvider dateAdapter={AdapterDayjs} style={{ width: "90%" }}>
                <MuiDatePicker
                    variant="inline"
                    style={{ width: "100%" }}
                    label={label}
                    format={format}
                    disabled={disabled}
                    value={onChange ? (value ? dayjs(value) : null) : internalValue}
                    onChange={handleDateChange}
                    open={isOpen} // 控制日期選擇器的打開狀態
                    onOpen={handleOpenPicker} // 打開時觸發
                    onClose={handleClosePicker} // 關閉時觸發
                    slotProps={{
                        textField: {
                            required,
                            error,
                            fullWidth,
                            helperText: error ? helperText : " ",
                            InputProps: {
                                endAdornment: (
                                    <>
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenPicker();
                                            }}
                                            disabled={disabled}
                                        >
                                            <CalendarIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleReset();
                                            }}
                                            disabled={disabled}
                                            edge="end"
                                        >
                                            <RestartAltIcon />
                                        </IconButton>
                                    </>
                                ),
                            },
                        },
                    }}
                    openTo={openTo}
                    views={views}
                    minDate={minDate ? dayjs(minDate) : null}
                    maxDate={maxDate ? dayjs(maxDate) : null}
                />
            </LocalizationProvider>
        </Grid>
    );
};

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