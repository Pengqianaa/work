import { memo } from "react";
import PropTypes from "prop-types";
import { Chip } from "@mui/material";
import { STATUS_TYPE } from "src/constants/common";

const Tag = ({ type = STATUS_TYPE.SUCCESS, label }) => (
  <Chip
    size="small"
    style={{
      backgroundColor: `var(--${type}-tag)`,
      margin: "2px",
      minWidth: 50,
    }}
    label={label}
  />
);

Tag.propTypes = {
  type: PropTypes.oneOf([
    STATUS_TYPE.SUCCESS,
    STATUS_TYPE.WARNING,
    STATUS_TYPE.ERROR,
  ]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export default memo(Tag);
