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

const Accordion2 = ({ startDate, setStartDate, setEndDate, endDateType, setEndDateType, licenseReason, handleLicenseReasonChange, isAdmin, isEdit }) => {
    const firstDay = dayjs().startOf('week').add(1, 'day');
    const nextMonday = dayjs().startOf('week').add(1, 'week').add(1, 'day'); // 计算下周一
    const [specifiedDate, setSpecifiedDate] = useState(startDate.add(6, 'day')); // 默认值为 startDate + 6 天
    const [isValidDate, setIsValidDate] = useState(true);
    const [isSpecifiedDateDisabled, setIsSpecifiedDateDisabled] = useState(endDateType !== 3);

    useEffect(() => {
        if (!isAdmin) {
            setStartDate(nextMonday);
        }
    }, [isAdmin]);

    const handleEndDateOptionChange = (value) => {
        setEndDateType(value);
    };

    const shouldDisableDate = (date, isStartDatePicker) => {
        const dayjsDate = dayjs(date);
    
        if (!isAdmin && isStartDatePicker) {
            // 如果不是管理員，並且是選擇開始日期的日期選擇器
            const nextMonday = dayjs().startOf('week').add(1, 'week').add(1, 'day'); // 下週一
            const isNextMonday = dayjsDate.isSame(nextMonday, 'day'); // 是否為下週一
            const isFutureMonday = dayjsDate.day() === 1 && dayjsDate.isAfter(nextMonday, 'day'); // 是否為下週一之後的週一
    
            // 如果不是下週一或之後的週一，則禁用
            return !(isNextMonday || isFutureMonday);
        }
    
        if (isAdmin && isStartDatePicker) {
            // 如果是管理員，並且是選擇開始日期的日期選擇器
            const todayMonday = dayjs().startOf('week').add(1, 'day'); // 本週一
            const isTodayMonday = dayjsDate.isSame(todayMonday, 'day'); // 是否為本週一
            const isFutureMonday = dayjsDate.day() === 1 && dayjsDate.isAfter(todayMonday, 'day'); // 是否為本週一之後的週一
    
            // 如果不是本週一或之後的週一，則禁用
            return !(isTodayMonday || isFutureMonday);
        }
    
        // 如果不是選擇開始日期的日期選擇器（例如選擇指定日期），則根據其他邏輯禁用
        const minDate = startDate.add(6, 'day');
        return !(isSunday(dayjsDate) && (dayjsDate.isSame(minDate, 'day') || dayjsDate.isAfter(minDate, 'day')));
    };

    const handleStartDateChange = (newValue) => {
        const todayMonday = firstDay;
        const isValid = isMonday(newValue) && (newValue.isSame(todayMonday, 'day') || newValue.isAfter(todayMonday, 'day'));
        setIsValidDate(isValid);
        if (isValid) {
            setStartDate(newValue);
            const newSpecifiedDate = newValue.add(6, 'day');
            setSpecifiedDate(newSpecifiedDate);
            // 根据当前 endDateType 计算并更新 endDate
            switch (endDateType) {
                case 1:
                    setEndDate(newValue.add(6, 'day'));
                    break;
                case 2:
                    setEndDate(newValue.add(13, 'day'));
                    break;
                case 3:
                    setEndDate(newSpecifiedDate);
                    break;
                default:
                    console.error(`Invalid endDateType: ${endDateType}`);
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
        setEndDateType(value);
        handleEndDateOptionChange(value);
        setIsSpecifiedDateDisabled(Number(value) !== 3);
        calculateEndDate(Number(value));
    };

    const calculateEndDate = (endDateType) => {
        switch (endDateType) {
            case 1:
                setEndDate(startDate.add(6, 'day'));
                break;
            case 2:
                setEndDate(startDate.add(13, 'day'));
                break;
            default:
                break;
        }
    };

    const reasonChange = (e) => {
        handleLicenseReasonChange(e.target.value)
    };

    return (
        <Accordion defaultExpanded={true} sx={{ border: "1px solid #999", borderRadius: "4px" }}>
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
                                onChange={isEdit ? () => { } : handleStartDateChange}
                                shouldDisableDate={(date) => shouldDisableDate(date, true)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        InputProps={{
                                            ...params.InputProps,
                                            value: startDate ? startDate.format('YYYY-MM-DD') : '',
                                            disabled: isEdit
                                        }}
                                    />
                                )}
                                error={!isValidDate}
                                helperText={!isValidDate ? '只能选择当周及之后的周一' : ''}
                                disabled={isEdit}
                            />
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <RadioGroup
                            value={endDateType}
                            onChange={isEdit ? () => { } : handleEndDateOptionChangeLocal}
                            disabled={isEdit}
                        >
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <FormControlLabel value={1} control={<Radio disabled={isEdit} />} label="7Days" />
                                <FormControlLabel value={2} control={<Radio disabled={isEdit} />} label="14Days" />
                            </Box>
                            {isAdmin && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <FormControlLabel value={3} control={<Radio disabled={isEdit} />} label="Specified Date:" />
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="选择指定日期"
                                            value={specifiedDate}
                                            onChange={isEdit ? () => { } : handleSpecifiedDateChange}
                                            shouldDisableDate={(date) => shouldDisableDate(date, false)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        value: specifiedDate ? specifiedDate.format('YYYY-MM-DD') : '',
                                                        disabled: isEdit || isSpecifiedDateDisabled
                                                    }}
                                                />
                                            )}
                                            disabled={isEdit || isSpecifiedDateDisabled}
                                        />
                                    </LocalizationProvider>
                                </Box>
                            )}
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
                    onChange={isEdit ? () => { } : reasonChange}
                    disabled={isEdit}
                />
            </AccordionDetails>
        </Accordion>
    );
};

export default Accordion2;    