import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Accordion1 from "./LicenseApplyAccordion/Accordion1";
import Accordion2 from "./LicenseApplyAccordion/Accordion2";
import Accordion3 from "./LicenseApplyAccordion/Accordion3";
import Accordion4 from "./LicenseApplyAccordion/Accordion4";
import LicenseEnoughTip from "./LicenseApplyAccordion/LicenseEnoughTip";
import dayjs from 'dayjs';
import moment from 'moment'; // 引入 moment
import { ACTIONS } from "../../../Reducers/LicenseApplyReducer";

const theme = createTheme({
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          marginBottom: "16px",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: "#ffffff",
          },
          "&:nth-of-type(even)": {
            backgroundColor: "#f5f5f5",
          },
        },
      },
    },
  },
});

const LicenseApply = ({ isAdmin = true, isEdit = false, applyId = '' }) => {
  const firstDay = dayjs().startOf('week').add(1, 'day');
  const nextSunday = dayjs().startOf('week').add(1, 'week');
  // const [isAdmin, setIsAdmin] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selApplicant, setSelApplicant] = useState('');
  const [reviewResult, setReviewResult] = useState(null); // Default to approved
  const dispatch = useDispatch();
  const location = useLocation();
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(nextSunday);
  const [endDateType, setEndDateType] = useState(1);
  const [licenseReason, setLicenseReason] = useState('');
  const [reason, setReason] = useState('');
  const [createDate, setCreateDate] = useState('-');
  const [reviewDate, setReviewDate] = useState('-');
  const [reviewer, setReviewer] = useState('-');
  const [failedReason, setFailedReason] = useState('-');
  const [isChecking, setIsChecking] = useState(false);

  const licenseApplyDetail = useSelector((state) => state.licenseApply.licenseApplyDetail);
  const licenseEnough = useSelector((state) => state.licenseApply.licenseEnough);
  const orgName = useSelector((state) => state.view.orgNTenantOrg);
  useEffect(() => {
    clear()
  }, []);

  useEffect(() => {
    if (applyId) {
      dispatch({ type: ACTIONS.FIND_LICENSE_BY_ID, payload: { licenseId: applyId } });
    }
  }, [applyId]);

  useEffect(() => {
    if (Object.keys(licenseApplyDetail).length !== 0) {
      setStartDate(dayjs(licenseApplyDetail.startDate))
      setEndDate(dayjs(licenseApplyDetail.endDate))
      setEndDateType(licenseApplyDetail.endDateType)
      setLicenseReason(licenseApplyDetail.applyReason)
      setCreateDate(moment(licenseApplyDetail.applyDate).format('YYYY-MM-DD'))
      setReviewDate(moment(licenseApplyDetail.reviewDate).format('YYYY-MM-DD'))
      setReason(licenseApplyDetail.reviewReason)
      setReviewResult(licenseApplyDetail.reviewResult)
      if (licenseApplyDetail.reviewer) {
        setReviewer(licenseApplyDetail.reviewer.userName)
      }
      if (licenseApplyDetail.failApiLog) {
        setFailedReason(licenseApplyDetail.failApiLog.errorMsg)
      }
    } else {
      clear()
    }
  }, [licenseApplyDetail]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setIsChecking(false); //需要在關閉時，把這個重置回false，不然不會觸發監聽 licenseEnough 的變化
  };

  const send = () => {
    setIsChecking(true); // 設置為 true，表示用戶觸發了檢查
    // 觸發 CHECK_LICENSE_ENOUGH
    dispatch({ type: ACTIONS.CHECK_LICENSE_ENOUGH, payload: { orgName } });
  };

  // 監聽 licenseEnough 的變化
  useEffect(() => {
    if (!isChecking) {
      return; // 如果不是用戶觸發的檢查，直接返回
    }
    if (licenseEnough === false) {
      setDialogOpen(true); // 打開提示框
    } else if (licenseEnough === true) {
      // 如果 licenseEnough 為 true，繼續執行後續邏輯
      let params = {
        applicant: selApplicant,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        applyReason: licenseReason,
        endDateType: Number(endDateType),
      };
      dispatch({ type: ACTIONS.APPLY_LICENSE, payload: { orgName, params } });
      clear();
    }
  }, [licenseEnough, isChecking]);

  const clear = () => {
    setStartDate(firstDay)
    setEndDate(nextSunday)
    setEndDateType(1)
    setLicenseReason('')
    setCreateDate('-')
    setFailedReason('-')
    setReviewer('-')
    setReviewDate('-')
    setIsChecking(false);
    dispatch({ type: ACTIONS.SET_LICENSE_ENOUGH, payload: null });
    setDialogOpen(false)
  }

  const close = () => {
    console.info(close)
  };

  const handleReviewResultChange = (event) => {
    setReviewResult(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <Box my={4}>
          {!isEdit ? <Typography variant="h4" component="h1" gutterBottom sx={{ color: "#4caf50" }}>
            License Apply
          </Typography>
            : <></>}
          {!isEdit ? <Box display="flex" justifyContent="flex-end">
            <Tabs value={tabIndex} onChange={(event, newValue) => setTabIndex(newValue)}>
              <Tab label="Studio License" />
            </Tabs>
          </Box>
            : <></>}
          <Box sx={{ backgroundColor: "#ffffff" }}>
            {isEdit ? <Typography variant="h6" component="h1" gutterBottom sx={{ color: "#666666" }}>
              Apply ID : {applyId}
            </Typography> : <></>}
            {/* Accordion 1: Applicant Information */}
            <Accordion1
              isAdmin={isAdmin}
              isEdit={isEdit}
              selApplicant={selApplicant}
              setSelApplicant={setSelApplicant} />

            {/* Accordion 2: License Application Details */}
            <Accordion2
              startDate={startDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              endDateType={endDateType}
              setEndDateType={setEndDateType}
              licenseReason={licenseReason}
              handleLicenseReasonChange={setLicenseReason}
              isAdmin={isAdmin}
              isEdit={isEdit} />


            {/* Accordion 3: Review Result */}
            <Accordion3
              reviewResult={reviewResult}
              reason={reason}
              setReason={setReason}
              isAdmin={isAdmin}
              handleReviewResultChange={handleReviewResultChange}
            />

            {/* Accordion 4: Application Review Information */}
            <Accordion4
              createDate={createDate}
              reviewDate={reviewDate}
              reviewer={reviewer}
              failedReason={failedReason}
              isAdmin={isAdmin}
            />

            <Box display="flex" justifyContent="flex-end">
              {!isEdit ? <Button variant="contained" color="primary" onClick={() => send()}>
                送出
              </Button> : <></>}
            </Box>
          </Box>
        </Box>
      </Container>
      <style>{`
                /* 样式用于控制日期选择弹出框的位置 */
                .date-input::-webkit-calendar-picker-indicator {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    cursor: pointer;
                }
                /* 对于 Firefox 浏览器 */
                .date-input::-moz-calendar-picker-indicator {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    cursor: pointer;
                }
            `}</style>
      <LicenseEnoughTip open={dialogOpen} onClose={handleDialogClose} />
    </ThemeProvider>
  );
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({});

export default LicenseApply;