import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FormattedMessage } from "react-intl";
import {
  Popover,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import { SCREEN } from "../../Common/constants";
import language from "../../assets/icons/icon_language.png";

const DropdownItem = styled(MenuItem)`
  min-width: 8rem; /* 增加寬度以避免縮放問題 */
  cursor: pointer;
  padding: 8px 16px; /* 添加內邊距，改善可點擊區域 */
`;

const HeaderText = styled(Typography)`
  margin-left: 4px;
  @media screen and (max-width: ${SCREEN.LAPTOP}px) {
    display: none;
  }
`;

const LocaleDropdown = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const currentLocale = useSelector((state) => state.view.currentLocale);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLocaleChange = (newLocale) => {
    dispatch({ type: "SET_LOCALE", payload: newLocale });
    handleMenuClose();
  };

  const open = Boolean(anchorEl); // 確保 open 為布爾值
  const currentId = `locales.${currentLocale.includes("zh") ? "zh-TW" : "en-US"}`;

  return (
    <Box>
      <IconButton
        aria-label="change language"
        onClick={handleMenuOpen}
        color="inherit"
      >
        <img
          src={ language }
          alt="language"
          width="16"
          height="16"
          style={{ marginRight: 8 }}
        />
        <HeaderText variant="body1">
          <FormattedMessage id={currentId} />
        </HeaderText>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: { padding: "8px 0", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" },
        }}
      >
        <Box>
          {/* <DropdownItem onClick={() => handleLocaleChange("zh-TW")}>
            <FormattedMessage id="locales.zh-TW" />
          </DropdownItem> */}
          <DropdownItem onClick={() => handleLocaleChange("en-US")}>
            <FormattedMessage id="locales.en-US" />
          </DropdownItem>
        </Box>
      </Popover>
    </Box>
  );
};

export default LocaleDropdown;
