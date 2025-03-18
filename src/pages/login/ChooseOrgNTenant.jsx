import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ACTIONS } from "../../Reducers/UserReducer";
import { ACTIONS as ViewActions } from "../../Reducers/ViewReducer";
import { ACTIONS as PermissionActions } from "../../Reducers/PermissionReducer";

const ChooseOrgNTenant = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const role = useSelector((state) => state.user.role)
  const findUser = useSelector((state) => state.permission.findUser);
  const orgNTenantList = useSelector((state) => state.view.orgNTenantList);
  const orgNTenantOrg = useSelector((state) => state.view.orgNTenantOrg);
  const orgNTenantTenKey = useSelector((state) => state.view.orgNTenantTenKey);
  const orgNTenantTen = useSelector((state) => state.view.orgNTenantTen);
  const [orgValue, setOrgValue] = useState(orgNTenantOrg || "");
  const [tenantValue, setTenantValue] = useState(orgNTenantTenKey || "");
  const [filteredTenants, setFilteredTenants] = useState([]);
  let userKey = ''
  // Fetch organization and tenant list
  useEffect(() => {
    dispatch({ type: ACTIONS.GET_USER });
    dispatch({ type: ViewActions.GET_ORG_N_Tenant_LIST });
  }, []);

  useEffect(() => {
    const tenants = orgNTenantList.filter(
      (item) => item.orgName === orgValue
    ).map((item) => item);
    setFilteredTenants(tenants);
  }, [orgNTenantList]);

  // Log orgNTenantList for debugging
  useEffect(() => {
    // Filter tenants for the selected organization
    const tenants = orgNTenantList.filter(
      (item) => item.orgName === orgValue
    ).map((item) => item);
    setFilteredTenants(tenants);
  }, [orgValue]);

  // Update tenants when organization changes
  const handleOrgChange = (event) => {
    const org = event.target.value;
    setOrgValue(org);
    const tenants = orgNTenantList.filter(
      (item) => item.orgName === org
    ).map((item) => item);
    dispatch({ type: ViewActions.SET_ORG_N_Tenant_Org, payload: tenants });
  };

  // Handle tenant selection
  const handleTenantChange = (event) => {
    const tenantKey = event.target.value;
    const tenants = orgNTenantList.filter(
      (item) => item.tenantKey === tenantKey
    ).map((item) => item);
    setTenantValue(tenants[0].tenantKey);
    dispatch({ type: ViewActions.SET_ORG_N_Tenant_Ten, payload: tenants[0] });
    let userKey = ''
    try {
      const { code, username } = user;
      const data = new Promise((resolve, reject) => {
        dispatch({
          type: ACTIONS.GET_LOGIN_USER_KEY,
          payload: { orgName: orgValue, userCode: code, userAccount: username },
          resolve, reject
        });
      });
      userKey = data.data
    } catch (error) {
      // Handle the error thrown by CHECK_STATUS
      console.error("Error during GET_USER_KEY:", error);
      // Stop further execution
      return;
    }
  };

  const handleEnter = async () => {
    if (!orgValue || !tenantValue) {
      // alert("Please select both Organization and Tenant!");
      dispatch({
        type: ViewActions.SHOW_SNACKBAR_MESSAGE,
        payload: {
          show: true,
          props: {
            message: "Please select both Organization and Tenant!",
            msgType: 4,
            autoHideDuration: 6000,
          },
        },
      });
      return;
    }
    try {
      // Await the result of CHECK_USER_LOGIN to handle errors properly
      await new Promise((resolve, reject) => {
        dispatch({ type: ViewActions.CHECK_USER_LOGIN, payload: { orgName: orgValue, tenantName: orgNTenantTen }, resolve, reject });
      });
    } catch (error) {
      // Handle the error thrown by CHECK_USER_LOGIN
      console.error("Error during CHECK_USER_LOGIN:", error);
      // Stop further execution
      return;
    }
    //獲取permission 菜單列表
    dispatch({ type: PermissionActions.GET_MENU, payload: { orgName: orgValue } });
    navigate("/", { replace: true });

  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100vh", backgroundColor: "#f9f9f9" }}
    >
      <Container maxWidth="xs">
        {/* RPA Portal Title */}
        <Typography
          variant="h5"
          gutterBottom
          style={{ color: "#4CAF50", fontWeight: "bold", textAlign: "center" }} // 綠色字體
        >
          RPA Portal
        </Typography>
        <Card
          elevation={3}
          sx={{ padding: 3, width: "444px !important", margin: "0 auto" }}
        >
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ marginBottom: 3, fontWeight: "bold" }}
          >
            CHOOSE ORGANIZATION & TENANT
          </Typography>
          <CardContent>
            <Stack spacing={3}>
              <FormControl fullWidth style={{ marginBottom: 20 }}>
                <InputLabel
                  id="organization-label"
                  style={{ marginTop: -10 }}
                >
                  Organization name*
                </InputLabel>
                <Select
                  labelId="organization-label"
                  id="organization-select"
                  value={orgValue}
                  onChange={handleOrgChange}
                  sx={{ height: 48, fontSize: 14 }}
                >
                  {Array.from(
                    new Set(orgNTenantList.map((item) => item.orgName))
                  ).map((org) => (
                    <MenuItem key={org} value={org}>
                      {org}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel
                  id="tenant-label"
                  style={{ marginTop: -10 }}
                >
                  Tenant name*
                </InputLabel>
                <Select
                  labelId="tenant-label"
                  id="tenant-select"
                  value={tenantValue}
                  onChange={handleTenantChange}
                  sx={{ height: 48, fontSize: 14 }}
                  disabled={!orgValue} // Disable tenant dropdown until an org is selected
                >
                  {filteredTenants.map((tenant) => (
                    <MenuItem key={tenant.tenantKey} value={tenant.tenantKey}>
                      {tenant.tenantDisplayName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={handleEnter}
              aria-label="Enter organization and tenant"
              sx={{
                textTransform: "uppercase",
                padding: "8px 24px",
                fontWeight: "bold",
                minWidth: 160,
              }}
            >
              Enter
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default ChooseOrgNTenant;
