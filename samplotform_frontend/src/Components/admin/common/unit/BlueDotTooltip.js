/* eslint-disable */
import React, { memo } from "react";
import { Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import PropTypes from "prop-types";

const BlueDotTooltip = ({
  content,
  placement = "top-end",
  top = -16,
  right = -16,
}) => (
  <Tooltip title={content} placement={placement}>
    {content && (
      <InfoIcon
        style={{
          position: "absolute",
          top,
          right,
          color: "rgb(119, 176, 237)",
          borderRadius: "50%",
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    )}
  </Tooltip>
);

BlueDotTooltip.propTypes = {
  content: PropTypes.string,
  placement: PropTypes.string,
  top: PropTypes.number,
  right: PropTypes.number,
};

export default memo(BlueDotTooltip);
