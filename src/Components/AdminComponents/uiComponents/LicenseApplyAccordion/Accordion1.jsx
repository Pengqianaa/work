import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Typography,
    Select,
    MenuItem
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { ACTIONS } from "../../../../Reducers/LicenseApplyReducer";


const Accordion1 = ({ isEdit, isAdmin, selApplicant, setSelApplicant }) => {
    const user = useSelector((state) => state.user.user);
    const orgName = useSelector((state) => state.view.orgNTenantOrg);
    const applicantList = useSelector((state) => state.licenseApply.applicantList);
    const licenseApplyDetail = useSelector((state) => state.licenseApply.licenseApplyDetail);
    const [bgShortName, setBgShortName] = useState(user.extensions.bgShortName);
    const [buShortName, setBuShortName] = useState(user.extensions.buShortName);
    const [username, setUsername] = useState(user.username);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch({ type: ACTIONS.FIND_APPLICANT_BY_ORG, payload: { orgName } });
    }, [isAdmin]);

    // 當 isAdmin 為 true 且 applicantList 有值時，默認選中第一個選項
    useEffect(() => {
        if (isAdmin && applicantList.length > 0) {
            setSelApplicant(applicantList[0]);
        }
    }, [isAdmin, applicantList]); // 依賴 isAdmin 和 applicantList

    useEffect(() => {
        if (!isAdmin) {
            const selectedApplicant = applicantList.find(applicant => applicant.userName === username);
            if (selectedApplicant) {
                setSelApplicant(selectedApplicant);
            }
        }
    }, [isAdmin, username, applicantList]);

    useEffect(() => {
        if (Object.keys(licenseApplyDetail).length !== 0) {
            setBgShortName(licenseApplyDetail.applicant.bgShortName)
            setBuShortName(licenseApplyDetail.applicant.buShortName)
            setUsername(licenseApplyDetail.applicant.userName)
        } else {
            setBgShortName('')
            setBuShortName('')
            setUsername('-')
        }
    }, [licenseApplyDetail]);

    useEffect(() => {
        if (!isEdit) {
            setBgShortName(user.extensions.bgShortName)
            setBuShortName(user.extensions.buShortName)
            setUsername(user.username)
        }
    }, [isEdit]);

    const handleApplicantChange = (event) => {
        setSelApplicant(event.target.value);
        console.info(event.target.value)
    };

    return (
        <Accordion defaultExpanded={true} sx={{ border: "1px solid #999", borderRadius: "4px" }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h5">Applicant Information</Typography>
            </AccordionSummary>
            {isAdmin ? (
                <AccordionDetails sx={{ border: "1px solid #999", borderRadius: "4px", padding: "16px" }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Select Applicant
                            </Typography>
                            <Select
                                value={selApplicant}
                                onChange={handleApplicantChange}
                                sx={{ width: '25%' }}
                            >
                                {applicantList.map((applicant, index) => {
                                    return (
                                        <MenuItem key={index} value={applicant}>{applicant.userName}</MenuItem>
                                    );
                                })}

                            </Select>
                        </Box>
                    </Box>
                </AccordionDetails>
            ) : (
                <AccordionDetails sx={{ border: "1px solid #999", borderRadius: "4px", padding: "16px" }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                BGBU
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#a69292" }}>
                                {`${bgShortName}-${buShortName}`}
                            </Typography>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                Applicant Name
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#a69292" }}>
                                {username}
                            </Typography>
                        </Box>
                    </Box>
                </AccordionDetails>
            )}
        </Accordion>
    );
};

export default Accordion1;