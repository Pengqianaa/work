import React, { useState, useEffect } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const isMonday = (date) => dayjs(date).day() === 1;
const isSunday = (date) => dayjs(date).day() === 0;

const LicenseApplicationAccordion = ({ startDate, setStartDate, setEndDate, licenseReason, handleLicenseReasonChange, isAdmin }) => {
    const firstDay = dayjs().startOf('week').add(1, 'day');
    const [specifiedDate, setSpecifiedDate] = useState(startDate.add(6, 'day')); // 默认值为 startDate + 6 天
    const [isValidDate, setIsValidDate] = useState(true);
    const [endDateOption, setEndDateOption] = useState('specifiedDate'); // 默认选中 specifiedDate
    const [isSpecifiedDateDisabled, setIsSpecifiedDateDisabled] = useState(false);

    const handleEndDateOptionChange = (value) => {
        setEndDateOption(value);
    };

    const shouldDisableDate = (date, isStartDatePicker) => {
        const dayjsDate = dayjs(date);
        if (isStartDatePicker) {
            const todayMonday = firstDay;
            return !(isMonday(dayjsDate) && (dayjsDate.isSame(todayMonday, 'day') || dayjsDate.isAfter(todayMonday, 'day')));
        } else {
            const minDate = startDate.add(6, 'day');
            return !(isSunday(dayjsDate) && (dayjsDate.isSame(minDate, 'day') || dayjsDate.isAfter(minDate, 'day')));
        }
    };

    const handleStartDateChange = (newValue) => {
        const todayMonday = firstDay;
        const isValid = isMonday(newValue) && (newValue.isSame(todayMonday, 'day') || newValue.isAfter(todayMonday, 'day'));
        setIsValidDate(isValid);
        if (isValid) {
            setStartDate(newValue);
            const newSpecifiedDate = newValue.add(6, 'day');
            setSpecifiedDate(newSpecifiedDate);
            // 根据当前 endDateOption 计算并更新 endDate
            switch (endDateOption) {
                case '7Days':
                    setEndDate(newValue.add(6, 'day'));
                    break;
                case '14Days':
                    setEndDate(newValue.add(13, 'day'));
                    break;
                case 'specifiedDate':
                    setEndDate(newSpecifiedDate);
                    break;
                default:
                    console.error(`Invalid endDateOption: ${endDateOption}`);
                    break;
            }
        }
    };

    const handleSpecifiedDateChange = (newValue) => {
        const minDate = startDate.add(6, 'day');
        const isValid = isSunday(newValue) && (newValue.isSame(minDate, 'day') || newValue.isAfter(minDate, 'day'));
        if (isValid) {
            setSpecifiedDate(newValue);
            // 直接使用 newValue 来更新 endDate
            setEndDate(newValue);
        }
    };

    const handleEndDateOptionChangeLocal = (event) => {
        const value = event.target.value;
        setEndDateOption(value);
        handleEndDateOptionChange(value);
        setIsSpecifiedDateDisabled(value!== 'specifiedDate');
        calculateEndDate(value);
    };

    const calculateEndDate = (endDateOption) => {
        switch (endDateOption) {
            case '7Days':
                setEndDate(startDate.add(6, 'day'));
                break;
            case '14Days':
                setEndDate(startDate.add(13, 'day'));
                break;
            default:
                console.error(`Invalid endDateOption: ${endDateOption}`);
                break;
        }
    };

    return (
        <Accordion sx={{ border: "1px solid #999", borderRadius: "4px" }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h5">License Application Details</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ border: "1px solid #ccc", borderRadius: "4px", padding: "16px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography>Application Start Date:</Typography>
                            {isAdmin ? (
                                <Typography sx={{ color: 'blue', marginLeft: '4px' }}>
                                    (Effective on Monday)
                                </Typography>
                            ) : (
                                <Typography sx={{ color: 'blue', marginLeft: '4px' }}>
                                    (Effective next Monday)
                                </Typography>
                            )}
                        </Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="选择日期"
                                value={startDate}
                                onChange={handleStartDateChange}
                                shouldDisableDate={(date) => shouldDisableDate(date, true)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        InputProps={{
                                            ...params.InputProps,
                                            value: startDate ? startDate.format('YYYY-MM-DD') : '',
                                        }}
                                    />
                                )}
                                error={!isValidDate}
                                helperText={!isValidDate ? '只能选择当周及之后的周一' : ''}
                            />
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <RadioGroup
                            value={endDateOption}
                            onChange={handleEndDateOptionChangeLocal}
                        >
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <FormControlLabel value="7Days" control={<Radio />} label="7Days" />
                                <FormControlLabel value="14Days" control={<Radio />} label="14Days" />
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <FormControlLabel value="specifiedDate" control={<Radio />} label="Specified Date:" />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="选择指定日期"
                                        value={specifiedDate}
                                        onChange={handleSpecifiedDateChange}
                                        shouldDisableDate={(date) => shouldDisableDate(date, false)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    value: specifiedDate ? specifiedDate.format('YYYY-MM-DD') : '',
                                                    disabled: isSpecifiedDateDisabled,
                                                }}
                                            />
                                        )}
                                        disabled={isSpecifiedDateDisabled}
                                    />
                                </LocalizationProvider>
                            </Box>
                        </RadioGroup>
                    </Box>
                </Box>
                {/* <Typography>End Date: {endDate.format('YYYY-MM-DD')}</Typography> */}
                <Typography>Reason for License Application: </Typography>
                <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    value={licenseReason}
                    onChange={handleLicenseReasonChange}
                />
            </AccordionDetails>
        </Accordion>
    );
};

export default LicenseApplicationAccordion;