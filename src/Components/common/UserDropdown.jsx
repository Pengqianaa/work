import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"; // 引入 useLocation
import {
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from '@mui/icons-material/Person';
import styled from "styled-components";
import { SCREEN } from "../../constants/common";

const StyledMenuItem = styled(MenuItem)`
  min-width: 159px; // 固定下拉選單寬度
`;

const HeaderText = styled.span`
  font-size: 18px; 
  margin-left: 4px;
  @media screen and (max-width: ${SCREEN.LAPTOP}px) {
    display: none;
  }
`;

const ItTag = styled.span`
  font-size: 18px;
  margin-right: 16px;
`;

const UserDropdown = (props) => {
  const navigate = useNavigate();
  const location = useLocation(); // 獲取當前 URL 路徑
  const theme = useTheme();
  const isLaptopOrSmaller = useMediaQuery(theme.breakpoints.down(SCREEN.LAPTOP));
  const { isTestingEnv, setToggleTokenModal } = props;
  const user = useSelector((state) => state.user.user);
  const role = useSelector((state) => state.user.role);
  const userKey = useSelector((state) => state.user.userKey);
  const org = useSelector((state) => state.view.orgNTenantOrg);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // 綁定觸發點
  };

  const handleClose = () => {
    setAnchorEl(null); // 重置
  };

  const goToOrgTen = () => {
    navigate("/orgNTenant", { replace: true });
    handleClose();
  };

  const goToAdmin = () => {
    if (role.includes("ADMIN")) {
      navigate("/admin/license-mgt", { replace: true });
    } else if (role.includes("IT_ADMIN") && userKey.length === 0) {
      navigate("/admin/permission-mgt", { replace: true });
    } else {
      navigate("/admin/license-mgt", { replace: true });
    }
    handleClose();
  };

  const backToHome = () => {
    navigate("/task-info", { replace: true });
    handleClose();
  };

  // 判斷當前路徑是否為 /task-info 或 /license-apply
  const shouldHideBackToHome = (location.pathname === "/task-info" || location.pathname === "/license-apply")
    || (role.includes("IT_ADMIN") && userKey.length === 0);

  // 判斷角色是否GENERAL
  const shouldHideAdmin = (role.includes("GENERAL"));

  return (
    <>
      <ItTag>{`# ${org}`}</ItTag>
      <PersonIcon />{`${role}`}
      <Box
        sx={{
          // borderRadius: '4px',
          display: 'flex',
          alignItems: 'center', // 确保内部元素垂直居中
          height: '45px',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <Tooltip title={user.account}>
          <IconButton
            sx={{
              padding: "8px", // 調整內邊距
            }}
            onClick={handleClick}
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircleIcon />
            {!isLaptopOrSmaller && <HeaderText>{user.account}</HeaderText>}
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        open={!!anchorEl} // 確保布爾值
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <StyledMenuItem onClick={() => goToOrgTen()}>
          Switch Org & Tenant
        </StyledMenuItem>
        {!shouldHideAdmin && (
          <StyledMenuItem onClick={() => goToAdmin()}>
            Admin Console
          </StyledMenuItem>
        )}
        {!shouldHideBackToHome && ( // 根據條件渲染 Back To Home
          <StyledMenuItem onClick={() => backToHome()}>
            Back To Home
          </StyledMenuItem>
        )}
      </Menu>
    </>
  );
};

const mapStateToProps = (state) => ({
  permissions: state.permission.permissions,
  isTestingEnv: state.view.isTestingEnv,
});

const mapDispatchToProps = (dispatch) => ({
  setUserProfileShow: (show) =>
    dispatch({
      type: "SET_SHOW_PROFILE_MODAL",
      payload: show,
    }),
  setToggleTokenModal: (show) => {
    dispatch({ type: "SET_TOGGLE_TOKEN_MODAL", payload: show });
  },
  goToAdminPage: (goToPage) =>
    dispatch({
      type: "goToAdminPage",
      payload: goToPage,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDropdown);    