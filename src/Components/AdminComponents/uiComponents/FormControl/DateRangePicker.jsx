import { useState } from 'react';
import { DatePicker } from './index'; // 替换为实际的路径
import { addMonths, differenceInCalendarMonths, format } from 'date-fns'; // 使用 date-fns 处理日期
import { FilterContainer } from '../AdminCommonUis';

const DATE_RANGE = {
    BEGIN_DATE: 'beginDate',
    END_DATE: 'endDate',
};

const DateRangePicker = ({ setStartDate, setEndDate }) => {
    const [dates, setDates] = useState({
        [DATE_RANGE.BEGIN_DATE]: null,
        [DATE_RANGE.END_DATE]: null,
    });
    const [error, setError] = useState({
        [DATE_RANGE.BEGIN_DATE]: '',
        [DATE_RANGE.END_DATE]: '',
    });

    const handleChange = (date, type) => {
        const newDates = { ...dates, [type]: date };
        setDates(newDates);

        // 验证日期区间
        validateDateRange(newDates);

        // 根据日期类型更新外部状态，并格式化日期
        if (type === DATE_RANGE.BEGIN_DATE) {
            if (date) {
                const formattedDate = format(date, 'yyyy-MM-dd');
                setStartDate(formattedDate);
            } else {
                setStartDate(null);
            }
        } else if (type === DATE_RANGE.END_DATE) {
            if (date) {
                const formattedDate = format(date, 'yyyy-MM-dd');
                setEndDate(formattedDate);
            } else {
                setEndDate(null);
            }
        }
    };

    const validateDateRange = (newDates) => {
        const { beginDate, endDate } = newDates;

        if (beginDate && endDate) {
            const monthDifference = differenceInCalendarMonths(endDate, beginDate);

            if (monthDifference > 3) {
                // 如果超过 3 个月，显示错误提示
                setError({
                    ...error,
                    [DATE_RANGE.END_DATE]: 'Date range cannot exceed 3 months.',
                });
                // 自动调整 End Date 为 Start Date + 3 个月
                const adjustedEndDate = addMonths(beginDate, 3);
                setDates({ ...newDates, [DATE_RANGE.END_DATE]: adjustedEndDate });
                // 更新外部的结束日期状态，并格式化日期
                const formattedAdjustedEndDate = format(adjustedEndDate, 'yyyy-MM-dd');
                setEndDate(formattedAdjustedEndDate);
            } else {
                // 如果日期区间合法，清除错误提示
                setError({ ...error, [DATE_RANGE.END_DATE]: '' });
            }
        }
    };

    const handleReset = () => {
        setDates({
            [DATE_RANGE.BEGIN_DATE]: null,
            [DATE_RANGE.END_DATE]: null,
        });
        setError({
            [DATE_RANGE.BEGIN_DATE]: '',
            [DATE_RANGE.END_DATE]: '',
        });
        setStartDate(null);
        setEndDate(null);
    };

    return (
        <>
            <FilterContainer>
                <DatePicker
                    label="Start Date"
                    required={true}
                    error={!!error[DATE_RANGE.BEGIN_DATE]}
                    value={dates[DATE_RANGE.BEGIN_DATE]}
                    helperText={error[DATE_RANGE.BEGIN_DATE] || 'Select start date'}
                    onChange={(event) => handleChange(event, DATE_RANGE.BEGIN_DATE)}
                />
            </FilterContainer>
            <FilterContainer>
                <DatePicker
                    label="End Date"
                    required={true}
                    error={!!error[DATE_RANGE.END_DATE]}
                    minDate={dates[DATE_RANGE.BEGIN_DATE]} // 最小日期为 Start Date
                    maxDate={
                        dates[DATE_RANGE.BEGIN_DATE]
                            ? addMonths(dates[DATE_RANGE.BEGIN_DATE], 3) // 最大日期为 Start Date + 3 个月
                            : null
                    }
                    value={dates[DATE_RANGE.END_DATE]}
                    helperText={error[DATE_RANGE.END_DATE] || 'Select end date (max 3 months)'}
                    onChange={(event) => handleChange(event, DATE_RANGE.END_DATE)}
                />
            </FilterContainer>
        </>
    );
};

export default DateRangePicker;