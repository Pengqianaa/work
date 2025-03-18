import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Typography
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const Accordion4 = ({ createDate, reviewDate, reviewer, failedReason, isAdmin }) => {
    const displayCreateDate = isAdmin ? '-' : createDate;
    const displayReviewDate = isAdmin ? '-' : reviewDate;
    const displayReviewer = isAdmin ? '-' : reviewer;
    const displayFailedReason = isAdmin ? '-' : failedReason;

    return (
        <Accordion defaultExpanded={true} sx={{ border: "1px solid #999", borderRadius: "4px" }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h5">Application Review Information</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ border: "1px solid #ccc", borderRadius: "4px", padding: "16px" }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 4, // 增加间距
                        justifyContent: "flex-start", // 左对齐
                        flexWrap: "wrap" // 允许换行
                    }}
                >
                    <Typography>Create Date: {displayCreateDate}</Typography>
                    <Typography>Review Date: {displayReviewDate}</Typography>
                    <Typography>Reviewer: {displayReviewer}</Typography>
                    <Typography>Failed Reason: {displayFailedReason}</Typography>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default Accordion4;