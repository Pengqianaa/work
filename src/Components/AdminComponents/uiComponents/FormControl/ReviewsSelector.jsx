import { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { InputLabel, Select, MenuItem } from "@mui/material";
import { FilterContainer } from "../AdminCommonUis";
import { FormattedMessage } from "react-intl";

const REVIEW_STATUS_KEY = "id";
const REVIEW_STATUS_TEXT = "reviewsStatus";

const ReviewsSelector = ({
    showAllOption = true,
    value,
    onChange,
    useFor = '',
}) => {
    const ALL_VALUE = "ALL";

    let reviewsStatusList = [
        { id: "1", reviewsStatus: "Approved" },
        { id: "2", reviewsStatus: "To Be Confirmed" },
        { id: "3", reviewsStatus: "Disapproved" },
        { id: "4", reviewsStatus: "In Process" },
        { id: "5", reviewsStatus: "Completed" },
    ];
    if (useFor === 'LicenseMgt') {
        reviewsStatusList = [...reviewsStatusList, { id: "6", reviewsStatus: "Deleted" }, { id: "7", reviewsStatus: "Failed" }];
    }

    // 將 reviewsStatus 轉換為 id
    const getValueId = (value) => {
        if (value === ALL_VALUE) return ALL_VALUE;
        const item = reviewsStatusList.find((item) => item.reviewsStatus === value);
        return item ? item.id : "";
    };

    // 將 id 轉換為 reviewsStatus
    const getValueStatus = (id) => {
        if (id === ALL_VALUE) return ALL_VALUE;
        const item = reviewsStatusList.find((item) => item.id === id);
        return item ? item.reviewsStatus : "";
    };

    const handleChange = (event) => {
        const newValue = event.target.value;
        if (onChange) {
            onChange(getValueStatus(newValue)); // 傳遞 reviewsStatus 給父組件
        }
    };

    return (
        <Select
            value={getValueId(value)} // 將 reviewsStatus 轉換為 id
            onChange={handleChange}
        >
            {showAllOption && (
                <MenuItem value={ALL_VALUE}>
                    <FormattedMessage id={`adminCommon.all`} />
                </MenuItem>
            )}
            {reviewsStatusList.map((el) => (
                <MenuItem key={el.id} value={el.id}>
                    {el.reviewsStatus}
                </MenuItem>
            ))}
        </Select>
    );
};

ReviewsSelector.propTypes = {
    showAllOption: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 修改為支持 string 或 number
    onChange: PropTypes.func.isRequired,
    renderValue: PropTypes.func,
    useFor: PropTypes.string,
};

export default memo(ReviewsSelector);