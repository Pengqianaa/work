import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const Accordion3 = ({ reviewResult, reason, isAdmin, handleReviewResultChange, setReason }) => {
    // const isDisabled =!isAdmin;
    const isDisabled = true;
    const handleReasonChange = (event) => {
        if (isAdmin) {
            setReason(event.target.value);
        }
    };

    return (
        <Accordion sx={{ border: "1px solid #999", borderRadius: "4px" }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h5">Review Result</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ border: "1px solid #ccc", borderRadius: "4px", padding: "16px" }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <RadioGroup
                        row
                        value={reviewResult}
                        onChange={handleReviewResultChange}
                        disabled={isDisabled}
                    >
                        <FormControlLabel value="1" control={<Radio disabled={isDisabled} />} label="Approved" />
                        <FormControlLabel value="2" control={<Radio disabled={isDisabled} />} label="Disapproved" />
                    </RadioGroup>

                    <Typography>Reason: </Typography>
                    <TextField
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        value={reason}
                        onChange={handleReasonChange}
                        disabled={isDisabled}
                    />
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default Accordion3;